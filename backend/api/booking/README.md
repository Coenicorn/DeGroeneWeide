# booking API
'read a booking!'
## `POST api/booking/insertBooking` ![img_public](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/public.png?raw=true)
inserts a new booking
## request
```javascript
// request body
{
	"customerId": string | null,
	"startDate": string,
	"endDate": string,
	"amountPeople": number,
}
```
## response
[`201`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully added new booking<br>
## `GET api/booking/getAllBookings` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)
gets all bookings
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) <br>
```javascript
// 200 response body
[
	{
		"id": string,
		"customerId": string | null,
		"startDate": string,
		"endDate": string,
		"amountPeople": number,
		"creationDate": string,
		"firstName": string | null,
		"middleName": string | null,
		"lastName": string | null,
		"maySave": string | null,
		"birthDate": string | null,
		"customerCreationDate": string | null,
		"blacklisted": string | null,
		"phoneNumber": string | null,
		"mailAddress": string | null,
	},
]
```
## `POST api/booking/updateBooking` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)
updates booking values
## request
```javascript
// request body
{
	"id": string,
	"customerId": string | null,
	"startDate": string,
	"endDate": string,
	"amountPeople": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully updated booking<br>
## `POST api/booking/deleteBooking` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)
deletes a single booking
## request
```javascript
// request body
{
	"id": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully deleted booking<br>
