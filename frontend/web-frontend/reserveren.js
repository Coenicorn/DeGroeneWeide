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
const confirmButton = document.getElementById("confirm-btn");
const confirmationContainer = document.getElementById("confirmation-wrapper");
let customer_id = "";


function mock() {
    if (!window.location.host.startsWith("localhost")) return;
    let te = document.createElement("div");
    te.style.color = "blue";
    te.innerText = "[DEV] test waardes toegevoegd";
    document.getElementById("forum-title").appendChild(te);
    voornaam.value = "John";
    tussenvoegsel.value = "J.";
    achternaam.value = "Doe";
    email.value = "shocomellow.boerbert@gmail.com";
    land_code.value = "31";
    telefoonnummer.value = "0612345678";

    let d1 = new Date(), d2 = new Date();
    d2.setDate(d1.getDate() + 1);

    begin_datum.value = d1.toISOString().split("T")[0];
    eind_datum.value = d2.toISOString().split("T")[0];

    aankomsttijd.value = "06:09";
    aantal_gasten.value = 1;
    accommodatie.children[1].setAttribute("selected", true);
    notities.innerText = "Lorem ipsum dolor sit amet";
}


window.onload = function() {begin_datum.min = new Date().toISOString().split("T")[0]; eind_datum.min = new Date().toISOString().split("T")[0]; mock()}

function getDate(){
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '-' + mm + '-' + yyyy;
    return formattedToday;
}

function reserve(captchaString) {

    if(!validity_check()) return;
    
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

    fetch("/api/send-reservation", {
    method: "POST",
    headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName: voornaam.value,
            lastName: tussenvoegsel.value + " " + achternaam.value,
            mailAddress: email.value,
            phoneNumber: land_code.value + telefoonnummer.value,
            blacklisted: 0,
            birthDate: new Date(),
            maySave: 1,
            startDate: begin_datum.value,
            endDate: eind_datum.value,
            amountPeople: aantal_gasten.value,
            notes: notities.value,

            captcha: captchaString
        })
    }).then(r => {
        // console.log("reservering verstuurd");
    })
}

function validity_check() {
    resetBorders();
    let valid = "true";
    if(voornaam.value.trim() == "") {
        voornaam.style.border = "2px solid red";
        valid = false;
    }
    if(achternaam.value.trim() == "") {
        achternaam.style.border = "2px solid red";
        valid = false;
    }
    if(email.value.trim() == "" | email.value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == false){
        email.style.border = "2px solid red";
        valid = false;
    }
    if(land_code.value.trim() == "") {
        land_code.style.border = "2px solid red";
        valid = false;
    }
    if(telefoonnummer.value.trim() == "" | telefoonnummer.value.trim().length != 10) {
        telefoonnummer.style.border = "2px solid red";
        valid = false;
    }
    if(begin_datum.value < new Date().toISOString().split("T")[0] | begin_datum.value.trim() == "") {
        begin_datum.style.border = "2px solid red";
        valid = false;
    }
    if(eind_datum.value < new Date().toISOString().split("T")[0] | eind_datum.value.trim() == "") {
        eind_datum.style.border = "2px solid red";
        valid = false;
    }
    if(begin_datum.value > eind_datum.value) {
        eind_datum.style.border = "2px solid red";
        valid = false;
    }
    if(aantal_gasten.value.trim() == "" | aantal_gasten.value.trim() < 1){
        aantal_gasten.style.border = "2px solid red";
        valid = false;
    }
    if(accommodatie.value == "default") {
        accommodatie.style.border = "2px solid red";
        valid = false;
    }

    if(valid){
        confirmationContainer.classList.remove("hidden");
        return true;
    }
    return false;
}

function resetBorders(){
    voornaam.style.border = "2px solid white";
    achternaam.style.border = "2px solid white";
    email.style.border = "2px solid white";
    land_code.style.border = "2px solid white";
    telefoonnummer.style.border = "2px solid white";
    begin_datum.style.border = "2px solid white";
    eind_datum.style.border = "2px solid white";
    aantal_gasten.style.border = "2px solid border";
    accommodatie.style.border = "2px solid border";
}