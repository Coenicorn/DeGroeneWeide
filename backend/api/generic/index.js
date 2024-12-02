import { Router } from "express";
import { getAllCards, getCardById, getCardByUUID } from "../../db.js";
import { err_log, respondwithstatus } from "../../util.js";

const GenericRouter = Router();

GenericRouter.post("/setNewestCarsToWrite", (req, res, next) => {

    const id = req.body.id;

    if (id == undefined) {
        respondwithstatus(res, 400, "id is undefined");
        return;
    }
    if (typeof(id) !== "string") {
        respondwithstatus(res, 400, "type of id is not correct: " + typeof(id));
        return;
    }

    const card = 
    
});

GenericRouter.get("/getNewestCardToWrite", (req, res, next) => {



});

export default GenericRouter;