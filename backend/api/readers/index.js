import { Router } from "express";
import { err_log, info_log, md5hash, respondwithstatus } from "../../util.js";
import {db_execute, db_query, getAllReaders, getReader, insertReader, registerReader} from "../../db.js";
import { APIDocGenerator } from "../../docgen/doc.js";

const ReadersRouter = new Router(), doc = new APIDocGenerator("readers API", "All routes connected with RFID readers", import.meta.dirname, "api/readers");

doc.route("imalive", doc.POST, "used by RFID readers to signal they're up and running")
    .request({
        macAddress: doc.STRING,
        battery: doc.NUMBER
    })
    .response(200, "succesful request")
    .response(201, "new rfid reader created");

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

    let reader, returnCode = 200; // send 201 when a new reader is added

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

            returnCode = 201;
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

    return respondwithstatus(res, returnCode, "OK");

});

doc.route("getAllReaders", doc.GET, "...gets all readers")
.response(200, null, {
    id: doc.STRING,
    batteryPercentage: doc.NUMBER,
    amenityId: doc.STRING_OR_NULL,
    lastPing: doc.STRING,
    name: doc.STRING,
    active: doc.NUMBER
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


doc.route("getReader", doc.POST, "gets a single reader")
.request({
    id: doc.STRING
})
.response(200, "retrieved reader", {
    id: doc.STRING,
    batteryPercentage: doc.NUMBER,
    amenityId: doc.STRING_OR_NULL,
    lastPing: doc.STRING,
    name: doc.STRING,
    active: doc.NUMBER
})

ReadersRouter.post("/getReader", async (req, res) => {
    const id = req.body.id;

    if (id === undefined) return respondwithstatus(res, 400, "id is undefined");
    if (typeof(id) !== "string") return respondwithstatus(res, 400, "type of id is incorrect: " + typeof(id));

    let reader;

    try {
        // reader = await getReader(id);
        reader = await db_query(`
            SELECT * 
            FROM Readers 
            WHERE id = ?
        `, [id]);
    } catch(e) {
        err_log("error getting reader", e);
        return respondwithstatus(res, 500, "couldn't get reader");
    }

    if (reader === undefined) {
        return res.json({});
    }

    res.json(reader[0]);
});

doc.route("updateReader", doc.POST, "updates all values of a reader")
.request({
    id: doc.STRING,
    name: doc.STRING,
    amenityId: doc.STRING
})
.response(200, "OK");

ReadersRouter.post("/updateReader", async (req, res) => {
    const reader = req.body;

    if (reader === undefined) return respondwithstatus(res, 400, "body is missing 'reader' object");
    if (reader.id === undefined) return respondwithstatus(res, 400, "reader.id is not defined");
    if (reader.name === undefined) return respondwithstatus(res, 400, "reader.name is not defined, when not needed use 'null'");
    if (reader.amenityId === undefined) return respondwithstatus(res, 400, "reader.amenityId is not defined, when not needed use 'null'");

    try {

        await db_execute("UPDATE Readers SET name=?,amenityId=? WHERE id=?", [reader.name, reader.amenityId, reader.id]);

    } catch(e) {
        
        err_log("/updateReader failed:");
        console.error(e);
        return respondwithstatus(res, 500, "something went wrong trying to update a reader");

    }

    respondwithstatus(res, 200, "OK");
    
});

doc.route("insertReader", doc.POST, "inserts a new reader (NEVER USE THIS I DON'T KNOW WHY IT'S HERE)")
.request({
    id: doc.STRING,
    name: doc.STRING,
    active: doc.NUMBER,
    amenityId: doc.STRING
})
.response(200, "OK");

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