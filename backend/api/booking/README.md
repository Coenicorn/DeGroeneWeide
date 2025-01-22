# booking API
'read a booking!'
## `POST api/booking/insertBooking`
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
## `GET api/booking/getAllBookings`
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
## `POST api/booking/updateBooking`
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
## `POST api/booking/deleteBooking`
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