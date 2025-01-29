import { Console, debug } from "console";
import config from "./config.js";
import { createHash } from "crypto";
import * as fs from "fs";
import path from "path";
import { db_execute, db_query, readerFailedPingSetInactive } from "./db.js";

const log_dir_path = path.join(import.meta.dirname, "log/");
const log_stdout = fs.createWriteStream(path.join(log_dir_path, "stdout.log"), {flags: "a"});
const log_stderr = fs.createWriteStream(path.join(log_dir_path, "stderr.log"), {flags: "a"});
const log_debug = fs.createWriteStream(path.join(log_dir_path, "debug.log"), {flags: "a"});
const log_console = new Console({stdout: log_stdout, stderr: log_stderr});
const debug_console = new Console({stdout: log_debug});

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

// use this when you're not sure if the message is important for info_log
// we might want to know anyway
// only logged to file
export function debug_log(msg) {
    if (typeof(msg) === "string") debug_console.log(_log_get_full_prefix(msg, "DEBUG"));
    else {
        debug_console.log(_log_get_full_prefix("non-string log", "DEBUG"));
        debug_console.log(msg);
    }
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
        DELETE FROM TempReservations AS tr WHERE tr.dateReservationSent < DATETIME('now', '-30 minutes')
    `);
    if (res.changes === 0) return;
    debug_log(`deleted ${res.changes} old temp reservations`);
}

// periodically update the inactive readers
export async function periodicActivityUpdate() {

    const rows = await readerFailedPingSetInactive(config.maxInactiveSeconds);
    if (rows.changes === 0) return;
    debug_log("flagged " + rows.changes + " readers as inactive");

}

/**
 * verifies a captcha string with google
 * @param {string} captchaString 
 * @returns {boolean} true if verified, false if not
 */
export async function verifyCaptchaStringWithGoogle(captchaString) {
    const googleUrl = "https://www.google.com/recaptcha/api/siteverify";

    const params = new URLSearchParams([
        ["secret", config.captchaPrivateKey],
        ["response", captchaString]
    ]);

    const finalUrl = googleUrl + "?" + params.toString();

    try {

        const result = await fetch(finalUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        const resultBodyJson = await result.json();

        return resultBodyJson.success;

    } catch(e) {

        err_log("error in captcha", e);

        return false;

    }
}




export function validateIncomingFormData(
    firstName,
    lastName,
    mailAddress,
    phoneNumber,
    startDate,
    endDate,
    amountPeople,
    accomodation,
    notes
) {

    // MalformedValueNotes
    const mvn = {
        voornaam: [],
        achternaam: [],
        email: [],
        telefoonnummer: [],
        startDate: [],
        endDate: [],
        amountGuests: [],
        typeAccommodatie: [],
        note: []
    };

    function mvnIsValid() {
        let isEmpty = true;
        Object.values(mvn).forEach(k => {
            if (k.length > 0) isEmpty = false;
        });
        return isEmpty;
    }

    if (typeof(firstName) !== "string") mvn.voornaam.push("voornaam is geen woord");
    if (typeof(lastName) !== "string") mvn.achternaam.push("achternaam is geen woord");
    if (typeof(mailAddress) !== "string") mvn.email.push("mailaddres is geen woord");
    if (typeof(phoneNumber) !== "string") mvn.telefoonnummer.push("telefoonnummer is geen woord");
    if (typeof(startDate) !== "string") mvn.startDate.push("startdatum is niet geldig");
    if (typeof(endDate) !== "string") mvn.endDate.push("einddatum is niet geldig");
    if (typeof(amountPeople) !== "number") mvn.amountGuests.push("hoeveelheid mensen is geen nummer");
    if (typeof(accomodation) !== "string") mvn.typeAccommodatie.push("accomodatie is niet geldig");
    if (typeof(notes) !== "string") mvn.note.push("notities is geen woord");

    if (!mvnIsValid()) {
        return mvn;
    }

    if (firstName.trim() === "") mvn.voornaam.push("voornaam is leeg");
    if (lastName.trim() === "") mvn.achternaam.push("achternaam is leeg");
    if (mailAddress.trim() === "") mvn.email.push("mailadres is leeg");
    if (phoneNumber.trim() === "") mvn.telefoonnummer.push("telefoonnummer is leeg");
    if (startDate.trim() === "") mvn.startDate.push("begindatum is leeg");
    if (endDate.trim() === "") mvn.endDate.push("einddatum is leeg");
    if (amountPeople <= 0) mvn.amountGuests.push("hoeveelheid mensen mag niet minder zijn dan 1");
    if (amountPeople > 100) mvn.amountGuests.push("hoeveelheid mensen mag niet meer zijn dan 100");
    if (accomodation.trim() === "") mvn.typeAccommodatie.push("accomodatie is leeg");

    if (accomodation === "default") mvn.typeAccommodatie.push("selecteer alstjeblieft een type accomodatie");

    if (!Date.parse(startDate)) mvn.startDate.push("begindatum is niet geldig");
    if (!Date.parse(endDate)) mvn.endDate.push("einddatum is niet geldig");

    if (!mvnIsValid()) {
        return mvn;
    }

    const startDate_d = new Date(startDate);
    const endDate_d = new Date(endDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0);

    if (endDate_d.getTime() < startDate_d.getTime()) mvn.endDate.push("einddatum mag niet eerder zijn dan begindatum");
    if (endDate_d.getTime() < currentDate.getTime()) mvn.endDate.push("einddatum mag niet in het verleden zijn");
    if (startDate_d.getTime() < currentDate.getTime()) mvn.startDate.push("begindatum mag niet in het verleden zijn");

    if (!mailAddress.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) mvn.email.push("email is niet geldig");

    if (!mvnIsValid()) {
        return mvn;
    } else {
        return undefined;
    }

}