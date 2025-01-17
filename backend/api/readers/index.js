import { Router } from "express";
import { err_log, info_log, md5hash, respondwithstatus } from "../../util.js";
import {db_execute, db_query, getAllReaders, getReader, insertReader, registerReader} from "../../db.js";

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

    return respondwithstatus(res, 200, "OK", { id: readerId });

});

ReadersRouter.get("/getAllReaders", async (req, res) => {
    try {
        // const readers = await getAllReaders();
        const readers = await db_query(`SELECT * FROM Readers`);

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

ReadersRouter.post("/insertReader", async (req, res) => {
    const reader = req.body;

    if(reader === undefined) return respondwithstatus(res, 400, "body is missing 'reader' object");
    if (reader.id === undefined) return respondwithstatus(res, 400, "reader.id is not defined");
    if (reader.name === undefined) return respondwithstatus(res, 400, "reader.name is not defined, when not needed use 'null'");
    if(reader.active === undefined) return respondwithstatus(res, 400, "reader.active is not defined, when not needed use 'null'");
    if (reader.amenityId === undefined) return respondwithstatus(res, 400, "reader.amenityId is not defined, when not needed use 'null'");


    let active = reader.active;
    let batteryPercentage = reader.batteryPercentage;
    let lastPing = reader.lastPing;

    if(lastPing === undefined){lastPing = new Date();}
    if(batteryPercentage === undefined) {batteryPercentage = 0;}
    if(active === undefined) {active = false;}

    try {
        await insertReader(reader.id, batteryPercentage, reader.amenityId, lastPing, reader.name, active);
    } catch (e) {
        err_log("/updateReader failed:");
        console.error(e);
        return respondwithstatus(res, 500, "something went wrong trying to insert a reader");
    }
    respondwithstatus(res, 200, "OK");

});

ReadersRouter.post("/getAllAuthLevels", async (req, res) => {
    const readerId = req.body.id;

    if (readerId === undefined) return respondwithstatus(res, 400, "readerId is not defined");

    try {

        const authLevels = await db_query(`
            SELECT AuthLevels.*
            FROM Readers
            JOIN ReaderAuthJunctions ON ReaderAuthJunctions.readerId = Readers.id
            JOIN AuthLevels ON AuthLevels.id = ReaderAuthJunctions.authLevelId
            WHERE Readers.id = ?
        `, [readerId]);
        
        return res.json(authLevels);

    } catch(e) {
        err_log("error in /getAllAuthLevels (reader)", e);

        return respondwithstatus(res, 500, "something went wrong");
    }
});

export default ReadersRouter;