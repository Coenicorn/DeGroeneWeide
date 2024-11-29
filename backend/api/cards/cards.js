import express, { Router } from "express";
import {deleteCards, getAllCards, getCardById, getCardByUUID, getCardTokenByCardUuid, insertCard} from "../../db.js";

const CardsRouter = express.Router();

/*
    Alles returned standaard met:
    {"bericht":"SYSTEEM BERICHT","resultaat":"result"}

     bericht - Berichtgeving voor systeem operaties
     resultaat - Het resultaat van de request in JSON, check altijd eerst op NULL.

    /api/getAllCards GET Request. Geeft alle opgeslagen kaarten in de tabel `cards` in JSON format.
 */

CardsRouter.get("/getAllCards", async (req, res) => {
    try {
        const cards = await getAllCards();
        res.json(cards);
    } catch (error) {
        console.log("Error while getting cards from server: " + error);
        res.status(500).send("Sorry! Er heeft een interne fout opgetreden.")
    }
});

/*
       /api/getCard GET Request. Specifieke kaart kan opgevraagd worden op basis van Database entry ID of de UUID die op de NFC kaart staat.
       Body voorbeeld:
       '{"card_uuid":"UUID HIER"}' of '{"entryId":"1"}' of een opsomming van beide
 */
CardsRouter.get("/getCard", async (req, res) => {
    try {
        const info = req.body;

        if(info.entryId != null){
            const result = await getCardById(info.entryId);
            return res.status(200).json({bericht:"Kaart gevonden door entry Id",resultaat: result});
        } else if (info.card_uuid != null){
            const result = await getCardByUUID(info.card_uuid);
            return res.status(200).json({bericht:"Kaart gevonden door card uuid", resultaat: result});
        } else {
            return res.status(404).send("Niks gevonden. Weet je zeker dat je `entryId` of `card_uuid` hebt opgegeven?");
        }
    } catch (error) {
        res.status(400).send("Er mist informatie om de kaart op te halen: " + error);
    }

});

/*
   /api/getCardTokenByCardUuid GET Request. Vraag een token op van een kaart, op basis de uuid op de NFC kaart.
   Body voorbeeld:
   '{"card_uuid":"UUID HIER"}'

 */
CardsRouter.get("/getCardTokenByCardUuid", async (req, res) => {
    try {
        const info = req.body;

        if (info.card_uuid == null) {
            return res.status(400).send("Card_uuid is vereiste.");
        }

        const result = await getCardTokenByCardUuid(info.card_uuid);
        if (!result) {
            return res.status(500).send("Er is mogelijk iets fout gegaan tijdens het ophalen van een token.");
        }

        return res.status(200).json({bericht: "Token gevonden door card_uuid", resultaat: result});
    } catch (error) {
        res.status(500).send("Er is iets mis gegaan tijdens het ophalen van de token.");
    }
});

/*
       /api/insertCard POST Request. Voeg een kaart toe aan de tabel. Vereiste velden: Id, card_uuid, booking_Id, token en blocked
 */
CardsRouter.post("/insertCard", async (req, res) => {
    try {
        const card = req.body;

        if (
            !card.Id ||
            !card.card_uuid ||
            !card.booking_Id ||
            !card.token ||
            typeof card.blocked !== 'boolean'
        ) {
            return res.status(400).send("Gegeven data is niet in het correcte format.");
        }

        const result = await insertCard(card.Id, card.card_uuid, card.booking_Id, card.token, card.blocked);
        res.status(201).json({bericht:"Kaart successvol toegevoegd",resultaat: result});

    } catch (error) {
        console.log("Error tijdens het kaart toevoegen: " + error.message);
        res.status(500).send("Er is iets fout gegaan tijdens het toevoegen van de kaart.")
    }
});

CardsRouter.post("/deleteAllCards", async (req, res) => {
    const deletion = req.body;

    if(!deletion.confirm){
        return res.status(400).send("Een confirmatie is vereist bij het verwijderen van alle kaarten.");
    }

    const result = await deleteCards(deletion.confirm);
    if(!result){
        return res.status(500).send("Er is iets fout gegaan tijdens het verwijderen van alle kaarten.");
    }
    res.status(200).json({bericht:"Alle kaarten zijn verwijderd.",resultaat: result});
});

CardsRouter.post("/removeCardByCardUuid", async (req, res) => {
    const card = req.body;

    if(card.card_uuid == null){
        return res.status(400).send("Card_UUID is vereiste.");
    }

});

CardsRouter.post("/removeCardByBookingId", async (req, res) => {
    const card = req.body;

    if(card.booking_id == null)  {
        return res.status(400).send("Booking ID is vereiste.");
    }
});

CardsRouter.post("/removeCardByEntryId", async (req, res) => {
    const card = req.body;

    if(card.entryId == null){
        return res.status(400).send("EntryId is vereiste.");
    }
});

export default CardsRouter;