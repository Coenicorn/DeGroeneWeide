import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

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
                mailAdress VARCHAR(300)
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

        db.run(`CREATE TABLE IF NOT EXISTS readers (
                Id TEXT PRIMARY KEY,
                macAddress VARCHAR(18),
                level INTEGER,
                location VARCHAR(50),
                battery INTEGER,
                active BOOLEAN
            )
        `);
    });
}

export function deleteCards(confirm){

    if(!confirm){
        return false;
    }

    return new Promise((res, rej) => {
        db.run("DELETE FROM cards", (err) => {
            if (err) {
                console.log("Error heeft zich opgetreden tijdens deleteCards(): "+err.message);
                rej(false);
            } else {
                console.log("Succesvol alle cards verwijdert uit database.");
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
            } else {}
            resolve(rows);
        })
    })
}

export async function insertCard(Id, card_uuid, booking_Id, token, blocked) {

    try {
        const query = "INSERT INTO cards (Id, card_uuid, booking_Id, token, blocked) VALUES (?,?,?,?,?)";
        return await db.run(query, [Id, card_uuid, booking_Id, token, blocked]);
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
        return await db.run(query, [id]);
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
