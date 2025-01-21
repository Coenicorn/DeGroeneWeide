# API documentation

THIS DOCUMENTATION IS IN ENGLISH, SO PLEASE WRITE YOUR DOCUMENTATION IN ENGLISH THANK YOU VERY MUCH

This API is quite simple, and does (for now) not use any form of authentication. This is because the view of the network currently doesn't have any external entities connecting to the internal network, so authentication is not necessary.

Routes are split up into folders. Every folder has a documentation file, `README.md`, according to the layout of `README.doc_template.md`.

## Writing documentation

Every documentation file takes the form of a `README.md` file. Each folder containing files implementing API routes holds only 1 `README.md`. This `README.md` documents **only** the routes implemented in files directly in its folder.

Should a route-implementing file reside in a subfolder (i.e. `/api/cards/guestCards/index.js`), then the documentation for that route must be in the subfolder (in this case `/api/cards/guestCards/README.md`), and thus **not** be documented in the parent folder (in this case `/api/cards`).

### Route paths

Whenever a `README.md` mentions a route (i.e. `/getAllReaders`), it is referring to the full directory as a route (`/api/readers/getAllReaders`), which is of course prepended by the host (i.e. `www.host.com/api/readers/getAllReaders`).

An important exception to this rule is `./generic/`, which lives at the root of the api (`www.host.com/api/`). A route `testRoute` defined in the `generic` folder can thus be accessed through `www.host.com/api/testRoute`.

## Global request requirements

Every request in this API **must** contain the header`Accept: application/json`. This is true for all request methods
If a `body` is defined in the request (i.e. a `POST` request), the request **must** contain the header `Content-Type: application/json`.

Naturally, each request must not only implement but follow these rules. This means that a request with `Content-Type: application/json` can not `POST` an html document.

If any of these criteria fail, the server will respond with a code `400` and a status message.

## Server failure response

Every route in this application might respond with code `500` ([response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses)) 

We're not bad at writing code, we're *learning*