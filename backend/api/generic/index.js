import { Router } from "express";
import { getAllCards, getCardById, getCardByUUID } from "../../db.js";
import { err_log, respondwithstatus } from "../../util.js";

const GenericRouter = Router();

// this can be just a variable, doesn't need to live in a database
// can be reset at any time
let latestScannedCardToWriteID;

GenericRouter.post("/setNewestCardToWrite", (req, res, next) => {

    const id = req.body.id;

    if (id == undefined) {
        respondwithstatus(res, 400, "id is undefined");
        return;
    }
    if (typeof(id) !== "string") {
        respondwithstatus(res, 400, "type of id is not correct: " + typeof(id));
        return;
    }

    let card;

    try {
        card = getCardById(id);
    } catch(e) {
        err_log("failed to get card with id " + id);

        respondwithstatus(res, 500, "something went wrong");

        return;
    }

    latestScannedCardToWriteID = card.id;

    res.end();

});

GenericRouter.get("/getNewestCardToWrite", (req, res, next) => {

    if (latestScannedCardToWriteID === undefined) {
        res.json({});
        return;
    }

    

});

export default GenericRouter;