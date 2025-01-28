-- initializes the default state of the database
-- creates tables etc.

-- google told me this was good to do
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS Customers (
    id TEXT PRIMARY KEY NOT NULL,
    firstName TEXT NOT NULL,
    middleName TEXT,
    lastName TEXT NOT NULL,

    -- currently not used
    maySave BOOLEAN,
    
    birthDate TEXT,
    creationDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    blacklisted BOOLEAN,
    phoneNumber TEXT NOT NULL,
    mailAddress TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Bookings (
    id TEXT PRIMARY KEY NOT NULL,
    customerId TEXT, 
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    amountPeople INT NOT NULL,
    creationDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NOT NULL DEFAULT "",
    confirmed NUMBER NOT NULL DEFAULT 0,
    FOREIGN KEY (customerId) REFERENCES Customers (id)
);

CREATE TABLE IF NOT EXISTS TempReservations (
    id TEXT PRIMARY KEY NOT NULL,
    firstName TEXT,
    lastName TEXT,
    mailAddress TEXT NOT NULL,
    phoneNumber TEXT,
    blacklisted INT,
    birthDate DATETIME,
    maySave INT,
    startDate DATETIME,
    endDate DATETIME,
    amountPeople INT,
    dateReservationSent DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS Payments (
    id TEXT PRIMARY KEY NOT NULL,
    bookingId TEXT NOT NULL,
    amount INT NOT NULL,
    hasPaid BOOLEAN NOT NULL,
    note TEXT,
    FOREIGN KEY (bookingId) REFERENCES Bookings (id)
);

-- id is the uuid on the card
CREATE TABLE IF NOT EXISTS Cards (
    id TEXT PRIMARY KEY NOT NULL,
    bookingId TEXT,
    token TEXT,
    blocked BOOLEAN NOT NULL,
    timeLastUpdate DATETIME NOT NULL,
    FOREIGN KEY (bookingId) REFERENCES Bookings (id)
);

CREATE TABLE IF NOT EXISTS AuthLevels (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS AmenityTypes (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);

-- id is currently the md5 hash of a reader's mac address
-- amenityId can be null for when a reader is first initialized
CREATE TABLE IF NOT EXISTS Readers (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    batteryPercentage INT,
    amenityId TEXT,
    lastPing DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    active BOOLEAN,
    FOREIGN KEY (amenityId) REFERENCES AmenityTypes (id)
);

CREATE TABLE IF NOT EXISTS CardAuthJunctions (
    cardId TEXT NOT NULL,
    authLevelId TEXT NOT NULL,
    PRIMARY KEY (cardId, authLevelId),
    FOREIGN KEY (cardId) REFERENCES Cards (id) ON DELETE CASCADE,
    FOREIGN KEY (authLevelId) REFERENCES AuthLevels (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ReaderAuthJunctions (
    readerId TEXT NOT NULL,
    authLevelId TEXT NOT NULL,
    UNIQUE (readerId, authLevelId),
    FOREIGN KEY (readerId) REFERENCES Readers (id) ON DELETE CASCADE,
    FOREIGN KEY (authLevelId) REFERENCES AuthLevels (id) ON DELETE CASCADE
);

-- surfaceArea wordt nu niet gebruikt, idk waarom we die nu hebben
CREATE TABLE IF NOT EXISTS ShelterTypes (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    surfaceArea INT NOT NULL
);

CREATE TABLE IF NOT EXISTS ShelterBookingJunctions (
    shelterId TEXT NOT NULL,
    bookingId TEXT NOT NULL,
    FOREIGN KEY (shelterId) REFERENCES ShelterTypes (id),
    FOREIGN KEY (bookingId) REFERENCES Bookings (id)
);

-- triggers

CREATE TRIGGER IF NOT EXISTS updateLastPingOnInsert
AFTER INSERT ON Readers
FOR EACH ROW
BEGIN
    UPDATE Readers
    SET lastPing = strftime('%s', 'now')
    WHERE rowid = new.rowid;
END;

CREATE TRIGGER IF NOT EXISTS updateLastPingOnUpdate
AFTER UPDATE ON Readers
FOR EACH ROW
BEGIN
    UPDATE Readers
    SET lastPing = strftime('%s', 'now')
    WHERE rowid = new.rowid;
END;

COMMIT;
