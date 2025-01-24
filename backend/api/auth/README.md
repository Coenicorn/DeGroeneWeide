# authentication API
(hacking the mainframe)
## `POST api/auth/addAuthLevel` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sub><sup>?</sup></sub>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
adds a new auth level
## request
```javascript
// request body
{
	"name": string,
}
```
## response
[`201`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully added auth level<br>
## `POST api/auth/updateAuthLevel` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sub><sup>?</sup></sub>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
updates authLevel values
## request
```javascript
// request body
{
	"id": string,
	"name": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully updated auth level<br>
## `POST api/auth/deleteAuthLevel` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sub><sup>?</sup></sub>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
deletes an auth level
## request
```javascript
// request body
{
	"id": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully deleted authLevel<br>
## `GET api/auth/getAllAuthLevels` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sub><sup>?</sup></sub>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
gets ALL auth levels
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) [object Object]<br>
## `POST api/auth/linkReaderAuth` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sub><sup>?</sup></sub>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
links a reader to an authentication level
## request
```javascript
// request body
{
	"readerId": string,
	"authLevelId": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully linked reader to auth level<br>
## `POST api/auth/unlinkReaderAuth` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sub><sup>?</sup></sub>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
removes an auth level from a reader
## request
```javascript
// request body
{
	"readerId": string,
	"authLevelId": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully removed auth level from reader<br>
## `POST api/auth/linkCardAuth` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sub><sup>?</sup></sub>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
links an auth level to a card
## request
```javascript
// request body
{
	"authLevelId": string,
	"cardId": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully linked an auth level to a card<br>
## `POST api/auth/unlinkCardAuth` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sub><sup>?</sup></sub>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
removes an auth level from a card
## request
```javascript
// request body
{
	"authLevelId": string,
	"cardId": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully removed an auth level from a card<br>
## `POST api/auth/authenticateCard` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sub><sup>?</sup></sub>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
tries to authenticate a card at a reader
## request
```javascript
// request body
{
	"cardId": string,
	"cardToken": string,
	"macAddress": string // gets hashed to internal reader ID,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) access granted!<br>
[`401`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) failed to authenticate<br>
