import { Router } from "express";
import { err_log, info_log, md5hash, respondwithstatus } from "../../util.js";
import { deleteAuthLevel, getAllAuthLevels, getReaderCardAuthLevelMatchesWithToken, insertAuthLevel, linkCardToAuthLevel, linkReaderToAuthLevel, unlinkCardFromAuthLevel, unlinkReaderFromAuthLevel, updateAuthLevelName } from "../../db.js";
import { uid } from "uid";
import { APIDocGenerator } from "../../docgen/doc.js"

const AuthRouter = Router(), doc = new APIDocGenerator("authentication API", "(hacking the mainframe)", import.meta.dirname, "api/auth");

doc.route("addAuthLevel", doc.POST, "adds a new auth level")
.request({
    name: doc.STRING
})
.response(201, "succesfully added auth level");

AuthRouter.post("/addAuthLevel", async (req, res) => {

    const name = req.body.name;

    if (name === undefined) return respondwithstatus(res, 400, "name is not defined");
    if (typeof(name) !== "string") return respondwithstatus(res, 400, "name isn't of type 'string'");

    try {
        // await db_execute("INSERT INTO AuthLevels (id, name) VALUES (?,?)", [uid(), name]);
        await insertAuthLevel(uid() /* temp...? */, name);

        respondwithstatus(res, 201, "OK");
    } catch(e) {
        if (e.code && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
            // unique constraint failed
            return respondwithstatus(res, 400, "auth level already exists");
        }
        return respondwithstatus(res, 500, "something went wrong");
    }

});

doc.route("updateAuthLevel", doc.POST, "updates authLevel values")
.request({
    id: doc.STRING,
    name: doc.STRING
})
.response(200, "succesfully updated auth level");

AuthRouter.post("/updateAuthLevel", async (req, res) => {

    const id = req.body.id;

    if (id === undefined ) return respondwithstatus(res, 400, "id is not defined");
    if (typeof(id) !== "string") return respondwithstatus(res, 400, "id is not of type 'string'");

    const name = req.body.name;

    if (name === undefined) return respondwithstatus(res, 400, "name is not defined");
    if (typeof(name) !== "string") return respondwithstatus(res, 400, "name is not of type 'string'");

    try {
        // await db_execute("UPDATE AuthLevels SET name = ?", [name]);
        await updateAuthLevelName(id, name);

        return respondwithstatus(res, 200, "OK");
    } catch(e) {
        err_log("error in /updateAuthLevel", e);
        return respondwithstatus(res, 500, "something went wrong");
    }

});

doc.route("deleteAuthLevel", doc.POST, "deletes an auth level")
.request({
    id: doc.STRING
})
.response(200, "succesfully deleted authLevel");

