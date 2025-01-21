import express from "express";
import {getAllBookings, insertBooking} from "../../db.js";
import { uid } from "uid";
import { respondwithstatus } from "../../util.js";

const BookingRouter = express.Router();

// Vereiste:
BookingRouter.post("/insertBooking", async (req, res) => {

    const booking = req.body;

    // check of je alle vereiste hebt voor de booking
    // if(booking.customerId == null || booking.startDate == null || booking.endDate == null || booking.amountPeople == null){
    //     return res.status(400).send("Gegeven data is niet in het correcte format.");
    // }

    // required fields
    if (booking.id === undefined) return respondwithstatus(res, 400, "missing id");
    if (booking.customerId === undefined) return respondwithstatus(res, 400, "missing customer id");
    if (booking.startDate === undefined) return respondwithstatus(res, 400, "missing startDate");
    if (booking.endDate === undefined) return respondwithstatus(res, 400, "missing endDate");
    if (booking.amountPeople === undefined) return respondwithstatus(res, 400, "missing amountPeople");
    if (booking.creationDate === undefined) return respondwithstatus(res, 400, "missing creationDate");
  
    try {
        await insertBooking();
    } catch(e) {
        err_log("error in /insertBooking", e);
        
        return respondwithstatus(res, 500, "something went wrong");
    }

    respondwithstatus(res, 200, "OK");
});

BookingRouter.get("/getAllBookings", async (req, res) => {
    try {
        const bookings = await getAllBookings();
        res.json(bookings);
    } catch (error) {
        throw new Error("Sorry! Er heeft een interne fout opgetreden.");
    }

    //res.status(200).send("aight");

});

export default BookingRouter;