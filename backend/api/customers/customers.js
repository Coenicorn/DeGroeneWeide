import express, { Router } from "express";
import {blacklistCustomer, getAllCustomers, insertCustomer} from "../../db.js";
import { APIDocGenerator } from "../../docgen/doc.js";
import {uid} from "uid";
import { respondwithstatus } from "../../util.js";

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

function isValidDate(stringDate) {
    return !isNaN(Date.parse(stringDate));
}

export default CustomersRouter;