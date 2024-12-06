import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { err_log, info_log, md5hash } from './util.js';
import { type } from 'os';
import config from './config.js';

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
        db.all(query, params, (err, rows) => {
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
                birthDate VARCHAR(20),
                maySave BOOLEAN,
                creationDate DATETIME,
                blacklisted BOOLEAN,
                phoneNumber VARCHAR(20),
                mailAddress VARCHAR(300)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS bookings (
                id TEXT PRIMARY KEY,
                customer_id TEXT,
                duePayments INTEGER,
                startDate DATETIME,
                endDate DATETIME,
                amountChildren INTEGER,
                amountAdults INTEGER,
                expectedArrival TIME,
                FOREIGN KEY (customer_id) REFERENCES customers (id)
            )
        `);

            // WHY IS IT CALLED card_uuid IT IS ALREADY IN A CARD RAAAAAAH

        db.run(`CREATE TABLE IF NOT EXISTS cards (
                id TEXT PRIMARY KEY NOT NULL,
                card_uuid VARCHAR(16) NOT NULL,
                booking_id TEXT NOT NULL,
                token VARCHAR(256) NOT NULL,
                level INT NOT NULL,
                blocked BOOLEAN NOT NULL,
                last_update INTEGER DEFAULT (strftime('%s', 'now')),
                FOREIGN KEY (booking_id) REFERENCES bookings (id)
            )
        `);
        // trigger to set the last_update to the current epoch second on cards
        db.run(`
            CREATE TRIGGER IF NOT EXISTS update_last_update
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
                level VARCHAR(20)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS cardsauthlevels (
                card_id TEXT,
                level INTEGER,
                FOREIGN KEY (card_id) REFERENCES cards (id),
                FOREIGN KEY (level) REFERENCES authlevels (id)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS amentitytypes (
                id TEXT PRIMARY KEY,
                type VARCHAR(20)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS bookingamenities (
                booking_id TEXT,
                type VARCHAR(20),
                FOREIGN KEY (type) REFERENCES amentitytypes (type),
                FOREIGN KEY (booking_id) REFERENCES bookings (id)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS standingplaces (
                id TEXT PRIMARY KEY,
                rawName VARCHAR(50),
                formattedName VARCHAR(50),
                booking_id TEXT,
                FOREIGN KEY (booking_id) REFERENCES bookings (id)
            )
        `);

        // id is currently the md5 hash of the mac address

        db.run(`CREATE TABLE IF NOT EXISTS readers (
                id TEXT PRIMARY KEY,
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

/**
 * @throws
 */
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
        INSERT INTO readers (id, macAddress, level, location, battery, active) VALUES (?,?,?,?,?,?)
    `;

    // generate id from hash
    let idFromMacAddress = md5hash(macAddress);
    
    try {
        await db.run(query, [idFromMacAddress, macAddress, 0, location, 0, false]);
        info_log(`added new reader with id ${idFromMacAddress}`);
    } catch(e) {
        throw new Error(`error inserting new reader into databast: ${e.message}`);
    }
}

/**
 * @throws
 */
export async function pingReaderIsAlive(isActive, readerId, batteryLevel) {
    
    const query = `
        UPDATE readers SET active=?, battery=?, lastUpdate=CURRENT_TIMESTAMP WHERE id=?
    `;

    try {
        await db.run(query, [isActive, batteryLevel, readerId]);
        info_log(`reader ${readerId} updated: { active: ${isActive}, battery: ${batteryLevel}}`);
    } catch(e) {
        throw new Error("error updating reader activity  " + readerId + " to " + isActive);
    }

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

/**
 * @throws
 */
export async function getReader(id) {

    if (
        typeof(id) !== 'string' || id.length == 0
    ) {
        throw new Error(`getReader was called with wrong argument types: ${typeof(id)} (${id})`);
    }

    const query = `
        SELECT * FROM readers WHERE id = ?
    `

    return new Promise((resolve, reject) => {
        db.get(query, [id], (err, result) => {
            if (err) reject(err.message)
            resolve(result);
        })
    })
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

export async function deleteCards(confirm){

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

export async function getAllCards() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM cards", [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        })
    })
}

export async function getAllExtensiveCards(){
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM cards JOIN bookings ON cards.booking_id = bookings.id JOIN customers ON bookings.customer_id = customers.id", [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        })

    });
}

export async function updateCard(id, card_uuid, booking_id, token, level, blocked) {
    const query = "UPDATE cards SET card_uuid=?, booking_id=?, token=?, level=?, blocked=? WHERE id=?";
    return new Promise((res, rej) => {
        db.run(query, [card_uuid, booking_id, token, level, blocked, id], function (err) {
            if (err) rej(err);
            res(this.changes);
        });
    });
}

export async function insertCard(id, card_uuid, booking_id, token, level, blocked) {
    try {
        const query = "INSERT INTO cards (id, card_uuid, booking_id, token, level, blocked) VALUES (?,?,?,?,?,?)";
        return new Promise((res, rej) => {
            db.run(query, [id, card_uuid, booking_id, token, level, blocked], (err) => {
                if (err) rej(err);
                res();
            });
        }) 
    } catch (error) {
        throw new Error("Error tijdens het toevoegen van nieuwe kaart: " + error.message);
    }

}

export async function removeCardByUUID(uuid){

    try{
        const query = "DELETE FROM cards WHERE card_uuid = ?";
        return await db.run(query, [uuid]);
    } catch (error) {
        throw new Error("Error tijdens het verwijderen van de kaart met uuid " + uuid + ": " + error.message);
    }

}

export async function removeCardByID(id) {
    try {
        const query = "DELETE FROM cards WHERE id = ?";
        return await db.run(query, [id]);
    } catch (error) {
        throw new Error("Error tijdens het verwijderen van de kaart met entry ID " + id + ": " + error.message);
    }
}

export async function getCardByUUID(uuid){
    try {
        const query = "SELECT * FROM cards WHERE cards_uuid = ?";
        return await db.run(query, [uuid]);
    } catch (error) {
        throw new Error("Error tijdens het verkrijgen van informatie met kaart uuid " + uuid + ": " + error.message);
    }
}

export async function getCardById(id){
    try {
        const query = "SELECT * FROM cards WHERE id = ?";
        return new Promise((res, rej) => {
            db.get(query, [id], (err, result) => {
                if (err) rej(err);
                res(result);
            });
        })
    } catch (error) {
        throw new Error("Error tijdens het verkrijgen van informatie met de kaart entry id " + id + ": " + error.message);
    }
}

export async function getCardTokenByCardUuid(card_uuid){
    try {
        const query = "SELECT token FROM cards WHERE cards_uuid = ?";
        return await db.run(query, [card_uuid]);
    } catch (error) {
        throw new Error("Error tijdens het verkrijgen van de kaart token met card uuid " + card_uuid + ": " + error.message);
    }
}

export async function removeCardByBookingId(booking_id){
    try {
        const query = "DELETE FROM cards WHERE booking_id = ?";
        return await db.run(query, [booking_id]);
    } catch (error){
        throw new Error("Error tijdens het verwijderen van kaart dmv booking id")
    }
}


export async function getCustomerByEmail(email){
    try {
        const query = "SELECT * FROM customers WHERE mailAdress = ?";
        return await db.run(query, [email]);
    } catch (error) {
        throw new Error("Error tijdens het verkrijgen van customer data dmv mail.");
    }
}

export async function getCustomerByPhone(phone){
    try {
        const query = "SELECT * FROM customers WHERE phoneNumber = ?";
        return await db.run(query, [phone]);
    } catch (error) {
        throw new Error("Error tijdens het verkrijgen van customer data dmv tel nummer")
    }
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
        return await db.run("SELECT * FROM customers WHERE id = ?", [id]);
    } catch (error){
        throw new Error("Error tijdens het verkrijgen van customer data dmv db entry ID");
    }
}

export async function insertCustomer(id, firstName, middleName, lastName, birthDate, maySave, creationDate, blacklisted, phoneNumber, mailAddress){
    try {
        const query = "INSERT INTO customers (id, firstName, middleName, lastName, birthDate, maySave,creationDate,blacklisted,phoneNumber,mailAddress) VALUES (?,?,?,?,?,?,?,?,?,?)";
        return await db.run(query, [id, firstName, middleName, lastName,birthDate,maySave,creationDate,blacklisted,phoneNumber,mailAddress]);
    } catch (error) {
        throw new Error("Er ging iets mis tijdens het inserten van een nieuwe customer.")
    }

}

export async function blacklistCustomer(mailAddress, active) {
    try {
        return await db.run(`UPDATE customers
        SET blacklisted = ?
        WHERE id = ?`,
            [active, mailAddress],
            (error) => {
                if (error) {
                    console.error('Error updating blacklisted value:', error.message);
                }
            });
    } catch (error) {
        throw new Error("Er ging iets mis tijdens het blacklisten van de gebruiker.")
    }
}

export async function deleteCustomer(mailAddress){
    try {
        return await db.run(`DELETE FROM customers WHERE mailAddress = ?`, [mailAddress]);
    } catch (error) {
        throw new Error("Er ging iets mis tijdens het verwijderen van de gebruiker.")
    }
}