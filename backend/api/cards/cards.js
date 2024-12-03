import express, { Router } from "express";
import {
    deleteCards,
    getAllCards,
    getCardById,
    getCardByUUID,
    getCardTokenByCardUuid,
    insertCard,
    removeCardByBookingId, removeCardByID,
    updateCard
} from "../../db.js";
import { respondwithstatus, err_log, info_log } from "../../util.js";

const CardsRouter = express.Router();

/*
    Alles returned standaard met:
    {"bericht":"SYSTEEM BERICHT","resultaat":"result"}

     bericht - Berichtgeving voor systeem operaties
     resultaat - Het resultaat van de request in JSON, check altijd eerst op NULL.

    /api/cards/getAllCards GET Request. Geeft alle opgeslagen kaarten in de tabel `cards` in JSON format.
    Invoke-WebRequest -Uri http://localhost:3001/api/cards/getAllCards -Method GET -ContentType "application/json"
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
       /cards/getCard GET Request. Specifieke kaart kan opgevraagd worden op basis van Database entry ID of de UUID die op de NFC kaart staat.
       Body voorbeeld:
       '{"card_uuid":"UUID HIER"}' of '{"entryId":"1"}' of een opsomming van beide
 */
CardsRouter.get("/getCard", async (req, res) => {
    try {
        const info = req.body;

        if(info.entryId != null){
            const result = await getCardById(info.entryId);
            return res.status(200).json({bericht:"Kaart gevonden door entry id",resultaat: result});
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
   /cards/getCardTokenByCardUuid GET Request. Vraag een token op van een kaart, op basis de uuid op de NFC kaart.
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
       /cards/insertCard POST Request. Voeg een kaart toe aan de tabel. Vereiste velden: id, card_uuid, booking_id, token en blocked
       Body voorbeeld: '{"id":"ID","card_uuid":"CARD UUID HIER","booking_id":"BOOKING ID HIER","token":"randomToken","blocked":"false"}'
 */
CardsRouter.post("/insertCard", async (req, res) => {
    try {
        const card = req.body;
        console.log(card);

        if (
            !card.id ||
            !card.card_uuid ||
            card.level === undefined ||
            !card.booking_id ||
            !card.token ||
            card.blocked === undefined
        ) {
            return res.status(400).send("Gegeven data is niet in het correcte format.");
        }

        const result = await insertCard(card.id, card.card_uuid, card.booking_id, card.token, card.level, card.blocked);
        res.status(201).json({bericht:"Kaart successvol toegevoegd",resultaat: result});

    } catch (error) {
        console.log("Error tijdens het kaart toevoegen: " + error.message);
        res.status(500).send("Er is iets fout gegaan tijdens het toevoegen van de kaart.");
    }
});

/*
       /cards/deleteAllCards POST Request. Verwijder alle kaarten uit de tabel. Vereist veld: confirm
       Voorbeeld body:
       '{"confirm":"false"}'

 */
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

/*
    /cards/removeCardByCardUuid POST Request. Verwijder een kaart op card_uuid. Vereist veld: card_uuid
    Voorbeeld body:
    '{"card_uuid":"CARD UUID HIER"}'
 */
CardsRouter.post("/removeCardByCardUuid", async (req, res) => {
    const card = req.body;

    if(card.card_uuid == null){
        return res.status(400).send("Card_UUID is vereiste.");
    }

});

/*
    /cards/removeCardByBookingId POST Request. Verwijder kaart bij boeking ID. Vereist veld: booking_id
    Voorbeeld body:
    '{"booking_uuid":"ID HIER"}'
 */
CardsRouter.post("/removeCardByBookingId", async (req, res) => {
    const card = req.body;
    if(card.booking_id == null)  {
        return res.status(400).send("Booking ID is vereiste.");
    }
    const result = await removeCardByBookingId(card.booking_id);
    return res.status(200).json({bericht:"Kaart is verwijderd", resultaat:result});
});

/*
    /cards/removeCardByEntryId POST Request. Verwijder een kaart op basis van een database entry id. Vereist veld: entryId
    Voorbeeld body:
    '{"entryId":"ID HIER"}'
 */
CardsRouter.post("/removeCardByEntryId", async (req, res) => {
    const card = req.body;
    if(card.entryId == null){
        return res.status(400).send("EntryId is vereiste.");
    }
    const result = await removeCardByID(card.entryId);
    return res.status(200).json({bericht:"Kaart is verwijderd", resultaat:result})
});

CardsRouter.post("/updateCard", async (req, res, next) => {
    const card = req.body.card;

    if (card === undefined) {
        return respondwithstatus(res, 400, "Missing card object");
    }

    const id = card.id;

    if (id === undefined) {
        return respondwithstatus(res, 400, "Card has no id, probably malformed");
    }

    if (
        card.uuid === undefined ||
        card.booking_id === undefined ||
        card.token === undefined ||
        card.level === undefined ||
        card.blocked === undefined
    ) {
        return respondwithstatus(res, 400, "missing one or more properties");
    }

    // remove old card if it exists
    try {
        const dbres = await updateCard(card.id, card.uuid, card.booking_id, card.token, card.level, card.blocked);
        if (dbres === 0) {
            // no matching cards found
            return respondwithstatus(res, 400, "no matching cards found");
        }
    } catch(e) {
        next(e);
    }

    respondwithstatus(res, 200, "updated card");
});

// this can be just a variable, doesn't need to live in a database
// can be reset at any time
let latestScannedCardToWriteID;

CardsRouter.post("/setNewestCardToWrite", async (req, res, next) => {

    const card = req.body.card;

    if (card === undefined) {
        return respondwithstatus(res, 400, "missing card object");
    }

    try {
        let existingCard = await getCardById(card.id);
        if (existingCard === undefined) {
            info_log("no card yet exists with id " + card.id + "! inserting it into database...");
            await insertCard(card.id, card.uuid, card.booking_id, card.token, card.level, card.blocked);
        }
    } catch(e) {
        if (e.errno !== undefined && e.errno === 19) {
            // not null failed
            return respondwithstatus(res, 400, "some values weren't defined");
        }
        next(e);
    }

    latestScannedCardToWriteID = req.body.card;

    res.end();

});

CardsRouter.get("/getNewestCardToWrite", (req, res, next) => {

    if (latestScannedCardToWriteID === undefined) {
        return res.json({ card: undefined });
    }

    let epoch = Date.now();

    let cardEpoch = latestScannedCardToWriteID.last_update;

    if (epoch - cardEpoch > 60) {
        return res.json({ card: undefined });
    }

    res.json({ card: latestScannedCardToWriteID });
});

export default CardsRouter;