AuthRouter.post("/deleteAuthLevel", async (req, res) => {

    const id = req.body.id;

    if (id === undefined) return respondwithstatus(res, 400, "id is not defined");
    if (typeof(id) !== "string") return respondwithstatus(res, 400, "id is not of type 'string'");

    try {
        // await db_execute("DELETE FROM AuthLevels WHERE id=?", [id]);
        await deleteAuthLevel(id);

        return respondwithstatus(res, 200, "OK");
    } catch(e) {
        err_log("error in /deleteAuthLevel", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

});

doc.route("getAllAuthLevels", doc.GET, "gets ALL auth levels")
.response(200, [
    {
        id: doc.STRING,
        name: doc.STRING
    }
]);

AuthRouter.get("/getAllAuthLevels", async (req, res) => {

    try {
        // const result = await db_query("SELECT * FROM AuthLevels");
        const result = await getAllAuthLevels();

        res.json(result);
    } catch(e) {
        err_log("error in /getAllAuthLevels", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

});



doc.route("linkReaderAuth", doc.POST, "links a reader to an authentication level")
.request({
    readerId: doc.STRING,
    authLevelId: doc.STRING
})
.response(200, "succesfully linked reader to auth level");

AuthRouter.post("/linkReaderAuth", async (req, res) => {

    const readerId = req.body.readerId;

    if (readerId === undefined) return respondwithstatus(res, 400, "readerId is not defined");
    if (typeof(readerId) !== "string") return respondwithstatus(res, 400, "reader is not of type 'string'");

    const authLevelId = req.body.authLevelId;

    if (authLevelId === undefined) return respondwithstatus(res, 400, "authLevelId is not defined");
    if (typeof(readerId) !== "string") return respondwithstatus(res, 400, "authLevelId is not of type 'string'");

    try {

        // await db_execute(`
        //     INSERT INTO ReaderAuthJunctions (readerId, authLevelId) VALUES (?,?)  
        // `, [readerId, authLevelId]);
        await linkReaderToAuthLevel(readerId, authLevelId);

        return respondwithstatus(res, 200, "OK");

    } catch(e) {
        err_log("error in /linkReaderAuth", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

});

doc.route("unlinkReaderAuth", doc.POST, "removes an auth level from a reader")
.request({
    readerId: doc.STRING,
    authLevelId: doc.STRING
})
.response(200, "succesfully removed auth level from reader");

AuthRouter.post("/unlinkReaderAuth", async (req, res) => {

    const readerId = req.body.readerId;

    if (readerId === undefined) return respondwithstatus(res, 400, "readerId is not defined");
    if (typeof(readerId) !== "string") return respondwithstatus(res, 400, "reader is not of type 'string'");

    const authLevelId = req.body.authLevelId;

    if (authLevelId === undefined) return respondwithstatus(res, 400, "authLevelId is not defined");
    if (typeof(readerId) !== "string") return respondwithstatus(res, 400, "authLevelId is not of type 'string'");

    try {

        await unlinkReaderFromAuthLevel(readerId, authLevelId);

        return respondwithstatus(res, 200, "OK");

    } catch(e) {
        err_log("error in /linkReaderAuth", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

});

doc.route("linkCardAuth", doc.POST, "links an auth level to a card")
.request({
    authLevelId: doc.STRING,
    cardId: doc.STRING
})
.response(200, "succesfully linked an auth level to a card");

AuthRouter.post("/linkCardAuth", async (req, res) => {

    const authLevelId = req.body.authLevelId;

    if (authLevelId === undefined) return respondwithstatus(res, 400, "authLevelId is not defined");
    if (typeof(authLevelId) !== "string") return respondwithstatus(res, 400, "authLevelId is not of type 'string'");

    const cardId = req.body.cardId;

    if (cardId === undefined) return respondwithstatus(res, 400, "cardId is not defined");
    if (typeof(cardId) !== "string") return respondwithstatus(res, 400, "cardId is not of type 'string'");

    try {

        // await db_execute(`
        //     INSERT INTO CardAuthJunctions (cardId, authLevelId) VALUES (?,?)  
        // `, [cardId, authLevelId]);
        await linkCardToAuthLevel(cardId, authLevelId);

        return respondwithstatus(res, 200, "OK");

    } catch(e) {
        err_log("error in /linkReaderAuth", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

});


doc.route("unlinkCardAuth", doc.POST, "removes an auth level from a card")
.request({
    authLevelId: doc.STRING,
    cardId: doc.STRING
})
.response(200, "succesfully removed an auth level from a card");

AuthRouter.post("/unlinkCardAuth", async (req, res) => {

    const authLevelId = req.body.authLevelId;

    if (authLevelId === undefined) return respondwithstatus(res, 400, "authLevelId is not defined");
    if (typeof(authLevelId) !== "string") return respondwithstatus(res, 400, "authLevelId is not of type 'string'");

    const cardId = req.body.cardId;

    if (cardId === undefined) return respondwithstatus(res, 400, "cardId is not defined");
    if (typeof(cardId) !== "string") return respondwithstatus(res, 400, "cardId is not of type 'string'");

    try {

        await unlinkCardFromAuthLevel(cardId, authLevelId);

        return respondwithstatus(res, 200, "OK");

    } catch(e) {
        err_log("error in /linkReaderAuth", e);

        return respondwithstatus(res, 500, "something went wrong");
    }

});


doc.route("authenticateCard", doc.POST, "tries to authenticate a card at a reader")
.request({
    cardId: doc.STRING,
    cardToken: doc.STRING,
    macAddress: doc.STRING + " // gets hashed to internal reader ID"
})
.response(200, "access granted!")
.response(401, "failed to authenticate");

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

    try {
        // const matches = await db_query(`
        //     SELECT DISTINCT Cards.id, Readers.id, Cards.token
        //     FROM Cards
        //     JOIN CardAuthJunctions ON Cards.id = CardAuthJunctions.cardId
        //     JOIN AuthLevels ON CardAuthJunctions.authLevelId = AuthLevels.id
        //     JOIN ReaderAuthJunctions ON AuthLevels.id = ReaderAuthJunctions.authLevelId
        //     JOIN Readers ON ReaderAuthJunctions.readerId = Readers.id
        //     WHERE Cards.token = ? AND Cards.id = ? AND Readers.id = ?
        // `, [cardToken, cardId, readerId]);
        const matches = await getReaderCardAuthLevelMatchesWithToken(cardId, readerId, cardToken);

        if (matches.length === 0) {
            // failed to authenticate
            info_log("access denied for cardId " + cardId + " and readerId " + readerId + " (mac: " + macAddress + ") and token " + cardToken);

            return respondwithstatus(res, 401, "failed to authenticate");
        }
        
        info_log("access granted to cardId " + cardId + " and readerId " + readerId + " (mac: " + macAddress + ") and token " + cardToken);
        return respondwithstatus(res, 200, "OK");
    } catch(e) {
        err_log("error in /authenticateCard", e);

        return respondwithstatus(res, 500, "something went wrong");
    }
});




export default AuthRouter;