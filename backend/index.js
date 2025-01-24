import cors from 'cors';
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import config from './config.js';
import { readerFailedPingSetInactive, initializeDB, insertCard, getAllCards, registerReader, getAllReaders, getAllExtensiveCards, updateCard, deleteCards, removeCardByID, insertAuthLevel } from "./db.js";
import { info_log, hastoAcceptJson, err_log, respondwithstatus, routesFromApp, md5hash, deleteOldTempReservations, periodicActivityUpdate } from "./util.js";
import { uid } from "uid";
import APIRouter from "./api/index.js";

// exposed to public
const app = express();
let routes = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// check if image is viewed lmao
app.use((req, res, next) => {
    if (req.url === "/img/Shoco-mellow_logo_zwart.png") {
        info_log("Black logo image got loaded. This probably means a confirmation email was viewed");
    }
    next();
})

// Schotel de files vanuit web-frontend voor
app.use(express.static(path.join(__dirname, "../frontend/web-frontend/")));

// NOT SAFE
app.use(cors());

app.use((req, res, next) => {
    if (config.environment !== "dev") {
        next();
        return;
    }
    info_log("got request for " + req.url);
    next();
});

app.use(express.json());
app.use(hastoAcceptJson);

await initializeDB(); info_log("initialized database");

app.use("/api", APIRouter);
  
// 404 fallthrough
app.use((req, res, next) => {
    let str;

    let finalRoute = req.url.split("/").pop();
    if (config.environment === "dev" && routes.includes(finalRoute)) {
        str = "Route exists but failed, did you use the right method?";
    } else {
        str = "Route not found. Hier niks gevonden man, volgende keer beter";
    }
    res.status(404).send(str);
});

// error handling
// try to catch and handle errors in your code, this should never be used, and instead is there as a fail safe to not crash the server or expose implementation details to the client
app.use((err, req, res, next) => {
    let str;
    if (config.environment === "dev") str = err.message;
    else str = "something went wrong!";

    err_log("caught route error", err);
    // log full error, this is fine because it does not send it to the client

    respondwithstatus(res, err.status || 500, str);
});

app.listen(config.serverPort, async () => {
    info_log(`Started API server on port ${config.serverPort}`);
    info_log(`Started public server on http://localhost:${config.serverPort}`);

    await deleteOldTempReservations();
    await periodicActivityUpdate();

    // add default auth levels
    insertAuthLevel(uid(), "gast").catch(e => { if (e.code !== "SQLITE_CONSTRAINT_UNIQUE") throw e; });
    insertAuthLevel(uid(), "bezoeker").catch(e => { if (e.code !== "SQLITE_CONSTRAINT_UNIQUE") throw e; });
    insertAuthLevel(uid(), "medewerker").catch(e => { if (e.code !== "SQLITE_CONSTRAINT_UNIQUE") throw e; });
    insertAuthLevel(uid(), "admin").catch(e => { if (e.code !== "SQLITE_CONSTRAINT_UNIQUE") throw e; });

    if (config.environment === "dev") {
        routes = routesFromApp(app);

        const host = "http://localhost:" + config.privateServerPort;
    }

    import("./cronjobs.js");
});