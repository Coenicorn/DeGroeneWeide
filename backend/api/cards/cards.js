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
import { respondwithstatus, err_log, info_log, debug_log } from "../../util.js";
import { uid } from "uid";
import { APIDocGenerator } from "../../docgen/doc.js";

const CardsRouter = express.Router(), doc = new APIDocGenerator("cards API", "all things cards", import.meta.dirname, "api/cards");

/*
    Alles returned standaard met:
    {"bericht":"SYSTEEM BERICHT","resultaat":"result"}

     bericht - Berichtgeving voor systeem operaties
     resultaat - Het resultaat van de request in JSON, check altijd eerst op NULL.

    /api/cards/getAllCards GET Request. Geeft alle opgeslagen kaarten in de tabel `cards` in JSON format.
    Invoke-WebRequest -Uri http://localhost:3001/api/cards/getAllCards -Method GET -ContentType "application/json"
 */

doc.route("getAllCards", doc.GET, "gets all cards")
.response(200, null, [
    {
        id: doc.STRING,
        bookingId: doc.STRING_OR_NULL,
        token: doc.STRING_OR_NULL,
        blocked: doc.NUMBER,
        timeLastUpdate: doc.STRING
    }
])

CardsRouter.get("/getAllCards", async (req, res) => {
    try {
        const cards = await getAllCards();
        res.status(200).json(cards);
    } catch (error) {
        err_log("Error while getting cards from server: ", error);
        res.status(500).send("Sorry! Er heeft een interne fout opgetreden.");
    }
});


/*
    Geeft op basis van boeking nummer alle kaarten informatie plus relevante boeking informatie

    /api/cards/getAllExtensiveCards.
 */

doc.route("getAllExtensiveCards", doc.GET, "gets all cards with additional info, pretty expensive query")
.response(200, "all cards >_>", [
    {
        id: doc.STRING,
        bookingId: doc.STRING_OR_NULL,
        token: doc.STRING,
        blocked: doc.NUMBER,
        customerId: doc.STRING_OR_NULL,
        startDate: doc.STRING_OR_NULL,
        endDate: doc.STRING_OR_NULL,
        amountPeople: doc.NUMBER_OR_NULL,
        creationDate: doc.STRING_OR_NULL,
        authLevelId: doc.STRING_OR_NULL,
        authLevelName: doc.STRING_OR_NULL
    }
]);

CardsRouter.get("/getAllExtensiveCards", async (req, res) => {
    try {
        const cards = await getAllExtensiveCards();
        res.status(200).json(cards);
    } catch (error) {
        err_log("error in /getAllExtensiveCards:" , error);
        throw new Error("Sorry! Er heeft een interne fout opgetreden.");
    }
});

/*
       /cards/getCard GET Request. Specifieke kaart kan opgevraagd worden op basis van Database entry ID of de UUID die op de NFC kaart staat.
       Body voorbeeld:
       '{"card_uuid":"UUID HIER"}' of '{"entryId":"1"}' of een opsomming van beide
 */

doc.route("getCard", doc.GET, "gets a single card")
.request({
    entryId: doc.STRING_OR_NULL,
    card_uuid: doc.STRING_OR_NULL,
}, "at least one value must be defined")
.response(200, null, {
    id: doc.STRING,
    bookingId: doc.STRING_OR_NULL,
    token: doc.STRING_OR_NULL,
    blocked: doc.NUMBER,
    timeLastUpdate: doc.STRING
});

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

doc.route("getCardTokenByCardUuid", doc.GET, "@tobias")
.request({
    card_uuid: doc.STRING
})
.response(200, "same as /getCard");

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

doc.route("insertCard", doc.POST, "inserts a card into the db")
.request({
    uuid: doc.STRING,
    blocked: doc.STRING,
    token: doc.STRING,
    booking_id: doc.STRING_OR_NULL
})
.response(201, "succesfully added card");

