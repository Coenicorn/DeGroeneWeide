import cors from 'cors';
import {deleteCards, getAllCards, initializeDB, insertCard} from './db.js';
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

initializeDB();
console.log("Database create queries klaar");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schotel de files vanuit web-frontend voor
app.use(express.static(path.join(__dirname, "../frontend/web-frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/web-frontend/BoerBert.html'));
});

// Alle requests printen voor debug
app.use((req, res, next) => {
    console.log(`Request for: ${req.path}`);
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// API hieronder

app.get("/api/cards", async (req, res) => {
    try {
        const cards = await getAllCards();
        res.json(cards);
    } catch (error) {
        console.log("Error while getting cards from server: " + error);
        res.status(500).send("Sorry! Er heeft een interne fout opgetreden.")
    }
});

app.post("/api/insertCard", async (req, res) => {
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

app.post("/api/deleteAllCards", async (req, res) => {
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