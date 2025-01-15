import express from "express";
import {getAllBookings, insertBooking} from "../../db.js";

const BookingRouter = express.Router();

// Vereiste:
BookingRouter.post("/insertBooking", async (req, res) => {

    const booking = req.body;

    // check of je alle vereiste hebt voor de booking
    if(booking.id == null || booking.customerId == null || booking.startDate == null || booking.endDate == null || booking.amountPeople == null){
        return res.status(400).send("Gegeven data is niet in het correcte format.");
    }
  
    const result = await insertBooking(booking.id, booking.customerId, booking.startDate, booking.endDate, booking.amountPeople);
    res.status(201).json({bericht:"Boeking succesvol toegevoegd",resultaat:result});
});

BookingRouter.get("/getAllBookings", async (req, res) => {
    try {
        const bookings = await getAllBookings();
        res.json(bookings);
    } catch (error) {
        throw new Error("Sorry! Er heeft een interne fout opgetreden.")
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

export default BookingRouter;