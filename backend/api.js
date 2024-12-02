import express from "express";
import APIRouter from "./api/index.js";
import { readerFailedPingSetInactive, initializeDB } from "./db.js";
import { info_log, hastoAcceptJson, err_log } from "./util.js";

import config from "./config.js";

// private api
const app = express();

app.use(express.json());
app.use(hastoAcceptJson);

await initializeDB(); info_log("initialized database");

app.use("/api", APIRouter);
  
// 404 fallthrough
app.use((req, res, next) => {
    let err = new Error("Route not found. Hier niks gevonden man, volgende keer beter");
    err.status = 404;
    next(err);
});

// error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ message: err.message, err: err });
})

app.listen(config.privateServerPort, () => {
    info_log(`Started API server on port ${config.privateServerPort}`);

    periodicActivityUpdate();
});

// periodically update the inactive readers
async function periodicActivityUpdate() {

    info_log("periodic reader activity check...");

    await readerFailedPingSetInactive();

    setTimeout(periodicActivityUpdate, 300000);

}