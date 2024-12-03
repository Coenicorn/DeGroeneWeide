## `POST /imalive`

Laat de server weten dat een lezer actief is

## request

```json
{
    "macAddress": string,
    "battery": number // 0-100
}

```

## responses

#### `200` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses))

## `GET /getAllReaders`

Request all known readers

## response

#### `200` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses))
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

## `GET /getReader`

Request single reader by ID

## request

```json
{
    "id": string
}
```

## response

#### `200` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses))

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