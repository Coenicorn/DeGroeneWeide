import { Router } from "express";

import CardsRouter from "./cards/cards.js";
import ReadersRouter from "./readers/index.js";
import AuthRouter from "./auth/index.js";
import CustomersRouter from "./customers/customers.js";
import BookingRouter from "./booking/booking.js";
import { db_execute, db_query, insertBooking, insertCard, insertCustomer } from "../db.js";
import config from "../config.js";
import { deleteOldTempReservations, err_log, info_log, respondwithstatus, sqliteDATETIMEToDate } from "../util.js";
import { APIDocGenerator } from "../docgen/doc.js";
import { onlyAdminPanel } from "../apiKey.js";
import { uid } from "uid";
import { sendMailConfirmationEmail } from "../mailer.js";

const APIRouter = Router(), doc = new APIDocGenerator("API root", "root API routes", import.meta.dirname, "api");

// API key
// only if enabled
if (config.enableAPIKey != 0) APIRouter.use(onlyAdminPanel);

doc.route("browse", doc.GET, "development helper to quickly view the current database as JSON. Meant for use in webbrowser on `http(s)://[HOST]/api/browse`")
.response(200, "json view of the current database");

if (config.environment === "dev"){
    info_log("hosting database explorer on http://localhost:" + config.serverPort + "/api/browse");

    APIRouter.use("/browse", async (req, res) => {
        let response = {};

        const tables = await db_query("select name from sqlite_master where type='table'");
        for (let table of tables) {
            response[table.name] = await db_query("select * from " + table.name);
        }

        res.json(response);
    });
}


doc.route("send-reservation", doc.POST, "send a temporary reservation from the frontend to the backend. Needs to be confirmed by email", true)
.request({
    firstName: doc.STRING,
    lastName: doc.STRING,
    mailAddress: doc.STRING,
    phoneNumber: doc.STRING,
    blacklisted: doc.NUMBER,
    birthDate: doc.STRING,
    maySave: doc.NUMBER,
    startDate: doc.STRING,
    endDate: doc.STRING,
    amountPeople: doc.STRING
})
.response(200, "successfully added temporary reservation. A link has been sent to the mailaddress entered in the request, when the link isn't clicked withint 10 minutes the temporary reservation gets deleted!")

APIRouter.post("/send-reservation", async (req, res) => {

    if (req.body === undefined) return respondwithstatus(res, 400, "missing request body");

    const reservation = req.body;

    if (reservation.firstName === undefined) return respondwithstatus(res, 400, "missing firstname");
    if (reservation.lastName === undefined) return respondwithstatus(res, 400, "missing lastName");
    if (reservation.mailAddress === undefined) return respondwithstatus(res, 400, "missing mailAddress");
    if (reservation.phoneNumber === undefined) return respondwithstatus(res, 400, "missing phoneNumber");
    if (reservation.blacklisted === undefined) return respondwithstatus(res, 400, "missing blacklisted");
    if (reservation.birthDate === undefined) return respondwithstatus(res, 400, "missing lastNbirthDateame");
    if (reservation.maySave === undefined) return respondwithstatus(res, 400, "missing maySave");
    if (reservation.startDate === undefined) return respondwithstatus(res, 400, "missing startDate");
    if (reservation.endDate === undefined) return respondwithstatus(res, 400, "missing endDate");
    if (reservation.amountPeople === undefined) return respondwithstatus(res, 400, "missing amountPeople");

    const tempReservationUid = uid(32);

    try {

        await db_execute(`
            INSERT INTO
                TempReservations (
                id,
                firstName,
                lastName,
                mailAddress,
                phoneNumber,
                blacklisted,
                birthDate,
                maySave,
                startdate,
                endDate,
                amountPeople,
                notes
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        `, [
            tempReservationUid,
            reservation.firstName,
            reservation.lastName,
            reservation.mailAddress,
            reservation.phoneNumber,
            reservation.blacklisted,
            reservation.birthDate,
            reservation.maySave,
            reservation.startDate,
            reservation.endDate,
            reservation.amountPeople,
            reservation.notes
        ]);

    } catch(e) {
        err_log("error in /send-reservation", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

    // SEND MAIL
    const link = req.protocol + "://" + req.get("host") + "/api/verify-mail/" + tempReservationUid;
    info_log("sent verify link " + link + " to " + reservation.mailAddress);

    // send email with nice html styling to the mailaddress of the reservation with the link
    sendMailConfirmationEmail(link, reservation.mailAddress, reservation.firstName);

    respondwithstatus(res, 200, "OK");

});

doc.route("verify-mail/:reservation_uid", doc.GET, "verifies mail with reservation_uid. Only supposed to be used from link sent in mail", true)
.response(301, "redirect naar mail_confirmed.html");

APIRouter.get("/verify-mail/:reservation_uid", async (req, res) => {

    const reservationUid = req.params.reservation_uid;

    if (reservationUid === undefined) return respondwithstatus(res, 400, "unknown reservation uid");

    let tempReservations;

    try {
        tempReservations = await db_query(`
            SELECT * FROM TempReservations WHERE id = ?
        `, [reservationUid]);
    } catch(e) {
        err_log("error in /verify-mail", e);

        return respondwithstatus(res, 500, "something went wrong!");
    }

    // check if the link is valid
    if (
        tempReservations.length === 0 ||
        tempReservations.length > 1
    ) {
        // link not valid, redirect to uid not found page
        const uidNotFoundParams = new URLSearchParams([
            ["confirmed", "no"]
        ]);

        return res.redirect("/mail_confirmed.html?" + uidNotFoundParams.toString());
    }

    const reservation = tempReservations[0];

    info_log(`reservation for '${reservation.mailAddress}' was confirmed through link`);

    // delete temp reservation
    try {
        await db_execute("DELETE FROM TempReservations WHERE id=?", [reservation.id]);
    } catch(e) {
        err_log("non-fatel error in /verify-mail: Temp reservation was verified, but couldn't be deleted. This error COULD result in a booking getting added multiple times, please look into it.", e);
    }

    // reservation is legit, add customer and booking with confirmed=0
    try {
        const customerId = uid();

        await insertCustomer(
            customerId,
            reservation.firstName,
            "",
            reservation.lastName,
            reservation.birthDate,
            reservation.maySave,
            reservation.blacklisted,
            reservation.phoneNumber,
            reservation.mailAddress
        );
        info_log(`added new customer '${reservation.firstName} ${reservation.lastName}' with id (${customerId})`);
        
        const bookingId = uid();

        await insertBooking(
            bookingId,
            customerId,
            reservation.startDate,
            reservation.endDate,
            reservation.amountPeople,
            reservation.notes
        );
        info_log(`added new booking with id (${bookingId}) for customer id (${customerId})`)

    } catch(e) {
        err_log("error in /verify-mail", e);

        return respondwithstatus(res, 500, "something went wrong!");
    }

    const params = new URLSearchParams([
        ["confirmed", "yes"]
    ]);

    try {
        params.set("name", reservation.firstName);
    } catch(e) { /* do nothing, proceed to redirect */ }

    res.redirect("/mail_confirmed.html?" + params.toString());

})

APIRouter.use("/cards", CardsRouter);
APIRouter.use("/customers", CustomersRouter)
APIRouter.use("/readers", ReadersRouter);
APIRouter.use("/auth", AuthRouter);
APIRouter.use("/booking", BookingRouter);

export default APIRouter;