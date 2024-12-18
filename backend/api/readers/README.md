## `POST /imalive`

Lets the server know that a reader is active

## request

```json
{
    "macAddress": string,
    "battery": number // 0-100 in procent
}

```

## responses

#### `200` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses)) 

Responds with the id the server has given the reader

```json
{
  "id": string
}
```

## `GET /getAllReaders`

Request all known readers

## response

```json
[
  {
    "id": string, /* internal reader ID */
    "macAddress": string, /* mac address of the reader */
    "level": number, /* authorization level required */
    "location": string, /* location on premises */
    "battery": number, /* how much battery is left in the reader */
    "active": number, /* if this reader is marked as 'active' by the server */
    "lastUpdate": string /* time and date of last known ping */
  }
]
```

## `POST /getReader`

Request single reader by ID

## request

```json
{
    "id": string
}
```

## response

```json
{
    "id": string, /* internal reader ID */
    "macAddress": string, /* mac address of the reader */
    "level": number, /* authorization level required */
    "location": string, /* location on premises */
    "battery": number, /* how much battery is left in the reader */
    "active": number, /* if this reader is marked as 'active' by the server */
    "lastUpdate": string /* time and date of last known ping */
}
```

## `POST /updateReader`

Update editable fields of a reader in the database.
The only editable fields are listed below

## request

```json
{
  "id": string,
  "name": string | null,
  "amenityId": string | null
}
```

## `GET /getAllAuthLevels`

Gets all auth levels for a single reader

## request

```json
{
  "id": string
}
```

`id`: Reader id

## responses

#### `200` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses)) 

```json
[
  { 
    "id": string,
    "name": string
  },
  ...
]
```