# API Documentation template

Copy this documentation template and alter it to your needs.

## note

When writing the description of json values, or any list of values in general, it is necessary to append `\`(backslash) to the end of the line, to ensure the next line ACTUALLY starts on a new line.

documentation template starts here (don't copy the `br`'s):

<br>
<br>

# `HTTP_METHOD /someAPIRoute`

Change this to a description of the route

## request

```json
{
    "someValue": type,
    ...
}

```

`someValue`: Change this to a description of this value

## responses

#### `200_CHANGEME` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)) 

```json
{
    "someResponseValue": type,
    "someOtherResponseValue": type,
    ...
}
```

`someResponseValue`: Change this to a description of this value\
`someOtherResponseValue`: Change this to a description of this value

#### `400_CHANGEME` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)) 

```json
{
    "someStatusMessage": string,
    ...
}
```

`someStatusMessage`: Change this to a description of this value


# EXAMPLE, DO NOT COPY

# `GET /getAllProducts`

Requests all known products

## request

```json
{
    "include_old_products": number,
}

```

`include_old_products`: If this value is `1`, the server will also include products that aren't sold anymore in the response

## responses

#### `200` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)) 

```json
{
    "products": [
        {
            "name": string,
            "price": number
        }
    ]
}
```

`name`: The name of the product\
`price`: The price of the product

#### `400` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)) 

```json
{
    "status": string
}
```

`status`: Error status