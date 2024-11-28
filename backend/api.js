import express from "express";
import APIRouter from "./api/index.js";
import { initializeDB } from "./db.js";
import { debug_log, info_log, refuseJson } from "./util.js";

// private api
const app = express();
const port = 3001;

app.use(express.json());

// refuse request if it is not json
app.use(refuseJson);

await initializeDB(); info_log("initialized database");

app.use("/api", APIRouter);

app.listen(port, () => {
    info_log(`Started API server on port ${port}`);
});