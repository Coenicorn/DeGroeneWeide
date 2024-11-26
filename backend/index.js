import cors from 'cors';
import {getAllCards, initializeDB} from './db.js';
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