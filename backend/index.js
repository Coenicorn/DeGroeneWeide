import cors from 'cors';
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { info_log } from './util.js';
import config from './config.js';
import { verifyCorrectConfiguration } from './config.js';
verifyCorrectConfiguration();

// start the api server first
// server file has global code so wait for that code to finish running
await (async ()=>{
    info_log("importing api.js...");
    await import("./api.js");
    info_log("api.js finished importing");
})();

// exposed to public
const app = express();

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schotel de files vanuit web-frontend voor
app.use(express.static(path.join(__dirname, "../frontend/web-frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/web-frontend/BoerBert.html'));
});

// Alle requests printen voor debug
app.use((req, res, next) => {
    info_log(`Request for: ${req.path}`);
    next();
});

app.listen(config.publicServerPort, () => {
    info_log(`started public server on http://localhost:${config.publicServerPort}`);
});