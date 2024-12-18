import e, { Router } from "express";
import { err_log, info_log, md5hash, respondwithstatus } from "../../util.js";
import { db_execute, db_query } from "../../db.js";
import { uid } from "uid";

const AuthRouter = Router();

AuthRouter.post("/addAuthLevel", async (req, res) => {

    const name = req.body.name;

    if (name === undefined) return respondwithstatus(res, 400, "name is not defined");
    if (typeof(name) !== "string") return respondwithstatus(res, 400, "name isn't of type 'string'");

    try {
        await db_execute("INSERT INTO AuthLevels (id, name) VALUES (?,?)", [uid(), name]);

        respondwithstatus(res, 200, "OK");
    } catch(e) {
        if (e.code && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
            // unique constraint failed
            return respondwithstatus(res, 400, "auth level already exists");
        }
        return respondwithstatus(res, 500, "something went wrong");
    }

});

AuthRouter.post("/updateAuthLevel", async (req, res) => {

    const id = req.body.id;

    if (id === undefined ) return respondwithstatus(res, 400, "id is not defined");
    if (typeof(id) !== "string") return respondwithstatus(res, 400, "id is not of type 'string'");

    const name = req.body.name;

    if (name === undefined) return respondwithstatus(res, 400, "name is not defined");
    if (typeof(name) !== "string") return respondwithstatus(res, 400, "name is not of type 'string'");

    try {
        await db_execute("UPDATE AuthLevels SET name = ?", [name]);
        return respondwithstatus(res, 200, "OK");
    } catch(e) {
        err_log("error in /updateAuthLevel", e);
        return respondwithstatus(res, 500, "something went wrong");
    }

});

AuthRouter.post("/deleteAuthLevel", async (req, res) => {

    const id = req.body.id;

    if (id === undefined) return respondwithstatus(res, 400, "id is not defined");
    if (typeof(id) !== "string") return respondwithstatus(res, 400, "id is not of type 'string'");

    try {
        await db_execute("DELETE FROM AuthLevels WHERE id=?", [id]);
        return respondwithstatus(res, 200, "OK");
    } catch(e) {
        err_log("error in /deleteAuthLevel", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

});

AuthRouter.get("/getAllAuthLevels", async (req, res) => {

    try {
        const result = await db_query("SELECT * FROM AuthLevels");
        res.json(result);
    } catch(e) {
        err_log("error in /getAllAuthLevels", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

});





AuthRouter.post("/linkReaderAuth", async (req, res) => {

    const readerId = req.body.readerId;

    if (readerId === undefined) return respondwithstatus(res, 400, "readerId is not defined");
    if (typeof(readerId) !== "string") return respondwithstatus(res, 400, "reader is not of type 'string'");

    const authLevelId = req.body.authLevelId;

    if (authLevelId === undefined) return respondwithstatus(res, 400, "authLevelId is not defined");
    if (typeof(readerId) !== "string") return respondwithstatus(res, 400, "authLevelId is not of type 'string'");

    try {

        await db_execute(`
            INSERT INTO ReaderAuthJunctions (readerId, authLevelId) VALUES (?,?)  
        `, [readerId, authLevelId]);

        return respondwithstatus(res, 200, "OK");

    } catch(e) {
        err_log("error in /linkReaderAuth", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

});

AuthRouter.post("/linkCardAuth", async (req, res) => {

    const authLevelId = req.body.authLevelId;

    if (authLevelId === undefined) return respondwithstatus(res, 400, "authLevelId is not defined");
    if (typeof(authLevelId) !== "string") return respondwithstatus(res, 400, "authLevelId is not of type 'string'");

    const cardId = req.body.cardId;

    if (cardId === undefined) return respondwithstatus(res, 400, "cardId is not defined");
    if (typeof(cardId) !== "string") return respondwithstatus(res, 400, "cardId is not of type 'string'");

    try {

        await db_execute(`
            INSERT INTO CardAuthJunctions (cardId, authLevelId) VALUES (?,?)  
        `, [cardId, authLevelId]);

        return respondwithstatus(res, 200, "OK");

    } catch(e) {
        err_log("error in /linkReaderAuth", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

});

AuthRouter.post("/authenticateCard", async (req, res) => {

    const macAddress = req.body.macAddress;
    const cardId = req.body.cardId;
    const cardToken = req.body.token;

    if (macAddress === undefined) return respondwithstatus(res, 400, "macAddress is not defined");
    if (typeof(macAddress) !== "string") return respondwithstatus(res, 400, "reader is not of type 'string'");

    if (cardId === undefined) return respondwithstatus(res, 400, "cardId is not defined");
    if (typeof(cardId) !== "string") return respondwithstatus(res, 400, "cardId is not of type 'string'");

    if (cardToken === undefined) return respondwithstatus(res, 400, "token is not defined");
    if (typeof(cardToken) !== "string") return respondwithstatus(res, 400, "token is not of type 'string'");

    const readerId = md5hash(macAddress);

    info_log("authenticating with cardId " + cardId + " and readerId " + readerId + " (mac: " + macAddress + ") and token " + cardToken);

    try {
        const matches = await db_query(`
            SELECT DISTINCT Cards.id, Readers.id
            FROM Cards
            JOIN CardAuthJunctions ON Cards.id = CardAuthJunctions.cardId
            JOIN AuthLevels ON CardAuthJunctions.authLevelId = AuthLevels.id
            JOIN ReaderAuthJunctions ON AuthLevels.id = ReaderAuthJunctions.authLevelId
            JOIN Readers ON ReaderAuthJunctions.readerId = Readers.id
            WHERE Cards.token = ? AND Cards.id = ? AND Readers.id = ?
        `, [cardToken, cardId, readerId]);

        if (matches.length === 0) {
            // failed to authenticate
            info_log("access denied");

            return respondwithstatus(res, 401, "failed to authenticate");
        }
        
        info_log("access granted");

        return respondwithstatus(res, 200, "OK");
    } catch(e) {
        err_log("error in /authenticateCard", e);

        return respondwithstatus(res, 500, "something went wrong");
    }
});


export default AuthRouter;