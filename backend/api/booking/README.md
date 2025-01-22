# booking API
'read a booking!'
## `POST api/booking/insertBooking` <span style="background-color:#ad0303; padding: .4em; margin: 0; border-radius: 6px; color:white; font-weight: 700; font-size: .6em;">private</span>
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
## `GET api/booking/getAllBookings` <span style="background-color:#ad0303; padding: .4em; margin: 0; border-radius: 6px; color:white; font-weight: 700; font-size: .6em;">private</span>
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
## `POST api/booking/updateBooking` <span style="background-color:#ad0303; padding: .4em; margin: 0; border-radius: 6px; color:white; font-weight: 700; font-size: .6em;">private</span>
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
## `POST api/booking/deleteBooking` <span style="background-color:#ad0303; padding: .4em; margin: 0; border-radius: 6px; color:white; font-weight: 700; font-size: .6em;">private</span>
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
