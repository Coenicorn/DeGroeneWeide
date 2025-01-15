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

function sendMail() {
    let checked_aankomsttijd = "";
    let checked_notities = "";

    if(aankomsttijd.value == "") {
        checked_aankomsttijd = "onbekend";
    } else {
        checked_aankomsttijd = aankomsttijd.value;
    }

    if(notities.value == ""){
        checked_notities = "Er zijn geen notities mee gegeven.";
    } else {
        checked_notities = notities.value;
    }

    alert(checked_notities);

    location.href=`mailto:BoerBert@gmail.com?subject=Hello&body=Beste Boer Bert, %0D%0A Ik zou graag bij u willen reserveren op de camping, hier is zijn mijn gegevens: %0D%0A Voornaam: ${voornaam.value} %0D%0A Achternaam: ${tussenvoegsel.value} ${achternaam.value} %0D%0A E-mailadres: ${email.value} %0D%0A Telefoonnummer: ${land_code.value} ${telefoonnummer.value} %0D%0A Van ${begin_datum.value} tot ${eind_datum.value} %0D%0A Verwachte aankomsttijd: ${checked_aankomsttijd} %0D%0A Aantal gasten: ${aantal_gasten.value} %0D%0A Type accommodatie: ${accommodatie.value} %0D%0A Notities: ${checked_notities} %0D%0A Fijne dag nog!`

}

