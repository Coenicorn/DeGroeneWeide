import express from "express";
import {getAllBookings, insertBooking} from "../../db.js";
import { uid } from "uid";
import { err_log, respondwithstatus } from "../../util.js";
import { APIDocGenerator } from "../../docgen/doc.js";

const BookingRouter = express.Router(), doc = new APIDocGenerator("booking API", "'read a booking!'", import.meta.dirname, "api/booking");

doc.route("insertBooking", doc.POST, "inserts a new booking")
.request({
    customerId: doc.STRING_OR_NULL,
    startDate: doc.STRING,
    endDate: doc.STRING,
    amountPeople: doc.NUMBER
})
.response(201, "succesfully added new booking");

BookingRouter.post("/insertBooking", async (req, res) => {

    const booking = req.body;

    // check of je alle vereiste hebt voor de booking
    // if(booking.customerId == null || booking.startDate == null || booking.endDate == null || booking.amountPeople == null){
    //     return res.status(400).send("Gegeven data is niet in het correcte format.");
    // }

    // required fields
    if (booking.customerId === undefined) return respondwithstatus(res, 400, "missing customer id");
    if (booking.startDate === undefined) return respondwithstatus(res, 400, "missing startDate");
    if (booking.endDate === undefined) return respondwithstatus(res, 400, "missing endDate");
    if (booking.amountPeople === undefined) return respondwithstatus(res, 400, "missing amountPeople");
  
    try {
        await insertBooking(
            uid(), 
            booking.customerId,
            booking.startDate,
            booking.endDate,
            booking.amountPeople
        );
    } catch(e) {
        err_log("error in /insertBooking", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

    respondwithstatus(res, 201, "OK");
});

doc.route("getAllBookings", doc.GET, "gets all bookings")
.response(200, null, [
    {
        id: doc.STRING,
        customerId: doc.STRING_OR_NULL,
        startDate: doc.STRING,
        endDate: doc.STRING,
        amountPeople: doc.NUMBER,
        creationDate: doc.STRING,
        firstName: doc.STRING_OR_NULL,
        middleName: doc.STRING_OR_NULL,
        lastName: doc.STRING_OR_NULL,
        maySave: doc.STRING_OR_NULL,
        birthDate: doc.STRING_OR_NULL,
        customerCreationDate: doc.STRING_OR_NULL,
        blacklisted: doc.STRING_OR_NULL,
        phoneNumber: doc.STRING_OR_NULL,
        mailAddress: doc.STRING_OR_NULL
    }
])

BookingRouter.get("/getAllBookings", async (req, res) => {

    try {

        const allBookings = await getAllBookings();

        return res.status(200).json(allBookings);

    } catch(e) {
        err_log("error in /getAllBookings", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

});

export default BookingRouter;