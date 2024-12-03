### `GET /api/cards/getAllCards`
Verkrijgt alle kaarten in JSON-indeling.

#### Responses

- **`200 OK`**
    ```json
    [
        {
            "id": TEXT,
            "card_uuid": VARCHAR(16),
            "booking_Id": TEXT,
            "token": VARCHAR(256),
            "blocked": BOOLEAN
        },
        ...
    ]
    ```

- **`500 Internal Server Error`**
    ```json
    "Sorry! Er heeft een interne fout opgetreden."
    ```

---

### `GET /api/cards/getCard`
Verkrijgt een specifieke kaart op basis van `entryId` of `card_uuid`.

#### Request Body
- **Optioneel**: één van de volgende velden moet aanwezig zijn:
    ```json
    {
        "entryId": "INTEGER HIER",
        "card_uuid": "UUID HIER"
    }
    ```

#### Responses
- **`200 OK`** (kaart gevonden)
    ```json
    {
        "bericht": "Kaart gevonden door entry id",
        "resultaat": {
            "id": TEXT,
            "card_uuid": VARCHAR(16),
            "booking_Id": TEXT,
            "token": VARCHAR(256),
            "blocked": BOOLEAN
        }
    }
    ```

- **`404 Not Found`**
    ```json
    "Niks gevonden. Weet je zeker dat je `entryId` of `card_uuid` hebt opgegeven?"
    ```

- **`400 Bad Request`**
    ```json
    "Er mist informatie om de kaart op te halen: <error>"
    ```

---

### `GET /api/cards/getCardTokenByCardUuid`
Haalt een token op van een kaart met behulp van `card_uuid`.

#### Request Body
- **Vereist**:
    ```json
    {
        "card_uuid": "UUID HIER"
    }
    ```

#### Responses
- **`200 OK`**
    ```json
    {
        "bericht": "Token gevonden door card_uuid",
        "resultaat": "TOKEN HIER"
    }
    ```

- **`400 Bad Request`**
    ```json
    "Card_uuid is vereiste."
    ```

- **`500 Internal Server Error`**
    ```json
    "Er is iets mis gegaan tijdens het ophalen van de token."
    ```

---

### `POST /api/cards/insertCard`
Voegt een nieuwe kaart toe aan de database.

#### Request Body
- **Vereist**:
    ```json
    {
        "id": "ID",
        "card_uuid": "CARD UUID HIER",
        "booking_Id": "BOOKING ID HIER",
        "token": "randomToken",
        "blocked": "false"
    }
    ```

#### Responses
- **`201 Created`**
    ```json
    {
        "bericht": "Kaart successvol toegevoegd",
        "resultaat": "DETAILS OVER TOEGEVOEGDE KAART"
    }
    ```

- **`400 Bad Request`**
    ```json
    "Gegeven data is niet in het correcte format."
    ```

- **`500 Internal Server Error`**
    ```json
    "Er is iets fout gegaan tijdens het toevoegen van de kaart."
    ```

---

### `POST /api/cards/deleteAllCards`
Verwijdert alle kaarten in de database.

#### Request Body
- **Vereist**:
    ```json
    {
        "confirm": true
    }
    ```

#### Responses
- **`200 OK`**
    ```json
    {
        "bericht": "Alle kaarten zijn verwijderd.",
        "resultaat": null
    }
    ```

- **`400 Bad Request`**
    ```json
    "Een confirmatie is vereist bij het verwijderen van alle kaarten."
    ```

- **`500 Internal Server Error`**
    ```json
    "Er is iets fout gegaan tijdens het verwijderen van alle kaarten."
    ```

---

### `POST /api/cards/removeCardByCardUuid`
Verwijdert een kaart op basis van `card_uuid`.

#### Request Body
- **Vereist**:
    ```json
    {
        "card_uuid": "CARD UUID HIER"
    }
    ```

#### Responses
- **`200 OK`**
    ```json
    {
        "bericht": "Kaart is verwijderd",
        "resultaat": null
    }
    ```

- **`400 Bad Request`**
    ```json
    "Card_UUID is vereiste."
    ```

---

### `POST /api/cards/removeCardByBookingId`
Verwijdert een kaart op basis van `booking_id`.

#### Request Body
- **Vereist**:
    ```json
    {
        "booking_id": "BOOKING ID HIER"
    }
    ```

#### Responses
- **`200 OK`**
    ```json
    {
        "bericht": "Kaart is verwijderd",
        "resultaat": null
    }
    ```

- **`400 Bad Request`**
    ```json
    "Booking ID is vereiste."
    ```

---

### `POST /api/cards/removeCardByEntryId`
Verwijdert een kaart op basis van `entryId`.

#### Request Body
- **Vereist**:
    ```json
    {
        "entryId": "ID HIER"
    }
    ```

#### Responses
- **`200 OK`**
    ```json
    {
        "bericht": "Kaart is verwijderd",
        "resultaat": null
    }
    ```

- **`400 Bad Request`**
    ```json
    "EntryId is vereiste."
    ```
