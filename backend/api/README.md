# API documentation

This API is quite simple, and does (for now) not use any form of authentication.

Per route, a documentation document is provided following the layout of `README.doc_template.md`.

## Writing documentation

Every documentation file takes the form of a `README.md` file. Each folder containing `.js` files implementing API routes holds only 1 `README.md`. This `README.md` documents **only** the routes implemented in files directly in its folder.

Should a route-implementing file reside in a subfolder (i.e. `/api/cards/guestCards/index.js`), then the documentation for that route must be in the subfolder (in this case `/api/cards/guestCards/README.md`), and thus not be documented in the parent folder (in this case `/api/cards`).

## Global request requirements

Deze API verwacht dat alle requests de `Content-Type` header naar `application/json` zetten. Return code `400` als dit niet zo is

## Global responses

Every route in this application might respond with:

#### `500` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses)) 

```json
{
    "status": "something went wrong"
}
```

We're not bad at writing code, we're *learning*

## Route paths

Whenever a `README.md` mentions a route (i.e. `/getAllReaders`), it is referring to the full directory as a route (`/api/readers/getAllReaders`), which is of course prepended by the host (i.e. `www.thiswebsiteissoawesome.com/api/readers/getAllReaders`).