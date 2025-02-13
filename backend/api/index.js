import { Router } from "express";

import CardsRouter from "./cards/cards.js";
import ReadersRouter from "./readers/index.js";
import AuthRouter from "./auth/index.js";
import CustomersRouter from "./customers/customers.js";
import BookingRouter from "./booking/booking.js";
import { db_execute, db_query, insertBooking, insertCard, insertCustomer } from "../db.js";
import config from "../config.js";
import { debug_log, deleteOldTempReservations, err_log, info_log, respondwithstatus, sqliteDATETIMEToDate, validateIncomingFormData, verifyCaptchaStringWithGoogle } from "../util.js";
import { APIDocGenerator } from "../docgen/doc.js";
import { isPublicRoute, onlyAdminPanel } from "../apiKey.js";
import { uid } from "uid";
import { sendMailConfirmationEmail } from "../mailer.js";
import * as fs from "fs";
import path from "path";
import express from "express";
import { DataViewManager } from "../dataview/manager.js";
import onFinished from "on-finished";
import { DataViewTypes } from "../dataview/dataviewtypes.js";

const APIRouter = Router(), doc = new APIDocGenerator("API root", "root API routes", import.meta.dirname, "api");

// dataview
APIRouter.use(express.static(path.join(import.meta.dirname, "../resources/dataview")));

// dataview
APIRouter.use((req, _res, next) => {

    const isProbablyBrowser = isPublicRoute(req.originalUrl);
    const isProbablyReader = req.originalUrl.includes("imalive");
    let sourceEntity;
    if (isProbablyReader) sourceEntity = DataViewTypes.ENTITY_READER;
    else if (isProbablyBrowser) sourceEntity = DataViewTypes.ENTITY_CLIENT;
    else sourceEntity = DataViewTypes.ENTITY_ADMIN;

    const u = req.originalUrl;
    const m = req.method === "GET"? DataViewTypes.F_GET : DataViewTypes.F_POST;

    DataViewManager.request(req, u, m, sourceEntity);

    onFinished(req, (err, res) => {
        DataViewManager.response(_res, u, m, sourceEntity);
    })

    next();

})

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
    startDate: doc.STRING,
    endDate: doc.STRING,
    amountPeople: doc.STRING,
    accomodation: doc.STRING,
    notes: doc.STRING,
    captcha: doc.STRING
})
.response(200, "successfully added temporary reservation. A link has been sent to the mailaddress entered in the request, when the link isn't clicked withint 10 minutes the temporary reservation gets deleted!")

APIRouter.post("/send-reservation", async (req, res) => {

    if (req.body === undefined) return respondwithstatus(res, 400, "missing request body");

    const captchaString = req.body.captcha;

    if (captchaString === undefined) {
        err_log("didn't receive a captcha string in reservation request");
        
        return respondwithstatus(res, 400, "missing captcha");
    }

    const captchaVerified = verifyCaptchaStringWithGoogle(captchaString);

    if (!captchaVerified) {
        debug_log("ip " + req.ip + " failed captcha");

        return respondwithstatus(res, 400, "failed captcha");
    }

    const reservation = req.body;

    // check data format
    const mvn = validateIncomingFormData(
        reservation.firstName,
        reservation.lastName,
        reservation.mailAddress,
        reservation.phoneNumber,
        reservation.startDate,
        reservation.endDate,
        reservation.amountPeople,
        reservation.accomodation,
        reservation.notes
    );

    if (mvn) return res.status(400).json({mvn});

    let existingTempReservations;

    try {
        existingTempReservations = await db_query("SELECT * FROM TempReservations WHERE mailAddress=?", [reservation.mailAddress]);
    } catch(e) {
        err_log("error fetching temp reservations with existing mailaddress", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

    if (existingTempReservations.length >= 5) return respondwithstatus(res, 400, "toomany");

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
            VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?,?,?,?)
        `, [
            tempReservationUid,
            reservation.firstName,
            reservation.lastName,
            reservation.mailAddress,
            reservation.phoneNumber,
            0,
            0,
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

    if (existingTempReservations.length > 0) return respondwithstatus(res, 200, "duplicate");

    respondwithstatus(res, 200, "success");

});

function sendToMailConfirmedPage(res, confirmed = false, name = null) {

    const confirmedHTML = `
        <div id="confirmed">
            <h1>
                Hallo $NAAM!
            </h1>
            <p>Leuk dat je hebt gekozen voor <span id="groeneweide-brand-name">De Groene Weide</span>!</p>
            <p>Door de link in je inbox te klikken heb je je identiteit bevestigd.</p>
            <p>Je reservering moet alleen nog goedgekeurd worden door onze staf, wij gaan zo snel mogelijk aan de slag om dat voor elkaar te krijgen.</p>
            <h3>Tot snel!</h3>
        </div>
    `;
    const notConfirmedHTML = `
        <div id="not-confirmed">
            <h1>Sorry!</h1>
            <p>We hebben geen reservering gevonden.</p>
            <p>Als dit een foutje is, probeer dan alstjeblieft opnieuw te reserveren.</p>
        </div>
    `;
    let totalPage = fs.readFileSync(path.join(import.meta.dirname, "../resources/mail_confirmed.html"), "utf-8");

    totalPage = totalPage.replace("$CONFIRMED_HTML", (confirmed === true)? confirmedHTML : notConfirmedHTML);
    totalPage = totalPage.replace("$NAAM", name);
    totalPage = totalPage.replace("$PAGINA", (confirmed === true)? "<a href='/' id='what-page'>hoofdpagina</a>" : "<a href='/reserveren.html' id='what-page'>reserveringspagina</a>")

    res.status(200).send(totalPage);
}

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
        return sendToMailConfirmedPage(res, false);
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

    // delete new booking

    return sendToMailConfirmedPage(res, true, reservation.firstName);

});






APIRouter.use("/cards", CardsRouter);
APIRouter.use("/customers", CustomersRouter)
APIRouter.use("/readers", ReadersRouter);
APIRouter.use("/auth", AuthRouter);
APIRouter.use("/booking", BookingRouter);

export default APIRouter;