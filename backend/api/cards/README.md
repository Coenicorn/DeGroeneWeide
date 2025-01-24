# cards API
all things cards
## `GET api/cards/getAllCards` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
gets all cards
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) <br>
```javascript
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
## `GET api/cards/getAllExtensiveCards` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
gets all cards with additional info, pretty expensive query
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) all cards >_><br>
```javascript
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
## `GET api/cards/getCard` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
gets a single card
## request
at least one value must be defined
```javascript
// request body
{
	"entryId": string | null,
	"card_uuid": string | null,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) <br>
```javascript
// 200 response body
{
	"id": string,
	"bookingId": string | null,
	"token": string | null,
	"blocked": number,
}
```
## `GET api/cards/getCardTokenByCardUuid` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
@tobias
## request
```javascript
// request body
{
	"card_uuid": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) same as /getCard<br>
## `POST api/cards/insertCard` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
inserts a card into the db
## request
```javascript
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
## `POST api/cards/deleteAllCards` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
deletes ALL cards
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully removed all cards x_x<br>
## `POST api/cards/removeCardByCardUuid` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
NOT FINISHED @tobias
## request
```javascript
// request body
{
	"card_uuid": string,
}
```
## `POST api/cards/removeCardByBookingId` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
@tobias
## request
```javascript
// request body
{
	"booking_id": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully removed card<br>
## `POST api/cards/removeCardByEntryId` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
@tobias
## request
```javascript
// request body
{
	"entryId": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully removed card<br>
## `POST api/cards/updateCard` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
updates card values. MIGHT BE OUTDATED!
## request
```javascript
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
## `POST api/cards/setNewestCardToWrite` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
NOT TESTED, I DON'T KNOW WHAT THE FUCK THIS DOES 0_o
## request
```javascript
// request body
{
	"card": {
		"id": string,
	},
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully set newest card to write<br>
## `GET api/cards/getNewestCardToWrite` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
NOT TESTED, I AGAIN DON'T KNOW WHAT THIS DOES!!!!
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) <br>
```javascript
// 200 response body
{
	"card": string // latest scanned card ID,
}
```
## `POST api/cards/getAllAuthLevels` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
gets all auth levels of this card
## request
```javascript
// request body
{
	"id": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) id is an authlevel's id, name is an authlevel's name, etc.<br>
```javascript
// 200 response body
[
	{
		"id": string,
		"name": string,
	},
]
```
## `POST api/cards/updateCardToken` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
updates the token of a single card
## request
```javascript
// request body
{
	"cardId": string,
	"token": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully updated token<br>
