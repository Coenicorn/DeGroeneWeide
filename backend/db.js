/*

sqlite error codes: https://www.sqlite.org/rescode.html
might be convenient

*/

import Database from "better-sqlite3"
import path from 'path';
import { fileURLToPath } from 'url';
import { err_log, info_log, md5hash } from './util.js';
import config from './config.js';
import * as fs from "fs";
import { abort } from 'process';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'data.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

/**
 * Queries the database
 * @param {string} query sqlite query
 * @param {any[]} params sequentially replace '?' in query with value
 * @returns {Promise<Database.SqliteError|any[]>}
 */
export async function db_query(query, params) {
    return new Promise((resolve, reject) => {
        try {
            if (params === undefined) params = [];
            resolve(db.prepare(query).all(...params));
        } catch(e) {
            reject(e);
        }
    });
}

/**
 * Runs a query on the database. Does not return data
 * @param {string} query sqlite query
 * @param {any[]} params sequentially replace '?' in query with value
 * @returns {Promise<Database.SqliteError|null>}
 */
export async function db_execute(query, params) {
    return new Promise((resolve, reject) => {
        try {
            if (params === undefined) params = [];
            resolve(db.prepare(query).run(...params));
        } catch(e) {
            reject(e);
        }
    });
}

// Wordt uitgevoerd zodra de server gerunned wordt.
export async function initializeDB() {
    await db_execute(`
        CREATE TABLE IF NOT EXISTS Customers (
            id TEXT PRIMARY KEY NOT NULL,
            firstName TEXT NOT NULL,
            middleName TEXT,
            lastName TEXT NOT NULL,
            maySave BOOLEAN,
            birthDate TEXT,
            creationDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            blacklisted BOOLEAN,
            phoneNumber TEXT NOT NULL,
            mailAddress TEXT NOT NULL
        )
    `);

    await db_execute(`
        CREATE TABLE IF NOT EXISTS Bookings (
            id TEXT PRIMARY KEY NOT NULL,
            customerId TEXT NOT NULL, 
            startDate DATETIME NOT NULL,
            endDate DATETIME NOT NULL,
            amountPeople INT NOT NULL,
            creationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customerId) REFERENCES Customers (id)
        )
    `);

    await db_execute(`CREATE TABLE IF NOT EXISTS Payments (
            id TEXT PRIMARY KEY NOT NULL,
            bookingId TEXT NOT NULL,
            amount INT NOT NULL,
            hasPaid BOOLEAN NOT NULL,
            note TEXT,
            FOREIGN KEY (bookingId) REFERENCES Bookings (id)
    )`);

    // id is the uuid on the card
    await db_execute(`
        CREATE TABLE IF NOT EXISTS Cards (
            id TEXT PRIMARY KEY NOT NULL,
            bookingId TEXT,
            token TEXT,
            blocked BOOLEAN NOT NULL,
            FOREIGN KEY (bookingId) REFERENCES Bookings (id)
        )
    `);

    await db_execute(`
        CREATE TABLE IF NOT EXISTS AuthLevels (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL UNIQUE
        )
    `);

    await db_execute(`
        CREATE TABLE IF NOT EXISTS AmenityTypes (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL
        )
    `);

    // id is currently the md5 hash of a reader's mac address
    // amenityId can be null for when a reader is first initialized
    await db_execute(`
        CREATE TABLE IF NOT EXISTS Readers (
            id TEXT PRIMARY KEY NOT NULL UNIQUE,
            batteryPercentage INT,
            amenityId TEXT,
            lastPing TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
            name TEXT NOT NULL,
            active BOOLEAN,
            FOREIGN KEY (amenityId) REFERENCES AmenityTypes (id)
        )
    `);

    await db_execute(`
        CREATE TABLE IF NOT EXISTS CardAuthJunctions (
            cardId TEXT NOT NULL,
            authLevelId TEXT NOT NULL,
            PRIMARY KEY (cardId, authLevelId),
            FOREIGN KEY (cardId) REFERENCES Cards (id) ON DELETE CASCADE,
            FOREIGN KEY (authLevelId) REFERENCES AuthLevels (id) ON DELETE CASCADE
        )
    `)

    await db_execute(`
        CREATE TABLE IF NOT EXISTS ReaderAuthJunctions (
            readerId TEXT NOT NULL,
            authLevelId TEXT NOT NULL,
            UNIQUE (readerId, authLevelId),
            FOREIGN KEY (readerId) REFERENCES Readers (id) ON DELETE CASCADE,
            FOREIGN KEY (authLevelId) REFERENCES AuthLevels (id) ON DELETE CASCADE
        )
    `)

    // surfaceArea wordt nu niet gebruikt, idk waarom we die nu hebben
    await db_execute(`
        CREATE TABLE IF NOT EXISTS ShelterTypes (
            id TEXT NOT NULL,
            name TEXT NOT NULL,
            surfaceArea INT NOT NULL
        )
    `);

    await db_execute(`
        CREATE TABLE IF NOT EXISTS ShelterBookingJunctions (
            shelterId TEXT NOT NULL,
            bookingId TEXT NOT NULL,
            FOREIGN KEY (shelterId) REFERENCES ShelterTypes (id),
            FOREIGN KEY (bookingId) REFERENCES Bookings (id)
        )
    `);

    /* triggers */

    await db_execute(`
        CREATE TRIGGER IF NOT EXISTS updateLastPingOnInsert
        AFTER INSERT ON Readers
        FOR EACH ROW
        BEGIN
            UPDATE Readers
            SET lastPing = strftime('%s', 'now')
            WHERE rowid = new.rowid;
        END
    `);

    await db_execute(`
        CREATE TRIGGER IF NOT EXISTS updateLastPingOnUpdate
        AFTER UPDATE ON Readers
        FOR EACH ROW
        BEGIN
            UPDATE Readers
            SET lastPing = strftime('%s', 'now')
            WHERE rowid = new.rowid;
        END
    `);
}

