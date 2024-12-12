import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { err_log, info_log, md5hash } from './util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);

/**
 * Queries the database
 * @param {string} query sqlite query
 * @param {any[]} params sequentially replace '?' in query with value
 * @returns {Promise<Error|any[]>}
 */
export async function db_query(query, params) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

/**
 * Runs a query on the database. Does not return data
 * @param {string} query sqlite query
 * @param {any[]} params sequentially replace '?' in query with value
 * @returns {Promise<Error|null>}
 */
export async function db_execute(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err, rows) => {
            if (err) reject(err);
            resolve(null);
        });
    });
}

// Wordt uitgevoerd zodra de server gerunned wordt.
export async function initializeDB() {
    db.serialize(() => {
        db.run(`
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

        db.run(`
            CREATE TABLE IF NOT EXISTS Bookings (
                id TEXT PRIMARY KEY NOT NULL,
                customerId TEXT NOT NULL, 
                startDate DATETIME NOT NULL,
                endDate DATETIME NOT NULL,
                amountPeople INT NOT NULL,
                FOREIGN KEY (customerId) REFERENCES Customers (id)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS Payments (
                id TEXT PRIMARY KEY NOT NULL
                bookingId TEXT NOT NULL,
                amount INT NOT NULL,
                hasPaid BOOLEAN NOT NUL,
                note TEXT,
                FOREIGN KEY (bookingId) REFERENCES Bookings (id)
        )`);

        // id is the uuid on the card
        db.run(`
            CREATE TABLE IF NOT EXISTS Cards (
                id TEXT PRIMARY KEY NOT NULL,
                bookingId TEXT NOT NULL,
                token TEXT NOT NULL,
                blocked BOOLEAN NOT NULL,
                FOREIGN KEY (bookingId) REFERENCES Bookings (id)
            )
        `);
        
        // trigger to set lastPing to the current epoch second on cards
        db.run(`
            CREATE TRIGGER IF NOT EXISTS updateLastPingOnInsert
            AFTER UPDATE ON Readers
            FOR EACH ROW
            BEGIN
                UPDATE Readers
                SET lastPing = strftime('%s', 'now')
                WHERE rowid = NEW.rowid;
            END;
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS AuthLevels (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS AmenityTypes (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL
            )
        `);

        // id is currently the md5 hash of a reader's mac address
        db.run(`
            CREATE TABLE IF NOT EXISTS Readers (
                id TEXT PRIMARY KEY NOT NULL,
                batteryPercentage INT,
                amenityId TEXT NOT NULL,
                lastPing TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
                name TEXT NOT NULL,
                FOREIGN KEY (amenityId) REFERENCES AmenityTypes
            )
        `);

        // surfaceArea wordt nu niet gebruikt, idk waarom we die nu hebben
        db.run(`
            CREATE TABLE IF NOT EXISTS ShelterTypes (
                id TEXT NOT NULL,
                name TEXT NOT NULL,
                surfaceArea INT NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS ShelterBookingJunctions (
                shelterId TEXT NOT NULL,
                bookingId TEXT NOT NULL,
                FOREIGN KEY (shelterId) REFERENCES ShelterTypes (id),
                FOREIGN KEY (bookingId) REFERENCES Bookings (id)
            )
        `);
    });
}

/**
 * @throws
 */
export async function registerReader(
    macAddress, location
) {
    if (
        typeof(macAddress) !== 'string' || macAddress.length === 0 ||
        typeof(location) !== 'string' || location.length === 0
    ) {
        throw new Error(`registerReader was called with the wrong argument types: ${typeof(macAddress)} (${macAddress}), ${typeof(location)} (${location})\
        `);
    }

    // store reader as inactive and empty battery by default, with auth level 0 by default
    const query = `
        INSERT INTO readers (id, macAddress, level, location, battery, active) VALUES (?,?,?,?,?,?)
    `;

    // generate id from hash
    let idFromMacAddress = md5hash(macAddress);
    
    try {
        await db.run(query, [idFromMacAddress, macAddress, 0, location, 0, false]);
        info_log(`added new reader with id ${idFromMacAddress}`);
    } catch(e) {
        throw new Error(`error inserting new reader into database: ${e.message}`);
    }
}

export async function getAllReaders() {

    return db_query("SELECT * FROM readers", []);

}

/**
 * @throws
 */
export async function getReader(id) {

    if (
        typeof(id) !== 'string' || id.length === 0
    ) {
        throw new Error(`getReader was called with wrong argument types: ${typeof(id)} (${id})`);
    }

    // const query = `
    //     SELECT * FROM readers WHERE id = ?
    // `

    // return new Promise((resolve, reject) => {
    //     db.get(query, [id], (err, result) => {
    //         if (err) reject(err.message)
    //         resolve(result);
    //     })
    // })
    return db_query("SELECT * FROM readers WHERE id = ?", [id]);
}

/**
 * Flag readers that have not sent a ping for more than 24 hours as inactive
 */
export async function readerFailedPingSetInactive() {

    await db.run(
        `
        UPDATE Readers
        SET active = 0
        WHERE (strftime('%s', 'now') - strftime('%s', lastPing)) > 24 * 60 * 60 AND active = 1;
        `,
        function (err) {
            if (err) throw err;
            info_log(`rows affected: ${this.changes}`);
        }
    );

    return db_execute("UPDATE Readers SET active = 0 WHERE (strftime('%s', 'now') - strftime('%s', lastPing)) > 24 * 60 * 60 AND active = 1");

}

export async function deleteCards(confirm) {

    if (!confirm) {
        return false;
    }

    return db_execute("DELETE FROM cards", []);
}

export async function getAllCards() {
        return db_query("SELECT * FROM cards", []);
}

export async function getAllExtensiveCards(){
    return db_query("SELECT * FROM cards JOIN Bookings ON cards.booking_id = Bookings.id JOIN Customers ON Bookings.customer_id = Customers.id", []);
}

export async function updateCard(id, card_uuid, booking_id, token, level, blocked) {
    return db_execute("UPDATE cards SET card_uuid=?, booking_id=?, token=?, level=?, blocked=? WHERE id=?", [card_uuid, booking_id, token, level, blocked, id]);

}
export async function insertCard(id, card_uuid, booking_id, token, level, blocked) {
    return db_execute("INSERT INTO cards (id, card_uuid, booking_id, token, level, blocked) VALUES (?,?,?,?,?,?)", [id, card_uuid, booking_id, token, level, blocked]);
}

export async function removeCardByUUID(uuid){
    return db_execute("DELETE FROM cards WHERE card_uuid = ?", [uuid]);
}

export async function removeCardByID(id) {
    return db_execute("DELETE FROM cards WHERE id = ?", [id]);
}

export async function getCardByUUID(uuid){
    return db_query("SELECT * FROM cards WHERE cards_uuid = ?", [uuid]);
}

export async function getCardById(id){
    return db_query("SELECT * FROM cards WHERE id = ?", [id]);
}

export async function getCardTokenByCardUuid(card_uuid){
   return db_query("SELECT token FROM cards WHERE card_uuid = ?", [card_uuid]);
}

export async function removeCardByBookingId(booking_id){
    return db_execute("DELETE FROM cards WHERE booking_id = ?", [booking_id]);
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