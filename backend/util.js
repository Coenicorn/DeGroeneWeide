import { Console } from "console";
import config from "./config.js";
import { createHash } from "crypto";
import * as fs from "fs";
import path from "path";

const log_dir_path = path.join(import.meta.dirname, "log/");
const log_stdout = fs.createWriteStream(path.join(log_dir_path, "stdout.log"), {flags: "a"});
const log_stderr = fs.createWriteStream(path.join(log_dir_path, "stderr.log"), {flags: "a"});
const log_console = new Console({stdout: log_stdout, stderr: log_stderr});

function _log_getprefix(msg, type) {
    if (config.environment === "dev") {
        let d = new Date();
        return `[${d.toLocaleTimeString()}][${type}] ${msg}`;
    } else {
        return `[${type}] ${msg}`;
    }
}

// server startup message
log_console.log("\n" + _log_getprefix("------ NEW SERVER STARTUP ------", "INFO"));

export function info_log(msg) {
    const str = _log_getprefix(msg, "INFO");
    // output to stdout
    log_console.log(str);
    console.log(str);
}

export function err_log(msg, err = null) {
    const str = _log_getprefix(msg, "ERROR");
    // output to stdout AND stderr
    log_console.error(str);
    log_console.error(err);
    console.error(str);
    console.error(err);
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

export function dateToDateTimeString() {
    const d = new Date();

    info_log(d.toISOString());
}

// checks if the request has access to the route
export function onlyAdminPanel(req, res, next) {
    const apiKey = req.header("x-api-key");
    if (apiKey !== config.keyAdminPanel) {
        return res.status(403).send("Invalid API key");
    }
    next();
}