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

export function refuseNonJSON(req, res, next) {
    if (req.headers["content-type"] !== "application/json") {
        res.status(400).json({ error: "Content-Type must be application/json" });
    }
}