import express from "express";
import APIRouter from "./api/index.js";
import { initializeDB } from "./db.js";
import { info_log, refuseNonJSON, err_log } from "./util.js";

// private api
const app = express();
const port = 3001;

app.use(express.json());
app.use(refuseNonJSON);

await initializeDB(); info_log("initialized database");

app.use("/api", APIRouter);

// 404 fallthrough
app.use((req, res, next) => {
    let err = new Error("route not found");
    err.status = 404;
    next(err);
});

// error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({ message: err.message, err: err });
})

app.listen(port, () => {
    info_log(`Started API server on port ${port}`);
});