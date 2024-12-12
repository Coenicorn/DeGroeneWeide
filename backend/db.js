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
 * @param {any} params 
 * @returns {Promise<Error|Any[]>} database return value
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
 * @param {any} params 
 * @returns {Promise<Error|Any[]>}
 */
export async function db_execute(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

// Wordt uitgevoerd zodra de server gerunned wordt.
export async function initializeDB() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS customers (
                id TEXT PRIMARY KEY,
                firstName VARCHAR(100),
                middleName VARCHAR(10),
                lastName VARCHAR(100),
                maySave BOOLEAN,
                birthDate TEXT,
                creationDate DATETIME,
                blacklisted BOOLEAN,
                phoneNumber TEXT,
                mailAddress TEXT
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS bookings (
                id TEXT PRIMARY KEY,
                customer_id TEXT, 
                startDate DATETIME,
                endDate DATETIME,
                amountPeople INTEGER,
                FOREIGN KEY (customer_id) REFERENCES customers (id)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS payments (
                booking_id TEXT,
                amount INT,
                status BOOLEAN,
                note TEXT,
                FOREIGN KEY (booking_id) REFERENCES bookings (id)
        )`);

            // WHY IS IT CALLED card_uuid IT IS ALREADY IN A CARD RAAAAAAH
            // `card_uuid` vervangen door `cardAddress`

        db.run(`CREATE TABLE IF NOT EXISTS cards (
                id TEXT PRIMARY KEY NOT NULL,
                cardAddress TEXT NOT NULL,
                booking_id TEXT NOT NULL,
                token TEXT NOT NULL,
                levelId INT NOT NULL,
                blocked BOOLEAN NOT NULL,
                last_update INTEGER DEFAULT (strftime('%s', 'now')),
                FOREIGN KEY (booking_id) REFERENCES bookings (id),
                FOREIGN KEY (levelId) REFERENCES authLevels (id)
            )
        `);
        // trigger to set the last_update to the current epoch second on cards
        db.run(`
            CREATE TABLE IF NOT EXISTS update_last_update
            BEFORE UPDATE ON cards
            FOR EACH ROW
            BEGIN
                UPDATE cards
                SET last_update = strftime('%s', 'now')
                WHERE rowid = NEW.rowid;
            END;
        `);

        db.run(`CREATE TABLE IF NOT EXISTS authlevels (
                id TEXT PRIMARY KEY,
                level INT,
                name TEXT
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS amenityauthjunctions (
                amenity_id TEXT,
                authlevel_id TEXT,
                FOREIGN KEY (amenity_id) REFERENCES amenitytypes (id),
                FOREIGN KEY (authlevel_id) REFERENCES authlevels (id)
            )`)

        db.run(`CREATE TABLE IF NOT EXISTS amenitytypes (
                id TEXT PRIMARY KEY,
                name TEXT,
            )
        `);

        // id is currently the md5 hash of the mac address

        db.run(`CREATE TABLE IF NOT EXISTS readers (
                id TEXT PRIMARY KEY,
                authLevel_id TEXT,
                amenity_id TEXT,
                lastPing TEXT DEFAULT CURRENT_TIMESTAMP,
                location TEXT,
                batteryPercentage INT,
                active BOOLEAN
        `);

        db.run(`CREATE TABLE IF NOT EXISTS shelterType (
                id TEXT,
                name TEXT,
                surface INT
        )`)

        db.run(`CREATE TABLE IF NOT EXISTS shelterBooking (
                shelter_id TEXT,
                booking_id TEXT,
                FOREIGN KEY (shelter_id) REFERENCES shelterType (id),
                FOREIGN KEY (booking_id) REFERENCES bookings (id)
            )`)
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

/**
 * @throws
 */
// export async function pingReaderIsAlive(isActive, readerId, batteryLevel) {
    
//     const query = `
//         UPDATE readers SET active=?, battery=?, lastUpdate=CURRENT_TIMESTAMP WHERE id=?
//     `;

//     try {
//         await db.run(query, [isActive, batteryLevel, readerId]);
//         info_log(`reader ${readerId} updated: { active: ${isActive}, battery: ${batteryLevel}}`);
//     } catch(e) {
//         throw new Error("error updating reader activity  " + readerId + " to " + isActive);
//     }
    

// }

export async function getAllReaders() {

    // const query = `
    //     SELECT * FROM readers
    // `;

    // return new Promise((resolve, reject) => {
    //     db.all(query, (err, rows) => {
    //         if (err) reject(err);
    //         resolve(rows);
    //     });
    // });

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
 * @throws
 */
export async function readerFailedPingSetInactive() {

    await db.run(
        `
        UPDATE readers
        SET active = 0
        WHERE (strftime('%s', 'now') - strftime('%s', lastUpdate)) / 60 > 1 AND active = 1;
        `,
        function (err) {
            if (err) throw err;
            info_log(`rows affected: ${this.changes}`);
        }
    );

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
    return db_query("SELECT * FROM cards JOIN bookings ON cards.booking_id = bookings.id JOIN customers ON bookings.customer_id = customers.id", []);
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
    return db_query("SELECT * FROM customers WHERE mailAddress = ?", [email]);
}

export async function getCustomerByPhone(phone){
    return db_query("SELECT * FROM customers WHERE phoneNumber = ?", [phone]);
}

export async function getAllCustomers(){
    return db_query("SELECT * FROM customers", []);
}

export async function getCustomerById(id){
    return db_query("SELECT * FROM customers WHERE id = ?", []);
}

export async function insertCustomer(id, firstName, middleName, lastName, birthDate, maySave, creationDate, blacklisted, phoneNumber, mailAddress){
    return db_execute("INSERT INTO customers (id, firstName, middleName, lastName, birthDate, maySave,creationDate,blacklisted,phoneNumber,mailAddress) VALUES (?,?,?,?,?,?,?,?,?,?)", [id, firstName, middleName, lastName,birthDate,maySave,creationDate,blacklisted,phoneNumber,mailAddress]);
}

export async function blacklistCustomer(mailAddress, active) {
    return db_execute("UPDATE customers SET blacklisted = ? WHERE id = ?", [active, mailAddress]);
}

export async function deleteCustomer(mailAddress){
    return db_execute("DELETE FROM customers WHERE mailAddress = ?", [mailAddress]);
}