/**
 * @note updated to schema 13.dec.2024
 * @param {string} idFromMacAddress Expected to be the hash of the mac address
 * @param {string} name
 */
export async function registerReader(
    idFromMacAddress, name
) {
    // store reader as inactive and empty battery by default
    const query = `
        INSERT INTO Readers (id, batteryPercentage, name, active) VALUES (?,?,?,?)
    `;

    // generate id from hash
    // let idFromMacAddress = md5hash(macAddress);
    
    return db_execute(query, [idFromMacAddress, 0, name, 0]);
}

/**
 * @note updated to schema 13.dec.2024
 */
export async function getAllReaders() {

    return db_query("SELECT * FROM Readers", []);

}

/**
 * @note updated to schema 13.dec.2024
 */
export async function getReader(id) {

    return db_query("SELECT * FROM Readers WHERE id = ?", [id]);
}

/**
 * Flag readers that have not sent a ping for more than 24 hours as inactive
 * @note updated to schema 13.dec.2024
 */
export async function readerFailedPingSetInactive(maxInactiveSeconds) {

    return db_execute("UPDATE Readers SET active = 0 WHERE (strftime('%s', 'now') - strftime('%s', lastPing)) > ? AND active = 1", [maxInactiveSeconds]);

}

/**
 * @note updated to schema 13.dec.2024
 */
export async function deleteCards() {

    return db_execute("DELETE FROM Cards", []);
}

/**
 * @note updated to schema 13.dec.2024
 */
export async function getAllCards() {
        return db_query("SELECT * FROM Cards", []);
}

/**
 * @note updated to schema 13.dec.2024
 * @note deze functie gebruikt LEFT JOIN, dus returnd ook cards zonder booking
 * @returns Alle cards gejoind met hun booking en customer
 */
export async function getAllExtensiveCards(){
    return db_query("SELECT Cards.*, al.id AS authLevelId, al.name as authLevelName FROM Cards LEFT JOIN Bookings ON Cards.bookingId = Bookings.id LEFT JOIN Customers ON Bookings.customerId = Customers.id LEFT JOIN CardAuthJunctions AS caj ON caj.cardId = Cards.id LEFT JOIN AuthLevels AS al ON al.id = caj.authLevelId", []);
}

/**
 * @note updated to schema 13.dec.2024
 */
export async function updateCard(id, bookingId, token, blocked) {
    return db_execute("UPDATE Cards SET bookingId=?, token=?, blocked=? WHERE id=?", [bookingId, token, blocked, id]);

}

export async function getAllBookings() {
    return db_query("SELECT * FROM Bookings LEFT JOIN Customers ON Bookings.customerId = Customers.id", []);
}

/**
 * @note updated to schema 13.dec.2024
 */
export async function insertCard(id, bookingId, token, blocked) {
    return db_execute("INSERT INTO Cards (id, bookingId, token, blocked) VALUES (?,?,?,?)", [id, bookingId, token, blocked]);
}

export async function insertBooking(id, customerId, startDate, endDate, amountPeople){
    return db_execute("INSERT INTO Bookings (id, customerId, startDate, endDate, amountPeople) VALUES (?, ?, ?, ?, ?)", [id, customerId, startDate, endDate, amountPeople]);
}

