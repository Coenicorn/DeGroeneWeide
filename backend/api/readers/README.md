# readers API
All routes connected with RFID readers
## `POST api/readers/imalive` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sup>what</sup>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
used by RFID readers to signal they're up and running
## request
```javascript
// request body
{
	"macAddress": string,
	"battery": number,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesful request<br>
[`201`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) new rfid reader created<br>
## `GET api/readers/getAllReaders` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sup>what</sup>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
...gets all readers
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) <br>
```javascript
// 200 response body
{
	"id": string,
	"batteryPercentage": number,
	"amenityId": string | null,
	"lastPing": string,
	"name": string,
	"active": number,
}
```
## `POST api/readers/getReader` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sup>what</sup>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
gets a single reader
## request
```javascript
// request body
{
	"id": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) retrieved reader<br>
```javascript
// 200 response body
{
	"id": string,
	"batteryPercentage": number,
	"amenityId": string | null,
	"lastPing": string,
	"name": string,
	"active": number,
}
```
## `POST api/readers/updateReader` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sup>what</sup>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
updates all values of a reader
## request
```javascript
// request body
{
	"id": string,
	"name": string,
	"amenityId": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) OK<br>
## `POST api/readers/insertReader` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[<sup>what</sup>](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
inserts a new reader (NEVER USE THIS I DON'T KNOW WHY IT'S HERE)
## request
```javascript
// request body
{
	"id": string,
	"name": string,
	"active": number,
	"amenityId": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) OK<br>
