import config from "./config.js";
import { createHash } from "crypto";

/** logs '[$type] $msg' to console */
function _log(msg, type) {
    if (config.environment === "dev") {
        let d = new Date();
        console.log(`[${d.toLocaleTimeString()}][${type}] ${msg}`);
    } else {
        console.log(`[${type}] ${msg}`);
    }
}

export function info_log(msg) {
    // console.log(`[INFO] ${msg}`);
    _log(msg, "INFO");
}

export function err_log(msg, err = null) {
    // console.log(`[ERROR] ${msg}`);
    _log(msg, "ERROR");
    if (err) console.error(err);
}

export function md5hash(str) {
    return createHash("md5").update(str).digest('hex');
}

export function hastoAcceptJson(req, res, next) {
    if (req.method !== "POST") return next();
    if (req.headers["content-type"] !== "application/json") {
        return respondwithstatus(res, 400, "'Content-Type' header must be 'application/json'")
    }
    next();
}

export function respondwithstatus(res, statusCode, statusMsg, additionalObject) {
    let ret = {};

    ret.status = statusMsg;

    if (additionalObject !== undefined) ret.additional = additionalObject;

    res.status(statusCode).json(ret).end();
}

function routeFromRegexp(regexpStr) {
    let str = "";
    if (typeof(regexpStr) === "string") str = regexpStr;
    else str = regexpStr.toString();
    str = str.slice(4);
    str = str.split("\\")[0];
    if (str.startsWith("?")) return "";
    return str;
}

function routesFromStack(stack) {
    let t = [];
    for (let r of stack) {
        if (r.handle.stack) {
            t.push(...routesFromStack(r.handle.stack));
        } else {
            let str = routeFromRegexp(r.regexp);
            if (str.length !== 0) t.push(str);
        }
    }
    return t;
}

export function routesFromApp(app) {
    return routesFromStack(app._router.stack);
}