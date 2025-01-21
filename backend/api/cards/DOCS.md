# cards API
all things cards
## `GET api/cards/getAllCards`
gets all cards
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) <br>
```json
// 200 response body
[
	{
		"id": string,
		"bookingId": string | null,
		"token": string | null,
		"blocked": number,
	},
]
```
## `GET api/cards/getAllExtensiveCards`
gets all cards with additional info, pretty expensive query
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) all cards >_><br>
```json
// 200 response body
[
	{
		"id": string,
		"bookingId": string | null,
		"token": string,
		"blocked": number,
		"customerId": string | null,
		"startDate": string | null,
		"endDate": string | null,
		"amountPeople": number | null,
		"creationDate": string | null,
		"authLevelId": string | null,
		"authLevelName": string | null,
	},
]
```
## `GET api/cards/getCard`
gets a single card
## request
at least one value must be defined
```json
// request body
{
	"entryId": string | null,
	"card_uuid": string | null,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) <br>
```json
// 200 response body
{
	"id": string,
	"bookingId": string | null,
	"token": string | null,
	"blocked": number,
}
```
## `GET api/cards/getCardTokenByCardUuid`
@tobias
## request
```json
// request body
{
	"card_uuid": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) same as /getCard<br>
## `POST api/cards/insertCard`
inserts a card into the db
## request
```json
// request body
{
	"uuid": string,
	"blocked": string,
	"token": string,
	"booking_id": string | null,
}
```
## response
[`201`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully added card<br>
## `POST api/cards/deleteAllCards`
deletes ALL cards
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully removed all cards x_x<br>
## `POST api/cards/removeCardByCardUuid`
NOT FINISHED @tobias
## request
```json
// request body
{
	"card_uuid": string,
}
```
## `POST api/cards/removeCardByBookingId`
@tobias
## request
```json
// request body
{
	"booking_id": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully removed card<br>
## `POST api/cards/removeCardByEntryId`
@tobias
## request
```json
// request body
{
	"entryId": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully removed card<br>
## `POST api/cards/updateCard`
updates card values. MIGHT BE OUTDATED!
## request
```json
// request body
{
	"card": {
		"id": string,
		"card_uuid": string,
		"booking_id": string,
		"token": string,
		"level": string,
		"blocked": string,
	},
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully updated card<br>
## `POST api/cards/setNewestCardToWrite`
NOT TESTED, I DON'T KNOW WHAT THE FUCK THIS DOES 0_o
## request
```json
// request body
{
	"card": {
		"id": string,
	},
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully set newest card to write<br>
## `GET api/cards/getNewestCardToWrite`
NOT TESTED, I AGAIN DON'T KNOW WHAT THIS DOES!!!!
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) <br>
```json
// 200 response body
{
	"card": string // latest scanned card ID,
}
```
## `POST api/cards/getAllAuthLevels`
gets all auth levels of this card
## request
```json
// request body
{
	"id": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) id is an authlevel's id, name is an authlevel's name, etc.<br>
```json
// 200 response body
[
	{
		"id": string,
		"name": string,
	},
]
```
## `POST api/cards/updateCardToken`
updates the token of a single card
## request
```json
// request body
{
	"cardId": string,
	"token": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully updated token<br>
