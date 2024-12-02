import express from "express";
import APIRouter from "./api/index.js";
import { readerFailedPingSetInactive, initializeDB } from "./db.js";
import { info_log, hastoAcceptJson, err_log, resfailwithstatus, routesFromApp } from "./util.js";

import config from "./config.js";

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
    let err;

    let finalRoute = req.url.split("/").pop();
    if (routes.includes(finalRoute) && config.environment === "dev") {
        err = new Error("Route exists but failed, did you use the right method?");
    } else {
        err = new Error("Route not found. Hier niks gevonden man, volgende keer beter");
    }
    err.status = 404;
    next(err);
});

// error handling
app.use((err, req, res, next) => {
    err_log("caught error with message: " + err.message);

    resfailwithstatus(res, err.status || 500, err.message);
});

app.listen(config.privateServerPort, () => {
    info_log(`Started API server on port ${config.privateServerPort}`);

    if (config.environment === "dev") routes = routesFromApp(app);

    periodicActivityUpdate();
});

// periodically update the inactive readers
async function periodicActivityUpdate() {

    info_log("periodic reader activity check...");

    await readerFailedPingSetInactive();

    setTimeout(periodicActivityUpdate, 300000);

}