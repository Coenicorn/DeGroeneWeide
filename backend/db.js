import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'feeds.db');
const db = new sqlite3.Database(dbPath);

function initializeDB(){
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            Id TEXT PRIMARY KEY, 
            customer_Id INTEGER, 
            duePayments INTEGER,
            startDate DATETIME,
            endDate DATETIME,
            amountChildren SMALLINT,
            amountAdults SMALLINT,
            expectedArrival TIME,
            FOREIGN KEY (customer_Id) REFERENCES Customers(Id)
        `)
    })}
