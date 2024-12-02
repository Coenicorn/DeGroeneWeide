import { Router, json } from "express";
import { debug_log, err_log, md5hash, resfailwithstatus } from "../../util.js";
import { getAllReaders, getReader, pingReaderIsAlive, registerReader } from "../../db.js";

const ReadersRouter = new Router();

ReadersRouter.post("/imalive", async (req, res, next) => {

    // extract required variables from request
    const jsondata = req.body;

    let macAddress = jsondata.macAddress, battery = jsondata.battery;

    try {
        if (macAddress == undefined || typeof(macAddress) !== 'string' || macAddress.length == 0) throw new Error("macAddress invalid type");
        if (battery == undefined || typeof(battery) !== 'number') throw new Error("battery wrong type");
    } catch(e) { err_log(`refuse request to ${req.url}: ${e.message}`); res.status(400).json({ status: e.message }); return; }

    const readerId = md5hash(macAddress);

    let reader;

    try {
        reader = await getReader(readerId);
    } catch(e) {
        err_log("failure getting reader with id " + readerId);
        next();
        return;
    }

    debug_log(`got reader ${JSON.stringify(reader)}`);

    if (reader == undefined) {
        // no reader with this id exists, create it
        try {
            await registerReader(macAddress, "front gate");
        } catch(e) {
            next(e);
            return;
        }
    }

    try {
        await pingReaderIsAlive(1, readerId, battery);
    } catch(e) {
        next(e);
        return;
    }

    res.send({ status: "success" });

});

ReadersRouter.get("/getAllReaders", async (req, res, next) => {
    const readers = await getAllReaders();

    res.json(readers);
});

ReadersRouter.get("/getReader", async (req, res, next) => {
    const id = req.body.id;

    if (id === undefined) {
        resfailwithstatus(res, 400, "id is undefined");
        return;
    }
    if (typeof(id) !== "string") {
        resfailwithstatus(res, 400, "type of id is incorrect: " + typeof(id));
        return;
    }
    if (id.length === 0) {
        resfailwithstatus(res, 400, "id is of size 0");
        return;
    }

    let reader;

    try {
        reader = await getReader(id);
    } catch(e) {
        resfailwithstatus(res, 500, "something went wrong");
        return;
    }

    if (reader === undefined) {
        res.json({});
        return;
    }

    debug_log(`sent reader: ${reader.id}`);

    res.json(reader);
});

export default ReadersRouter;