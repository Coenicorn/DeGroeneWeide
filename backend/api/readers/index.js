import { Router } from "express";
import { err_log, info_log, md5hash, respondwithstatus } from "../../util.js";
import { db_execute, db_query, getAllReaders, getReader, registerReader } from "../../db.js";

const ReadersRouter = new Router();

ReadersRouter.post("/imalive", async (req, res, next) => {

    // extract required variables from request
    const jsondata = req.body;

    let macAddress = jsondata.macAddress, battery = jsondata.battery;

    // I hate writing these >:(
    if (macAddress === undefined) return respondwithstatus(res, 400, "macAddress is not defined");
    if (typeof(macAddress) !== "string") return respondwithstatus(res, 400, "macAddress is not a string", { type: typeof(macAddress) });
    if (macAddress.length === 0) return respondwithstatus(res, 400, "length of macAddress is 0");
    
    if (battery === undefined) return respondwithstatus(res, 400, "battery is not defined");
    if (typeof(battery) !== "number") return respondwithstatus(res, 400, "battery is not a number", { type: typeof(battery) });
    
    const readerId = md5hash(macAddress);

    let reader;

    try {
        reader = await getReader(readerId);
    } catch(e) {
        err_log("error getting reader", e);
        return respondwithstatus(res, 500, "error getting reader");
    }

    if (reader.length === 0) {
        // no reader with this id exists, create it
        try {
            await registerReader(readerId, "no name assigned");
        } catch(e) {
            err_log("error registering new reader", e);
            return respondwithstatus(res, 500, "something went wrong");
        }
    }

    try {
        await db_execute("UPDATE Readers SET active=?, batteryPercentage=? WHERE id=?", [1, battery, readerId]);
    } catch(e) {
        err_log("error updating reader", e);
        return respondwithstatus(res, 500, "something went wrong");
    }

    respondwithstatus(res, 200, "OK");

});

ReadersRouter.get("/getAllReaders", async (req, res) => {
    try {
        const readers = await getAllReaders();

        res.json(readers);
    } catch(e) {
        respondwithstatus(res, 500, "couldn't get all readers");
        err_log("error in /getAllReaders", e);
    }
});

ReadersRouter.post("/getReader", async (req, res) => {
    const id = req.body.id;

    if (id === undefined) return respondwithstatus(res, 400, "id is undefined");
    if (typeof(id) !== "string") return respondwithstatus(res, 400, "type of id is incorrect: " + typeof(id));

    let reader;

    try {
        // reader = await getReader(id);
        reader = await db_query(`
            SELECT * 
            FROM Readers WHERE id = ?
            LEFT JOIN booking    
        `)
    } catch(e) {
        err_log("error getting reader", e);
        return respondwithstatus(res, 500, "couldn't get reader");
    }

    if (reader === undefined) {
        return res.json({});
    }

    res.json(reader);
});

ReadersRouter.post("/updateReader", async (req, res) => {
    const reader = req.body;

    if (reader === undefined) return respondwithstatus(res, 400, "body is missing 'reader' object");
    if (reader.id === undefined) return respondwithstatus(res, 400, "reader.id is not defined");
    if (reader.name === undefined) return respondwithstatus(res, 400, "reader.name is not defined, when not needed use 'null'");
    if (reader.amenityId === undefined) return respondwithstatus(res, 400, "reader.amenityId is not defined, when not needed use 'null'");

    try {

        await db_execute("UPDATE Readers SET name=?,amenityId=?", [reader.name, reader.amenityId]);

    } catch(e) {
        
        err_log("/updateReader failed:");
        console.error(e);
        return respondwithstatus(res, 500, "something went wrong trying to update a reader");

    }

    respondwithstatus(res, 200, "OK");
    
});

export default ReadersRouter;