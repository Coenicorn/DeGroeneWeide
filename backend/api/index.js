import { Router } from "express";

import CardsRouter from "./cards/cards.js";
import ReadersRouter from "./readers/index.js";
import AuthRouter from "./auth/index.js";
import CustomersRouter from "./customers/customers.js";
import BookingRouter from "./booking/booking.js";
import { db_execute, db_query } from "../db.js";
import config from "../config.js";
import { deleteOldTempReservations, err_log, info_log, respondwithstatus, sqliteDATETIMEToDate } from "../util.js";
import { APIDocGenerator } from "../docgen/doc.js";
import { onlyAdminPanel } from "../apiKey.js";
import { uid } from "uid";

const APIRouter = Router(), doc = new APIDocGenerator("API root", "root API routes", import.meta.dirname, "api");

// API key
APIRouter.use(onlyAdminPanel);

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
                amountPeople    
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
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
            reservation.amountPeople
        ]);

    } catch(e) {
        err_log("error in /send-reservation", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

    await deleteOldTempReservations();

    respondwithstatus(res, 200, "OK");

});

APIRouter.get("/verify-mail")

APIRouter.use("/cards", CardsRouter);
APIRouter.use("/customers", CustomersRouter)
APIRouter.use("/readers", ReadersRouter);
APIRouter.use("/auth", AuthRouter);
APIRouter.use("/booking", BookingRouter);

export default APIRouter;