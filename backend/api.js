import express from "express";
import APIRouter from "./api/index.js";
import { readerFailedPingSetInactive, initializeDB, insertCard, getAllCards, registerReader, getAllReaders, getAllExtensiveCards, updateCard, deleteCards, removeCardByID } from "./db.js";
import { info_log, hastoAcceptJson, err_log, respondwithstatus, routesFromApp, md5hash } from "./util.js";
import * as fs from "fs";

import config from "./config.js";
import path from "path";
import { uid } from "uid";

// private api
const app = express();
let routes;

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
    if (routes.includes(finalRoute) && config.environment === "dev") {
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

    err_log("caught error with message: " + err.message);
    // log full error, this is fine because it does not send it to the client
    console.log(err);

    respondwithstatus(res, err.status || 500, str);
});

app.listen(config.privateServerPort, async () => {
    info_log(`Started API server on port ${config.privateServerPort}`);

    if (config.environment === "dev") {
        routes = routesFromApp(app);


        await fetch("http://localhost:3001/api/readers/imalive", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                battery: 100,
                macAddress: "testmacaddress"
            })
        });
        await fetch("http://localhost:3001/api/cards/insertCard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                id: md5hash("test_card_id"),
                bookingId: null,
                token: uid(),
                blocked: 0
            })
        });
        await fetch("http://localhost:3001/api/auth/addAuthLevel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: "shit",
            })
        });

        const levels = await fetch("http://localhost:3001/api/auth/getAllAuthLevels").then(data=>data.json());

        const lrar = await fetch("http://localhost:3001/api/auth/linkReaderAuth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                readerId: md5hash("testmacaddress"),
                authLevelId: levels[0].id
            })
        });

        const cards = await fetch("http://localhost:3001/api/cards/getAllCards").then(data=>data.json());

    
        await fetch("http://localhost:3001/api/auth/linkCardAuth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                authLevelId: levels[0].id,
                cardId: cards[0].id
            })
        });
    }

    periodicActivityUpdate();
});

// periodically update the inactive readers
async function periodicActivityUpdate() {

    const rows = await readerFailedPingSetInactive(24 * 60 * 60);

    if (rows.length) info_log("flagged " + rows.length + " readers as inactive");

    setTimeout(periodicActivityUpdate, 300000);

}