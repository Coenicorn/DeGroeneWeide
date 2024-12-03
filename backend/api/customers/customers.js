import express, { Router } from "express";
import {getAllCustomers, insertCustomer} from "../../db.js";

const CustomersRouter = express.Router();


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
CustomersRouter.get("/getAllCustomers", async (req, res) => {
    try {
        const customers = await getAllCustomers();
        res.json(customers);
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
CustomersRouter.post("/insertCustomer", async (req, res) => {

    try {
        const customer = req.body;

        if (
            !customer.id ||
            !customer.firstName ||
            !customer.lastName ||
            !customer.birthDate ||
            !customer.maySave ||
            !customer.creationDate ||
            !customer.blacklisted ||
            !customer.phoneNumber ||
            !customer.mailAddress
        ) {
            return res.status(400).send("Er ontbreekt data in de request.");
        }

        if(!isValidDate(customer.creationDate) || !isValidDate(customer.birthDate)){
            return res.status(400).send("creationDate of birthDate is geen goede data format.");
        }

        const result = await insertCustomer(customer.id, customer.firstName, customer.middleName, customer.lastName, customer.birthDate, customer.maySave, customer.creationDate, customer.blacklisted, customer.phoneNumber, customer.mailAddress);
        res.status(201).json({bericht:"Klant successvol toegevoegd",resultaat:result});
    } catch (error) {
        throw new Error("Er is iets fout gegaan tijdens het toevoegen van een klant. Error: " + error.message)
    }



});

function isValidDate(stringDate) {
    return !isNaN(Date.parse(stringDate));
}

export default CustomersRouter;