import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { debug_log, err_log, info_log, md5hash } from './util.js';
import { type } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);

// Wordt uitgevoerd zodra de server gerunned wordt.
export async function initializeDB() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS customers (
                Id TEXT PRIMARY KEY,
                firstName VARCHAR(100),
                middleName VARCHAR(10),
                lastName VARCHAR(100),
                birthDate VARCHAR(20),
                maySave BOOLEAN,
                creationDate DATETIME,
                blacklisted BOOLEAN,
                phoneNumber VARCHAR(20),
                mailAddress VARCHAR(300)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS bookings (
                Id TEXT PRIMARY KEY,
                customer_Id TEXT,
                duePayments INTEGER,
                startDate DATETIME,
                endDate DATETIME,
                amountChildren INTEGER,
                amountAdults INTEGER,
                expectedArrival TIME,
                FOREIGN KEY (customer_Id) REFERENCES customers (Id)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS cards (
                Id TEXT PRIMARY KEY,
                card_uuid VARCHAR(16),
                booking_Id TEXT,
                token VARCHAR(256),
                blocked BOOLEAN,
                FOREIGN KEY (booking_Id) REFERENCES bookings (Id)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS authlevels (
                Id TEXT PRIMARY KEY,
                level VARCHAR(20)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS cardsauthlevels (
                card_Id TEXT,
                level INTEGER,
                FOREIGN KEY (card_Id) REFERENCES cards (Id),
                FOREIGN KEY (level) REFERENCES authlevels (Id)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS amentitytypes (
                Id TEXT PRIMARY KEY,
                type VARCHAR(20)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS bookingamenities (
                booking_Id TEXT,
                type VARCHAR(20),
                FOREIGN KEY (type) REFERENCES amentitytypes (type),
                FOREIGN KEY (booking_Id) REFERENCES bookings (Id)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS standingplaces (
                Id TEXT PRIMARY KEY,
                rawName VARCHAR(50),
                formattedName VARCHAR(50),
                booking_Id TEXT,
                FOREIGN KEY (booking_Id) REFERENCES bookings (Id)
            )
        `);

        // Id is currently the md5 hash of the mac address

        db.run(`CREATE TABLE IF NOT EXISTS readers (
                Id TEXT PRIMARY KEY,
                macAddress VARCHAR(18),
                level INTEGER,
                location VARCHAR(50),
                battery INTEGER,
                active BOOLEAN,
                lastUpdate TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
    });
}

export async function registerReader(
    macAddress, location
) {
    if (
        typeof(macAddress) !== 'string' || macAddress.length == 0 ||
        typeof(location) !== 'string' || location.length == 0
    ) {
        throw new Error(`registerReader was called with the wrong argument types: ${typeof(macAddress)} (${macAddress}), ${typeof(location)} (${location})\
        `);
    }

    // store reader as inactive and empty battery by default, with auth level 0 by default
    const query = `
        INSERT INTO readers (Id, macAddress, level, location, battery, active) VALUES (?,?,?,?,?,?)
    `;

    // generate id from hash
    let idFromMacAddress = md5hash(macAddress);
    
    return new Promise((resolve, reject) => {
        db.run(query, [idFromMacAddress, macAddress, 0, location, 0, false], (err) => {
            if (err) reject(err);

            info_log(`registered new reader with id ${idFromMacAddress}`);

            resolve();
        });
    })
}

export async function pingReaderIsAlive(isActive, readerId, batteryLevel) {
    
    const query = `
        UPDATE readers SET active=?, battery=?, lastUpdate=CURRENT_TIMESTAMP WHERE Id=?
    `;
    
    return new Promise((resolve, reject) => {
        db.run(query, [isActive, batteryLevel, readerId], (err) => {
            if (err) reject(err);

            debug_log(`reader ${readerId} updated: { active: ${isActive}, battery: ${batteryLevel}}`);

            resolve();
        });
    });

}

export async function getAllReaders() {

    const query = `
        SELECT * FROM readers
    `;
    
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });

}

export async function getReader(id) {

    if (
        typeof(id) !== 'string' || id.length == 0
    ) {
        throw new Error(`getReader was called with wrong argument types: ${typeof(id)} (${id})`);
    }

    const query = `
        SELECT * FROM readers WHERE Id = ?
    `;

    return new Promise((resolve, reject) => {
        db.get(query, [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

/**
 * @throws
 */
export async function storeInactiveReaders() {

    const query = `UPDATE readers SET active = 0 WHERE (strftime('%s', 'now') - strftime('%s', lastUpdate)) / 60 > 1 AND active = 1;`; /* set active = 0 for all readers that have not pinged for more than a minute */

    return new Promise((resolve, reject) => {
        db.run(query, function /* weird syntax, if the callback is an arrow function then the `this` object is not propogated correctly */(err) {
            if (err) reject(err);

            info_log(`reader activity check found ${this.changes} inactive readers`);

            resolve();
        });
    });
}

export function deleteCards(confirm){

    if(!confirm){
        return false;
    }

    return new Promise((res, rej) => {
        db.run("DELETE FROM cards", (err) => {
            if (err) {
                err_log("Error heeft zich opgetreden tijdens deleteCards(): "+err.message);
                rej(false);
            } else {
                info_log("Succesvol alle cards verwijdert uit database.");
                res(true);
            }
        })
    });
}

export function getAllCards() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM cards", [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        })
    })
}

export async function insertCard(Id, card_uuid, booking_Id, token, blocked) {

    const query = "INSERT INTO cards (Id, card_uuid, booking_Id, token, blocked) VALUES (?,?,?,?,?)";

    return new Promise((resolve, reject) => {
        db.run(query, [Id, card_uuid, booking_Id, token, blocked], (err) => {
            if (err) reject(err);
            resolve();
        });
    });

}

export async function removeCardByUUID(uuid){

    const query = "DELETE FROM cards WHERE card_uuid = ?";

    return new Promise((resolve, reject) => {
        db.run(query, [uuid], (err) => {
            if (err) reject(err);
            resolve();
        });
    });

}

export async function removeCardByID(id) {

    const query = "DELETE FROM cards WHERE id = ?";

    return new Promise((resolve, reject) => {
        db.run(query, [id], (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

export async function getCardByUUID(uuid){

    const query = "SELECT * FROM cards WHERE cards_uuid = ?";

    return new Promise((resolve, reject) => {
        db.get(query, [uuid], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });
}

export async function getCardById(id){
    const query = "SELECT * FROM cards WHERE id = ?";

    return new Promise((resolve, reject) => {
        db.get(query, [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

export async function getCardTokenByCardUuid(card_uuid){
    const query = "SELECT token FROM cards WHERE cards_uuid = ?";

    return new Promise((resolve, reject) => {
        db.get(query, [card_uuid], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

export async function removeCardByBookingId(booking_id){
    const query = "DELETE FROM cards WHERE booking_id = ?";

    return new Promise((resolve, reject) => {
        db.run(query, [booking_id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}


export async function getCustomerByEmail(email){
    const query = "SELECT * FROM customers WHERE mailAdress = ?";

    return new Promise((resolve, reject) => {
        db.get(query, [email], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

export async function getCustomerByPhone(phone){
    const query = "SELECT * FROM customers WHERE phoneNumber = ?";

    return new Promise((resolve, reject) => {
        db.get(query, [phone], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

export async function getAllCustomers(){
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM customers", [], (err, rows) => {
            if (err) {
                reject(err);
            } else {}
            resolve(rows);
        })
    });
}

export async function getCustomerById(id){
    try {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM customers WHERE Id = ?", [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    } catch (error){
        throw new Error("Error tijdens het verkrijgen van customer data dmv db entry ID");
    }
}

export async function insertCustomer(Id, firstName, middleName, lastName, birthDate, maySave, creationDate, blacklisted, phoneNumber, mailAddress){
    const query = "INSERT INTO customers (Id, firstName, middleName, lastName, birthDate, maySave,creationDate,blacklisted,phoneNumber,mailAddress) VALUES (?,?,?,?,?,?,?,?,?,?)";
    return new Promise((resolve, reject) => {
        db.run(query, [Id, firstName, middleName, lastName,birthDate,maySave,creationDate,blacklisted,phoneNumber,mailAddress], (err) => {
            if (err) reject(err);
            resolve();
        });
    });

}

export async function blacklistCustomer(mailAddress, active) {
    const query = `UPDATE customers
    SET blacklisted = ?
    WHERE Id = ?`;
    
    return new Promise((resolve, reject) => {
        db.run(query, [active, mailAddress], (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

export async function deleteCustomer(mailAddress){
    const query = `DELETE FROM customers WHERE mailAddress = ?`;

    return new Promise((resolve, reject) => {
        db.run(query, [mailAddress], (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}