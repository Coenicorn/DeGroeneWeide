# API documentation

This API is quite simple, and does (for now) not use any form of authentication.

Per route, a documentation document is provided following the layout of `README.doc_template.md`.

## Writing documentation

Every documentation file takes the form of a `README.md` file. Each folder containing `.js` files implementing API routes holds only 1 `README.md`. This `README.md` documents **only** the routes implemented in files directly in its folder.

Should a route-implementing file reside in a subfolder (i.e. `/api/cards/guestCards/index.js`), then the documentation for that route must be in the subfolder (in this case `/api/cards/guestCards/README.md`), and thus not be documented in the parent folder (in this case `/api/cards`).