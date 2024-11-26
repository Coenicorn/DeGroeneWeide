
import cors from 'cors';
import { initializeDB } from './db.js';
import express from "express";
import {fileURLToPath} from "url";
import path from "path";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

initializeDB();
console.log("Database create queries klaar");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../backend')));

// Zorg ervoor dat gebruiker naar de gebruikelijke site wordt geleidt.
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/web-fronted/BoerBert.html')); // path naar normale site
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
