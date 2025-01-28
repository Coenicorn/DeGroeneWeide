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


window.onload = function() {begin_datum.min = new Date().toISOString().split("T")[0]; eind_datum.min = new Date().toISOString().split("T")[0]; if (window.location.host.startsWith("localhost")) mock();}

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
            startDate: new Date(begin_datum.value),
            endDate: new Date(eind_datum.value),
            amountPeople: aantal_gasten.value,
            notes: notities.value,

            captcha: captchaString
        })
    }).then(r => {
        if (r.status === 409) {
            // mail already pending
            document.getElementById("confirmation-duplicate").classList.remove("hidden");
            document.getElementById("confirmation-popup-icon").src = "/img/exclamation-mark.png";
            document.getElementById("close-confirmation-box-button").onclick = () => confirmationContainer.classList.add("hidden");
        } else if (r.status === 200) {
            // nothing wrong
            document.getElementById("confirmation-success").classList.remove("hidden");
            document.getElementById("close-confirmation-box-button").onclick = () => window.location.href = "/";
        } else {
            // server error
            document.getElementById("confirmation-other-error").classList.remove("hidden");
            document.getElementById("confirmation-popup-icon").src = "/img/exclamation-mark.png";
            document.getElementById("close-confirmation-box-button").onclick = () => confirmationContainer.classList.add("hidden");
        }

        confirmationContainer.classList.remove("hidden");
        
        grecaptcha.reset();
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
    if(new Date(begin_datum.value).now < new Date().toISOString().split("T")[0] | new Date(begin_datum.value).now == "") {
        begin_datum.style.border = "2px solid red";
        valid = false;
    }
    if(new Date(eind_datum.value).now < new Date().toISOString().split("T")[0] | new Date(eind_datum.value).now == "") {
        eind_datum.style.border = "2px solid red";
        valid = false;
    }
    if(new Date(begin_datum.value).now > new Date(eind_datum.value).now) {
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
