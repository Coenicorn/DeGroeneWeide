const voornaam = document.getElementById('voornaam');
const tussenvoegsel = document.getElementById('tussenvoegsel');
const achternaam = document.getElementById('achternaam');
const email = document.getElementById('email');
const land_code = document.getElementById('land_code');
const telefoonnummer = document.getElementById('telefoonnummer');
const begin_datum = document.getElementById('startDate');
const eind_datum = document.getElementById('endDate');
const aankomsttijd = document.getElementById('aankomsttijd');
const aantal_gasten = document.getElementById('amountGuests');
const accommodatie = document.getElementById('typeAccommodatie');
const notities = document.getElementById('note');
let customer_id = "";

function sendMail() {
    let checked_aankomsttijd = "";
    let checked_notities = "";

    if(aankomsttijd.value === "") {
        checked_aankomsttijd = "onbekend";
    } else {
        checked_aankomsttijd = aankomsttijd.value;
    }

    if(notities.value === ""){
        checked_notities = "Er zijn geen notities mee gegeven.";
    } else {
        checked_notities = notities.value;
    }

    //location.href=`mailto:shocomellow.boerbert@gmail.com?subject=Reservatie aanvraag camping de Groene Weide&body=Beste Boer Bert, %0D%0A %0D%0A  Ik zou graag bij u willen reserveren op de camping, hier zijn mijn gegevens: %0D%0A %0D%0A Voornaam: ${voornaam.value} %0D%0A Achternaam: ${tussenvoegsel.value} ${achternaam.value} %0D%0A E-mailadres: ${email.value} %0D%0A Telefoonnummer: ${land_code.value} ${telefoonnummer.value} %0D%0A Van ${begin_datum.value} tot ${eind_datum.value} %0D%0A Verwachte aankomsttijd: ${checked_aankomsttijd} %0D%0A Aantal gasten: ${aantal_gasten.value} %0D%0A Type accommodatie: ${accommodatie.value} %0D%0A Notities: ${checked_notities} %0D%0A %0D%0A Fijne dag nog!`

    fetch("http://localhost:3001/api/customers/insertCustomer", {
        method: "POST",
        body: JSON.stringify({
            firstName: voornaam.value,
            lastName: tussenvoegsel.value + " " + achternaam.value,
            mailAddress: email.value,
            phoneNumber: land_code.value + telefoonnummer.value,
            blacklisted: 0,
            birthDate: new Date(),
            maySave: 1
        }),
        headers: {
            "Content-Type": "application/json"
        }

    }).then(r => {
        console.log("success customer aangemaakt");
        return r.json();
    }).then((data) => {
        customer_id = data.customerId;
        console.log(customer_id);
        console.log(typeof(customer_id));
        insertBooking()
    })
}

function insertBooking() {
    fetch("http://localhost:3001/api/booking/insertBooking", {
        method: "POST",
        body: JSON.stringify({
            customerId: customer_id,
            startDate: begin_datum.value,
            endDate: eind_datum.value,
            amountPeople: aantal_gasten.value
        }),
        headers: {
            "Content-type": "application/json"
        }
    }).then(r => {
        console.log("success booking toegevoegd");
        return r.json();
    })
}

