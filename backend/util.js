import { Console } from "console";
import config from "./config.js";
import { createHash } from "crypto";
import * as fs from "fs";
import path from "path";
import { db_execute, db_query, readerFailedPingSetInactive } from "./db.js";

const log_dir_path = path.join(import.meta.dirname, "log/");
const log_stdout = fs.createWriteStream(path.join(log_dir_path, "stdout.log"), {flags: "a"});
const log_stderr = fs.createWriteStream(path.join(log_dir_path, "stderr.log"), {flags: "a"});
const log_console = new Console({stdout: log_stdout, stderr: log_stderr});

function _log_get_prefix_time() {
    let d = new Date();
    return `[${d.toLocaleTimeString()}]`;
}

function _log_get_prefix_type(type) {
    // if (config.environment === "dev") {
    //     let d = new Date();
    //     return `[${d.toLocaleTimeString()}][${type}] ${msg}`;
    // } else {
    //     return `[${type}] ${msg}`;
    // }
    return `[${type}]`;
}

function _log_get_full_prefix(msg, type) {
    return _log_get_prefix_time() + _log_get_prefix_type(type) + " " + msg;
}

function _log_get_local_prefix(msg, type) {
    return _log_get_prefix_type(type) + " " + msg;
}

// server startup message
log_console.log("\n" + _log_get_full_prefix("------ NEW SERVER STARTUP ------", "INFO"));

export function info_log(msg) {
    // only log time to file
    log_console.log(_log_get_full_prefix(msg, "INFO"));
    console.log(_log_get_local_prefix(msg, "INFO"));
}

export function err_log(msg, err = null) {
    // output to stdout AND stderr
    // only log time to file
    log_console.error(_log_get_full_prefix(msg, "ERROR"));
    log_console.error(err);
    console.error(_log_get_local_prefix(msg, "ERROR"));
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

export function sqliteDATETIMEToDate( dateAsString ) {
    const ymdDelimiter = "-";
    var pattern = new RegExp( "(\\d{4})" + ymdDelimiter + "(\\d{2})" + ymdDelimiter + "(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})" );
    var parts = dateAsString.match( pattern );

    return new Date( Date.UTC(
      parseInt( parts[1] )
    , parseInt( parts[2], 10 ) - 1
    , parseInt( parts[3], 10 )
    , parseInt( parts[4], 10 )
    , parseInt( parts[5], 10 )
    , parseInt( parts[6], 10 )
    , 0
    ));
}

export async function deleteOldTempReservations() {
    const res = await db_execute(`
        DELETE FROM TempReservations AS tr WHERE tr.dateReservationSent < DATETIME('now', '-10 minutes')
    `);
    info_log(`deleted ${res.changes} old temp reservations`);
}

// periodically update the inactive readers
export async function periodicActivityUpdate() {

    const rows = await readerFailedPingSetInactive(config.maxInactiveSeconds);

    info_log("flagged " + rows.changes + " readers as inactive");

}

export function verifyDateString(dateString) {
    if (typeof(dateString) !== "string") return false;
    if (dateString == "") return false; /* weak comparison, idk what behaviour that could cause */
    return true;
}