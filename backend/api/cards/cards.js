import express, { Router } from "express";
import {
    db_query,
    db_execute,
    deleteCards,
    getAllCards, getAllExtensiveCards,
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
        res.status(500).send("Sorry! Er heeft een interne fout opgetreden.");
    }
});


/*
    Geeft op basis van boeking nummer alle kaarten informatie plus relevante boeking informatie

    /api/cards/getAllExtensiveCards.
 */
CardsRouter.get("/getAllExtensiveCards", async (req, res) => {
    try {
        const cards = await getAllExtensiveCards();
        res.json(cards);
    } catch (error) {
        throw new Error("Sorry! Er heeft een interne fout opgetreden.");
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

CardsRouter.post("/insertCard", async (req, res) => {
    try {
        const card = req.body;

        if (
            !card.id ||
            card.blocked === undefined ||
            card.token === undefined
        ) {
            return res.status(400).send("Gegeven data is niet in het correcte format.");
        }

        const result = await insertCard(card.id, null, card.token, card.blocked);
        res.status(201).json({bericht:"Kaart successvol toegevoegd",resultaat: result});

    } catch (error) {
        err_log("Error tijdens het kaart toevoegen", error);
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
        card.card_uuid === undefined ||
        card.booking_id === undefined ||
        card.token === undefined ||
        card.level === undefined ||
        card.blocked === undefined
    ) {
        return respondwithstatus(res, 400, "missing one or more properties");
    }

    // remove old card if it exists
    try {
        const dbres = await updateCard(card.id, card.card_uuid, card.booking_id, card.token, card.level, card.blocked);
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
            return respondwithstatus(res, 400, "no card exists with id " + card.id);
        }
        // double database call -0-
        console.log(existingCard);
        await updateCard(existingCard.id, existingCard.card_uuid, existingCard.booking_id, existingCard.token, existingCard.level, existingCard.blocked);
        latestScannedCardToWriteID = await getCardById(card.id);
    } catch(e) {
        if (e.errno !== undefined && e.errno === 19) {
            // not null failed
            return respondwithstatus(res, 400, "some values weren't defined");
        }
        next(e);
    }
  
    res.end();

});

CardsRouter.get("/getNewestCardToWrite", (req, res, next) => {
  
    if (latestScannedCardToWriteID === undefined) {
        return res.json({ card: undefined });
    }

    let epoch = Date.now();

    let cardEpoch = latestScannedCardToWriteID.last_update;

    console.log(epoch);
    console.log(cardEpoch);

    if (Math.round((epoch - cardEpoch) / 1000) > 60) {
        return res.json({ card: undefined });
    }

    res.json({ card: latestScannedCardToWriteID });
});

CardsRouter.post("/getAllAuthLevels", async (req, res) => {
    const cardId = req.body.id;

    if (cardId === undefined) return respondwithstatus(res, 400, "cardId is not defined");

    try {

        const authLevels = await db_query(`
            SELECT AuthLevels.*
            FROM Cards
            JOIN CardAuthJunctions ON CardAuthJunctions.cardId = Cards.id
            JOIN AuthLevels ON AuthLevels.id = CardAuthJunctions.authLevelId
            WHERE Cards.id = ?
        `, [cardId]);

        return res.json(authLevels);

    } catch(e) {
        err_log("error in /getAllAuthLevels (cards)", e);
        
        return respondwithstatus(res, 500, "something went wrong");
    }
});

CardsRouter.post("/updateCardToken", async (req, res) => {
    const cardId = req.body.cardId;
    const newToken = req.body.token;

    if (cardId === undefined) return respondwithstatus(res, 400, "cardId is undefined");
    if (typeof(cardId) !== "string") return respondwithstatus(res, 400, "cardId is not of type 'string'");

    if (newToken === undefined) return respondwithstatus(res, 400, "token is undefined");
    if (typeof(newToken) !== "string") return respondwithstatus(res, 400, "token is not of type 'string'");

    try {
        await db_execute("UPDATE Cards SET token=? WHERE id=?", [newToken, cardId]);
        info_log("updated card " + cardId + " with token " + newToken);
        return respondwithstatus(res, 200, "OK");
    } catch(e) {
        err_log("error in /updateCardToken", e);
      
        return respondwithstatus(res, 500, "something went wrong");
    }
});

export default CardsRouter;