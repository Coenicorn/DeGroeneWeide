# API root
root API routes
## `GET api/browse` ![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
development helper to quickly view the current database as JSON. Meant for use in webbrowser on http(s)://[HOST]/api/browse
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) json view of the current database<br>
## `POST api/send-reservation` ![img_public](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/public.png?raw=true)[what](https://github.com/Coenicorn/DeGroeneWeide/blob/conformation-mail/backend/api/DOCS.md)
send a temporary reservation from the frontend to the backend. Needs to be confirmed by email
## request
```javascript
// request body
{
	"firstName": string,
	"lastName": string,
	"mailAddress": string,
	"phoneNumber": string,
	"blacklisted": number,
	"birthDate": string,
	"maySave": number,
	"startDate": string,
	"endDate": string,
	"amountPeople": string,
}
```
## response
[`200`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) successfully added temporary reservation. A link has been sent to the mailaddress entered in the request, when the link isn't clicked withint 10 minutes the temporary reservation gets deleted!<br>
