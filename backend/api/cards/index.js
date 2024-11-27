import { Router } from "express";

const CardsRouter = Router("/cards");

CardsRouter.get("/getAllCards", async (req, res) => {
    try {
        const cards = await getAllCards();
        res.json(cards);
    } catch (error) {
        console.log("Error while getting cards from server: " + error);
        res.status(500).send("Sorry! Er heeft een interne fout opgetreden.")
    }
});

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

export default CardsRouter;