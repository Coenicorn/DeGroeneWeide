import express from "express";
import APIRouter from "./api/index.js";
import { storeInactiveReaders, initializeDB } from "./db.js";
import { err_log, info_log, refuseNonJSON } from "./util.js";

import config from "./config.js";

// private api
const app = express();

app.use(express.json());
app.use(refuseNonJSON);

await initializeDB(); info_log("initialized database");

app.use("/api", APIRouter);
  
// 404 fallthrough
app.use((req, res, next) => {
    let err = new Error("route not found");
    err.status = 404;
    next(err);
});

// error handling
app.use((err, req, res, next) => {
    err_log(`error handled by middleware:`);
    console.error(err);

    res.status(err.status || 500);
    res.json({ status: "something went wrong" });
})

// periodically update the inactive readers
async function periodicActivityUpdate() {

    info_log("checking for inactive readers...");

    await storeInactiveReaders();

    setTimeout(periodicActivityUpdate, 300000);

}

// start loop
await periodicActivityUpdate();

app.listen(config.privateServerPort, async () => {
    info_log(`Started API server on port ${config.privateServerPort}`);
});