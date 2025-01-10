import express from "express";
import { db_execute, db_query } from "../../db.js";
import { err_log, respondwithstatus } from "../../util.js";

const BookingRouter = express.Router();

// Vereiste:
BookingRouter.post("/insertBooking", async (req, res) => {

    const booking = req.body;

    // check of je alle vereiste hebt voor de booking

    // DEBUG DEMO add placeholder data
    try {
        await db_execute(`
            INSERT INTO Customers (id, firstName, middleName, lastName, maySave, creationDate, blacklisted, phoneNumber, mailAddress)
            VALUES ('000', 'John', 'D.', 'Doe', '1', '1', '0', '06123456789', 'john.doe@deezmail.cum')    
        `);
    } catch(e) {
        err_log("failed to add customer", e);
    }


    try {
        await db_execute(`
            INSERT INTO Bookings (id, customerId, startDate, endDate, amountPeople)
            VALUES ('000', '000', 1, 2, '1')    
        `);
    } catch(e) {
        err_log("failed to add booking", e);
    }

    respondwithstatus(res, 200, "aight");

});

BookingRouter.get("/getBookings", async (req, res) => {
    try {
        const bookingsExtended = await db_query(`
            SELECT * FROM Bookings AS b
            JOIN Customers AS c ON c.id = b.customerId
        `);

        console.log(bookingsExtended);
    } catch(e) {
        err_log("/getBookings: failed to query", e);

        return respondwithstatus(res, 500, "something went wrong");
    }
});

export default BookingRouter;