import { Router } from "express";

import CardsRouter from "./cards/cards.js";
import ReadersRouter from "./readers/index.js";
import AuthRouter from "./auth/index.js";
import CustomersRouter from "./customers/customers.js";
import BookingRouter from "./booking/booking.js";
import { db_query } from "../db.js";
import config from "../config.js";
import { info_log } from "../util.js";
import { APIDocGenerator } from "../docgen/doc.js";
import { onlyAdminPanel } from "../apiKey.js";

const APIRouter = Router(), doc = new APIDocGenerator("API root", "root API routes", import.meta.dirname, "api");

// API key
APIRouter.use(onlyAdminPanel);

APIRouter.use("/cards", CardsRouter);
APIRouter.use("/customers", CustomersRouter)
APIRouter.use("/readers", ReadersRouter);
APIRouter.use("/auth", AuthRouter);
APIRouter.use("/booking", BookingRouter);

if (config.environment === "dev"){
    info_log("hosting database explorer on http://localhost:" + config.privateServerPort + "/api/browse");

    APIRouter.use("/browse", async (req, res) => {
        let response = {};

        const tables = await db_query("select name from sqlite_master where type='table'");
        for (let table of tables) {
            response[table.name] = await db_query("select * from " + table.name);
        }

        res.json(response);
    });
}

doc
    .route("browse", doc.GET, "development helper to quickly view the current database as JSON. Meant for use in webbrowser")
    .response(200, "json view of the current database");

export default APIRouter;