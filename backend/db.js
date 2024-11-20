import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'feeds.db');
const db = new sqlite3.Database(dbPath);

function initializeDB() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS customers (
                Id TEXT PRIMARY KEY,
                firstName VARCHAR(100),
                middleName VARCHAR(10),
                lastName VARCHAR(100),
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
                amountChildren SMALLINT,
                amountAdults SMALLINT,
                expectedArrival TIME,
                FOREIGN KEY (customer_Id) REFERENCES customers (Id)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS cards (
                Id TEXT PRIMARY KEY,
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
    });
}
