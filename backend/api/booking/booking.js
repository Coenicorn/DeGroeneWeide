import express from "express";
import {getAllBookings, insertBooking} from "../../db.js";
import { uid } from "uid";

const BookingRouter = express.Router();

// Vereiste:
BookingRouter.post("/insertBooking", async (req, res) => {

    const booking = req.body;

    // check of je alle vereiste hebt voor de booking
    // if(booking.customerId == null || booking.startDate == null || booking.endDate == null || booking.amountPeople == null){
    //     return res.status(400).send("Gegeven data is niet in het correcte format.");
    // }

    // required fields
    // if (booking.)
  
    const result = await insertBooking(uid(), booking.customerId, booking.startDate, booking.endDate, booking.amountPeople);
    res.status(201).json({bericht:"Boeking succesvol toegevoegd",resultaat:result});
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