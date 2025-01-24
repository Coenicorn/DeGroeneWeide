import express, { Router } from "express";
import {
    deleteCustomerById,
    getAllCustomers,
    getCustomerById,
    insertCustomer,
    updateCustomer
} from "../../db.js";
import { APIDocGenerator } from "../../docgen/doc.js";
import {uid} from "uid";
import {err_log, respondwithstatus} from "../../util.js";
import BookingRouter from "../booking/booking.js";

const CustomersRouter = express.Router(), doc = new APIDocGenerator("customers API", "everything customers", import.meta.dirname, "api/customers");


/*
    Alles returned standaard met:
    {"bericht":"SYSTEEM BERICHT","resultaat":"result"}

     bericht - Berichtgeving voor systeem operaties
     resultaat - Het resultaat van de request in JSON, check altijd eerst op NULL.

    /api/cards/getAllCards GET Request. Geeft alle opgeslagen kaarten in de tabel `cards` in JSON format.
 */

/*
    /customers/getAllCustomers GET Request. Verkrijg alle Customers in JSON format.
 */

doc.route("getAllCustomers", doc.GET, "title says it all")
.response(200, "NOT TESTED", [
    {
        id: doc.STRING,
        firstName: doc.STRING,
        middleName: doc.STRING,
        lastName: doc.STRING,
        maySave: doc.NUMBER,
        birthDate: doc.STRING,
        creationDate: doc.STRING,
        blacklisted: doc.STRING,
        phoneNumber: doc.STRING,
        mailAddress: doc.STRING
    }
]);

CustomersRouter.get("/getAllCustomers", async (req, res) => {
    try {
        const customers = await getAllCustomers();
        res.status(200).json(customers);
    } catch (error) {
        console.log("Error while getting customers from server: " + error);
        res.status(500).send("Error while getting customers from server: " + error);
    }
});

/*
    /customers/insertCustomer POST Request. Voeg een customer toe aan de database. Vereiste: id, firstName, middleName, lastName, birthDate, maySave, creationDate, blacklisted, phoneNumber en mailAddress
    Voorbeeld body:
    {"id":"ID HIER","firstName":"Johnnie","middleName":"","lastName":"Doe","birthDate":"2005-03-10T11:35:00+01:00","maySave":"false","creationDate":"2005-03-10T11:35:00+01:00","blacklisted":"false","phoneNumber":"06123456789","mailAddress":"test@gmail.com"}
 */

doc.route("insertCustomer", doc.POST, "inserts a single customer")
.request({
    firstName: doc.STRING,
    middleName: doc.STRING,
    lastName: doc.STRING,
    maySave: doc.NUMBER,
    birthDate: doc.STRING,
    blacklisted: doc.STRING,
    phoneNumber: doc.STRING,
    mailAddress: doc.STRING
}, "NOT TESTED")
.response(201, "succesfully added customer", {
    customerId: doc.STRING
});

CustomersRouter.post("/insertCustomer", async (req, res) => {

    try {
        const customer = req.body;

        console.log(customer);

        if (
            customer.firstName === undefined ||
            customer.lastName === undefined ||
            customer.birthDate === undefined ||
            customer.maySave === undefined ||
            customer.blacklisted === undefined ||
            customer.phoneNumber === undefined ||
            customer.mailAddress === undefined
        ) {
            return res.status(400).send("Er ontbreekt data in de request.");
        }

        if(!isValidDate(customer.birthDate)){
            return res.status(400).send("creationDate of birthDate is geen goede data format.");
        }

        const customerId = uid();


        await insertCustomer(customerId, customer.firstName, customer.middleName, customer.lastName, customer.birthDate, customer.maySave, customer.blacklisted, customer.phoneNumber, customer.mailAddress);

        
        res.status(201).json({ customerId });
    } catch (error) {
        // throw new Error("Er is iets fout gegaan tijdens het toevoegen van een klant. Error: " + error.message)
        err_log("error in insertCustomer", error);

        return respondwithstatus(res, 500, "something went wrong");
    }
});

doc.route("deleteCustomer", doc.POST, "deletes a single customer")
    .request({
        customerId: doc.STRING
    }, "NOT TESTED")
    .response(200, "succesfully deleted customer", {
        customerId: doc.STRING
    });

CustomersRouter.post("/deleteCustomer", async (req, res) => {

   try {
       const customer = req.body;

       if(customer.customerId === undefined) {
           return res.status(400).send("customerId ontbreekt.")
       }

       await deleteCustomerById(customer.customerId);
       res.status(200).json({ customerId: customer.customerId });

   } catch(error) {
       err_log("Error while deleting customer", error);
       return respondwithstatus(res, 500, "something went wrong");
   }


doc.route("updateCustomer", doc.POST, "updates customer values")
    .request({
        customerId: doc.STRING,
        firstName: doc.STRING,
        middleName: doc.STRING,
        lastName: doc.STRING,
        maySave: doc.NUMBER,
        birthDate: doc.STRING,
        creationDate: doc.STRING,
        blacklisted: doc.NUMBER,
        phoneNumber: doc.STRING,
        mailAddress: doc.STRING
    })
    .response(200, "succesfully updated customer");

BookingRouter.post("/updateCustomer", async (req, res) => {
    const customer = req.body;

    if (customer === undefined) return respondwithstatus(res, 400, "missing request body");
    if (customer.customerId === undefined) return respondwithstatus(res, 400, "missing id");

    // check if booking currently exists
    try {
        const existingBookingsList = await getCustomerById(customer.customerId);

        if (existingBookingsList.length === 0) {
            // no booking exists
            return respondwithstatus(res, 400, "no customer with id (" + customer.customerId + ") exists");
        }
    } catch(e) {
        err_log("error getting existing booking in /updateCustomer", e);

        return respondwithstatus(res, 500, "something went wrong!");
    }

    if (customer.firstName === undefined) return respondwithstatus(res, 400, "missing firstName");
    if (customer.middleName === undefined) return respondwithstatus(res, 400, "missing middleName");
    if (customer.lastName === undefined) return respondwithstatus(res, 400, "missing lastName");
    if (customer.maySave === undefined) return respondwithstatus(res, 400, "missing maySave");
    if (customer.birthDate === undefined) return respondwithstatus(res, 400, "missing birthDate");
    if (customer.creationDate === undefined) return respondwithstatus(res, 400, "missing creationDate");
    if (customer.blacklisted === undefined) return respondwithstatus(res, 400, "missing blacklisted");
    if (customer.phoneNumber === undefined) return respondwithstatus(res, 400, "missing phoneNumber");
    if (customer.mailAddress === undefined) return respondwithstatus(res, 400, "missing mailAddress");

    try {

        await updateCustomer(
            customer.firstName,
            customer.middleName,
            customer.lastName,
            customer.maySave,
            customer.birthDate,
            customer.creationDate,
            customer.blacklisted,
            customer.phoneNumber,
            customer.mailAddress
        );

    } catch(e) {
        err_log("error in /updateCustomer", e);

        return respondwithstatus(res, 500, "something went wrong!");
    }

    respondwithstatus(res, 200, "OK");
});

});

function isValidDate(stringDate) {
    return !isNaN(Date.parse(stringDate));
}

export default CustomersRouter;