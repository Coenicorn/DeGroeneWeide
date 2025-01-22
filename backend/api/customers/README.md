# customers API
everything customers
## `GET api/customers/getAllCustomers` <span style="background-color:#ad0303; padding: .4em; margin: 0; border-radius: 6px; color:white; font-weight: 700; font-size: .6em;">private</span>
title says it all
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) NOT TESTED<br>
```javascript
// 200 response body
[
	{
		"id": string,
		"firstName": string,
		"middleName": string,
		"lastName": string,
		"maySave": number,
		"birthDate": string,
		"creationDate": string,
		"blacklisted": string,
		"phoneNumber": string,
		"mailAddress": string,
	},
]
```
## `POST api/customers/insertCustomer` <span style="background-color:#386e0f; padding: .4em; margin: 0; border-radius: 6px; color:white; font-weight: 700; font-size: .6em;">public</span>
inserts a single customer
## request
NOT TESTED
```javascript
// request body
{
	"firstName": string,
	"middleName": string,
	"lastName": string,
	"maySave": number,
	"birthDate": string,
	"blacklisted": string,
	"phoneNumber": string,
	"mailAddress": string,
}
```
## response
[`201`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) succesfully added customer<br>
```javascript
// 201 response body
{
	"customerId": string,
}
```
