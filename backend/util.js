import { createHash } from "crypto";

export function debug_log(msg) {
    console.log(`[DEBUG] ${msg}`);
}

export function info_log(msg) {
    console.log(`[INFO] ${msg}`);
}

export function err_log(msg) {
    console.log(`[ERROR] ${msg}`);
}

export function md5hash(str) {
    return createHash("md5").update(str).digest('hex');
}

export function hastoAcceptJson(req, res, next) {
    if (req.headers["accept"] !== "application/json") {
        res.status(400).send("'Accept' headers must be application/json");
    }
    next();
}