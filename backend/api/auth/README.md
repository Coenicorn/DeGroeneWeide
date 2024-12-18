# `POST /addAuthLevel`

## request

```json
{
    "name": string
}

```

## responses

#### `200` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses)) 

Responds with the internal ID of the new authLevel

```json
{
    "id": string
}
```

#### `400` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses)) 

```json
{
    "status": "auth level already exists"
}
```

# `POST /updateAuthLevel`

## request

```json
{
    "name": string
}

```

## responses

#### `200` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses)) 

# `POST /deleteAuthLevel`

## request

```json
{
    "id": string
}

```

## responses

#### `400` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses)) 

```json
{
    "status": "auth level does not exist"
}
```
# `GET /getAllAuthLevels`

## responses

#### `200` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses)) 

```json
[
    {
        "id": string,
        "name": string
    }
]
```

# `POST /linkReaderAuth`

## request

```json
{
    "readerId": string,
    "authLevelId": string
}
```

# `POST /linkCardAuth`

## request

```json
{
    "cardId": string,
    "authLevelId": string
}
```

## responses

#### `200` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses))

# `POST /authenticateCard`

## request

```json
{
    "macAddress": string,
    "cardId": string,
    "token": string
}
```

## responses

#### `200` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses))

#### `401` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses))
