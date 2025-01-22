# readers API
All routes connected with RFID readers
## `POST api/readers/imalive` <span style="background-color:#ad0303; padding: .4em; margin: 0; border-radius: 6px; color:white; font-weight: 700; font-size: .6em;">private</span>
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
## `GET api/readers/getAllReaders` <span style="background-color:#ad0303; padding: .4em; margin: 0; border-radius: 6px; color:white; font-weight: 700; font-size: .6em;">private</span>
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
## `POST api/readers/getReader` <span style="background-color:#ad0303; padding: .4em; margin: 0; border-radius: 6px; color:white; font-weight: 700; font-size: .6em;">private</span>
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
## `POST api/readers/updateReader` <span style="background-color:#ad0303; padding: .4em; margin: 0; border-radius: 6px; color:white; font-weight: 700; font-size: .6em;">private</span>
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
## `POST api/readers/insertReader` <span style="background-color:#ad0303; padding: .4em; margin: 0; border-radius: 6px; color:white; font-weight: 700; font-size: .6em;">private</span>
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
