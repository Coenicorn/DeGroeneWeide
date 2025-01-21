# `POST /insertBooking`

## request
```json
{
    "customerId": string | null,
    "startDate": string,
    "endDate": string,
    "amountPeople": number
}
```

# `GET /getAllBookings`

## response
```json
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
    "blacklisted": string | null,
    "phoneNumber": string | null,
    "mailAddress": string | null
  }
]
```