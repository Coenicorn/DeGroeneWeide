# readers API
All routes connected with RFID readers
## `POST api/readers/imalive`
used by RFID readers to signal they're up and running
## request
```json
// request body
{
	"macAddress": string,
	"battery": number,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesful request<br>
[`201`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) new rfid reader created<br>
## `GET api/readers/getAllReaders`
...gets all readers
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) <br>
```json
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
## `POST api/readers/getReader`
gets a single reader
## request
```json
// request body
{
	"id": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) retrieved reader<br>
```json
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
## `POST api/readers/updateReader`
updates all values of a reader
## request
```json
// request body
{
	"id": string,
	"name": string,
	"amenityId": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) OK<br>
## `POST api/readers/insertReader`
inserts a new reader (NEVER USE THIS I DON'T KNOW WHY IT'S HERE)
## request
```json
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
