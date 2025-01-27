import express from "express";
import {deleteBooking, getAllBookings, getBooking, insertBooking, updateBooking} from "../../db.js";
import { uid } from "uid";
import { err_log, respondwithstatus } from "../../util.js";
import { APIDocGenerator } from "../../docgen/doc.js";

const BookingRouter = express.Router(), doc = new APIDocGenerator("booking API", "'read a booking!'", import.meta.dirname, "api/booking");

doc.route("insertBooking", doc.POST, "inserts a new booking")
.request({
    customerId: doc.STRING_OR_NULL,
    startDate: doc.STRING,
    endDate: doc.STRING,
    amountPeople: doc.NUMBER,
    notes: doc.STRING,
    confirmed: doc.NUMBER
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
    if (booking.notes === undefined) return respondwithstatus(res, 400, "missing notes");
    if (booking.confirmed === undefined) return respondwithstatus(res, 400, "missing confirmed");


    try {
        await insertBooking(
            uid(), 
            booking.customerId,
            booking.startDate,
            booking.endDate,
            booking.amountPeople,
            booking.notes,
            booking.confirmed
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
        mailAddress: doc.STRING_OR_NULL,
        notes: doc.STRING,
        confirmed: doc.NUMBER
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

doc.route("updateBooking", doc.POST, "updates booking values")
.request({
    id: doc.STRING,
    customerId: doc.STRING_OR_NULL,
    startDate: doc.STRING,
    endDate: doc.STRING,
    amountPeople: doc.STRING,
    notes: doc.STRING,
    confirmed: doc.NUMBER
})
.response(200, "succesfully updated booking")

BookingRouter.post("/updateBooking", async (req, res) => {
    const booking = req.body;

    if (booking === undefined) return respondwithstatus(res, 400, "missing request body");
    if (booking.id === undefined) return respondwithstatus(res, 400, "missing id");

    // check if booking currently exists
    try {
        const existingBookingsList = await getBooking(booking.id);

        if (existingBookingsList.length === 0) {
            // no booking exists
            return respondwithstatus(res, 400, "no booking with id (" + booking.id + ") exists");
        }
    } catch(e) {
        err_log("error getting existing booking in /updateBooking", e);

        return respondwithstatus(res, 500, "something went wrong!");
    }

    if (booking.customerId === undefined) return respondwithstatus(res, 400, "missing customerId");
    if (booking.startDate === undefined) return respondwithstatus(res, 400, "missing startDate");
    if (booking.endDate === undefined) return respondwithstatus(res, 400, "missing endDate");
    if (booking.amountPeople === undefined) return respondwithstatus(res, 400, "missing amountPeople");
    if (booking.notes === undefined) return respondwithstatus(res, 400, "missing notes");
    if (booking.confirmed === undefined) return respondwithstatus(res, 400, "missing confirmed");


    try {

        await updateBooking(
            booking.id,
            booking.customerId,
            booking.startDate,
            booking.endDate,
            booking.amountPeople,
            booking.notes,
            booking.confirmed
        );

    } catch(e) {
        err_log("error in /updateBooking", e);

        return respondwithstatus(res, 500, "something went wrong!");
    }

    respondwithstatus(res, 200, "OK");
});


doc.route("deleteBooking", doc.POST, "deletes a single booking")
.request({
    id: doc.STRING
})
.response(200, "succesfully deleted booking");

BookingRouter.post("/deleteBooking", async (req, res) => {

    const booking = req.body;

    if (booking === undefined) return respondwithstatus(res, 400, "missing request body");
    if (booking.id === undefined) return respondwithstatus(res, 400, "missing id");

    try {
        await deleteBooking(booking.id);
    } catch(e) {
        err_log("error in /deleteBooking", e);

        return respondwithstatus(res, 500, "something went wrong!");
    }

    respondwithstatus(res, 200, "OK");

});

export default BookingRouter;