CardsRouter.post("/insertCard", async (req, res) => {
    const card = req.body;

    // if (
    //     !card.id ||
    //     card.blocked === undefined ||
    //     card.token === undefined,
    //     card.booking_id === undefined
    // ) {
    //     return res.status(400).send("Gegeven data is niet in het correcte format.");
    // }
    if (card.uuid === undefined) return respondwithstatus(res, 400, "missing uuid. Please provide fysical card uuid");
    if (card.blocked === undefined) return respondwithstatus(res, 400, "missing blocked");
    if (card.token === undefined) return respondwithstatus(res, 400, "missing token");
    if (card.booking_id === undefined) return respondwithstatus(res, 400, "missing booking_id");

    try {
        await insertCard(card.uuid, card.booking_id, card.token, card.blocked);
    } catch(e) {
        err_log("error in /insertCard", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

    respondwithstatus(res, 201, "OK");
});

/*
       /cards/deleteAllCards POST Request. Verwijder alle kaarten uit de tabel. Vereist veld: confirm
       Voorbeeld body:
       '{"confirm":"false"}'

 */

doc.route("deleteAllCards", doc.POST, "deletes ALL cards")
.response(200, "succesfully removed all cards x_x");

CardsRouter.post("/deleteAllCards", async (req, res) => {
    const deletion = req.body;

    const result = await deleteCards(deletion.confirm);
    if(!result){
        return res.status(500).send("Er is iets fout gegaan tijdens het verwijderen van alle kaarten.");
    }
    res.status(200).json({bericht:"Alle kaarten zijn verwijderd.",resultaat: result});
});

/*
    /cards/removeCardByBookingId POST Request. Verwijder kaart bij boeking ID. Vereist veld: booking_id
    Voorbeeld body:
    '{"booking_uuid":"ID HIER"}'
 */

doc.route("removeCardByBookingId", doc.POST, "@tobias")
.request({
    booking_id: doc.STRING
})
.response(200, "succesfully removed card");

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
doc.route("removeCardByEntryId", doc.POST, "@tobias")
.request({
    entryId: doc.STRING
})
.response(200, "succesfully removed card");

CardsRouter.post("/removeCardByEntryId", async (req, res) => {
    const card = req.body;
    if(card.entryId == null){
        return res.status(400).send("EntryId is vereiste.");
    }
    const result = await removeCardByID(card.entryId);
    return res.status(200).json({bericht:"Kaart is verwijderd", resultaat:result})
});

doc.route("updateCard", doc.POST, "updates card values")
.request({
    id: doc.STRING,
    booking_id: doc.STRING
})
.response(200, "succesfully updated card");

CardsRouter.post("/updateCard", async (req, res, next) => {
    const card = req.body;

    if (card === undefined) {
        return respondwithstatus(res, 400, "Missing card object");
    }

    const id = card.id;

    if (id === undefined) {
        return respondwithstatus(res, 400, "Card has no id, probably malformed");
    }

    if (
        card.booking_id === undefined
    ) {
        return respondwithstatus(res, 400, "missing one or more properties");
    }

    // remove old card if it exists
    try {
        const dbres = await updateCard(card.id, card.booking_id);
        if (dbres === 0) {
            // no matching cards found
            return respondwithstatus(res, 400, "no matching cards found");
        }
    } catch(e) {
        return respondwithstatus(res, 500, "something went wrong");
    }

    respondwithstatus(res, 200, "updated card");
});

doc.route("getAllAuthLevels", doc.POST, "gets all auth levels of this card")
.request({
    id: doc.STRING
})
.response(200, "id is an authlevel's id, name is an authlevel's name, etc.", [
    {
      id: doc.STRING,
      name: doc.STRING
    }
])

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

        return res.status(200).json(authLevels);

    } catch(e) {
        err_log("error in /getAllAuthLevels (cards)", e);
        
        return respondwithstatus(res, 500, "something went wrong");
    }
});

doc.route("updateCardToken", doc.POST, "updates the token of a single card")
.request({
    cardId: doc.STRING,
    token: doc.STRING
})
.response(200, "succesfully updated token");

CardsRouter.post("/updateCardToken", async (req, res) => {
    const cardId = req.body.cardId;
    const newToken = req.body.token;

    if (cardId === undefined) return respondwithstatus(res, 400, "cardId is undefined");
    if (typeof(cardId) !== "string") return respondwithstatus(res, 400, "cardId is not of type 'string'");

    if (newToken === undefined) return respondwithstatus(res, 400, "token is undefined");
    if (typeof(newToken) !== "string") return respondwithstatus(res, 400, "token is not of type 'string'");

    try {
        await insertCard(cardId, null, cardToken, 0);

        debug_log("added new card with id " + cardId);
    } catch(e) {
        // constraint primary key means a card with that id already exists, expected behaviour
        if (e.code !== "SQLITE_CONSTRAINT_PRIMARYKEY") err_log("error inserting new card in /authenticateCard", e);
    }
    
    try {
        await db_execute("UPDATE Cards SET token=?, timeLastUpdate=CURRENT_TIMESTAMP WHERE id=?", [newToken, cardId]);
        info_log("updated card " + cardId + " with token " + newToken);
        return respondwithstatus(res, 200, "OK");
    } catch(e) {
        err_log("error in /updateCardToken", e);
      
        return respondwithstatus(res, 500, "something went wrong");
    }
});

export default CardsRouter;