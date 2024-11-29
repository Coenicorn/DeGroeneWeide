import { Router, json } from "express";
import { debug_log, err_log, md5hash, refuseNonJSON } from "../../util.js";
import { getAllReaders, getReader, pingReaderIsAlive, registerReader } from "../../db.js";

const ReadersRouter = new Router();

ReadersRouter.post("/imalive", async (req, res, next) => {

    // extract required variables from request
    const jsondata = req.body;

    let macAddress = jsondata.macAddress, battery = jsondata.battery;

    try {
        if (macAddress == undefined || typeof(macAddress) !== 'string' || macAddress.length == 0) throw new Error("macAddress invalid type");
        if (battery == undefined || typeof(battery) !== 'number') throw new Error("battery wrong type");
    } catch(e) { err_log(`refuse request to /imalive: ${e.message}`); res.status(400).send(e.message); return; }

    const readerId = md5hash(macAddress);

    let reader;

    try {
        reader = await getReader(readerId);
    } catch(e) {
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

    res.send("success");

});

ReadersRouter.get("/getAllReaders", async (req, res, next) => {
    const readers = await getAllReaders();

    res.json(readers);
});

export default ReadersRouter;