export async function insertReader(id, batteryPercentage, amenityId, lastPing, name, active) {
    return db_execute("INSERT INTO Cards (id, bookingId, token, blocked) VALUES (?,?,?,?,?,?)", [id, batteryPercentage, amenityId, lastPing, name, active]);
}

export async function removeCardByUUID(uuid){
    return db_execute("DELETE FROM Cards WHERE card_uuid = ?", [uuid]);
}

export async function removeCardByID(id) {
    return db_execute("DELETE FROM Cards WHERE id = ?", [id]);
}

export async function getCardByUUID(uuid){
    return db_query("SELECT * FROM Cards WHERE cards_uuid = ?", [uuid]);
}

export async function getCardById(id){
    return db_query("SELECT * FROM Cards WHERE id = ?", [id]);
}

export async function getCardTokenByCardUuid(card_uuid){
   return db_query("SELECT token FROM Cards WHERE card_uuid = ?", [card_uuid]);
}

export async function removeCardByBookingId(bookingId){
    return db_execute("DELETE FROM Cards WHERE bookingId = ?", [bookingId]);
}


export async function getCustomerByEmail(email){
    return db_query("SELECT * FROM Customers WHERE mailAddress = ?", [email]);
}

export async function getCustomerByPhone(phone){
    return db_query("SELECT * FROM Customers WHERE phoneNumber = ?", [phone]);
}

export async function getAllCustomers(){
    return db_query("SELECT * FROM Customers", []);
}

export async function getCustomerById(id){
    return db_query("SELECT * FROM Customers WHERE id = ?", []);
}

export async function insertCustomer(id, firstName, middleName, lastName, birthDate, maySave, creationDate, blacklisted, phoneNumber, mailAddress){
    return db_execute("INSERT INTO Customers (id, firstName, middleName, lastName, birthDate, maySave,creationDate,blacklisted,phoneNumber,mailAddress) VALUES (?,?,?,?,?,?,?,?,?,?)", [id, firstName, middleName, lastName,birthDate,maySave,creationDate,blacklisted,phoneNumber,mailAddress]);
}

export async function blacklistCustomer(mailAddress, active) {
    return db_execute("UPDATE Customers SET blacklisted = ? WHERE id = ?", [active, mailAddress]);
}

export async function deleteCustomer(mailAddress){
    return db_execute("DELETE FROM Customers WHERE mailAddress = ?", [mailAddress]);
}

export async function insertAuthLevel(id, name) {
    return db_execute("INSERT INTO AuthLevels (id, name) VALUES (?,?)", [id, name]);
}

export async function updateAuthLevelName(levelId, newName) {
    return db_execute("UPDATE AuthLevels SET name = ? WHERE id = ?", [newName, levelId]);
}

export async function deleteAuthLevel(levelId) {
    return db_execute("DELETE FROM AuthLevels WHERE id = ?", [levelId]);
}

export async function getAllAuthLevels() {
    return db_query("SELECT * FROM AuthLevels");
}




export async function linkReaderToAuthLevel(readerId, authLevelId) {
    return db_execute(`
        INSERT INTO ReaderAuthJunctions (readerId, authLevelId) VALUES (?,?)  
    `, [readerId, authLevelId]);
}

export async function unlinkReaderFromAuthLevel(readerId, authLevelId) {
    return db_execute(`
        DELETE FROM ReaderAuthJunctions WHERE readerId = ? AND authLevelId = ?    
    `, [readerId, authLevelId]);
}

export async function linkCardToAuthLevel(cardId, authLevelId) {
    return db_execute(`
        INSERT INTO CardAuthJunctions (cardId, authLevelId) VALUES (?,?)  
    `, [cardId, authLevelId]);
}


export async function unlinkCardFromAuthLevel(cardId, authLevelId) {
    return db_execute(`
        DELETE FROM CardAuthJunctions WHERE cardId = ? AND authLevelId = ?    
    `, [cardId, authLevelId]);
}



// queries a list of known cards and readers matching the given id's with the same authentication level only if the card has the same authentication token
export async function getReaderCardAuthLevelMatchesWithToken(cardId, readerId, cardToken) {
    return db_query(`
        SELECT DISTINCT Cards.id, Readers.id, Cards.token
        FROM Cards
        JOIN CardAuthJunctions ON Cards.id = CardAuthJunctions.cardId
        JOIN AuthLevels ON CardAuthJunctions.authLevelId = AuthLevels.id
        JOIN ReaderAuthJunctions ON AuthLevels.id = ReaderAuthJunctions.authLevelId
        JOIN Readers ON ReaderAuthJunctions.readerId = Readers.id
        WHERE Cards.token = ? AND Cards.id = ? AND Readers.id = ?
    `, [cardToken, cardId, readerId]);
}