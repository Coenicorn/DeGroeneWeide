import { createHash } from "crypto";
import config from "./config.js";
import { abort } from "process";

function log_with_title(str, title) {
    let d = new Date();

    console.log(`${title} ${str}`);
}

export function debug_log(msg) {
    if (config.environment !== "dev") return;

    log_with_title(msg, "[DEBUG]");
}

export function info_log(msg) {
    log_with_title(msg, "[INFO]");
}

export function err_log(msg) {
    log_with_title(msg, "[ERROR]");
}

/* logs error and aborts */
export function fatal_log(msg) {
    log_with_title(msg, "[FATAL]");
    abort();
}




export function md5hash(str) {
    return createHash("md5").update(str).digest('hex');
}

export function refuseNonJSON(req, res, next) {
    if (req.headers["content-type"] !== "application/json") {
        res.status(400).json({ error: "Content-Type must be application/json" });
    } else next();
}