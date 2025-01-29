const voornaam = document.getElementById('voornaam');
const achternaam = document.getElementById('achternaam');
const email = document.getElementById('email');
const telefoonnummer = document.getElementById('telefoonnummer');
const begin_datum = document.getElementById('startDate');
const eind_datum = document.getElementById('endDate');
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
    achternaam.value = "Doe";
    email.value = "shocomellow.boerbert@gmail.com";
    telefoonnummer.value = "12345678";

    let d1 = new Date(), d2 = new Date();
    d2.setDate(d1.getDate() + 1);

    // begin_datum.value = d1.toISOString().split("T")[0];
    begin_datum.value = "test";
    eind_datum.value = d2.toISOString().split("T")[0];

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
    fetch("/api/send-reservation", {
    method: "POST",
    headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName: voornaam.value,
            lastName: achternaam.value,
            mailAddress: email.value,
            phoneNumber: telefoonnummer.value,
            startDate: new Date(begin_datum.value),
            endDate: new Date(eind_datum.value),
            amountPeople: Number(aantal_gasten.value),
            notes: notities.value,

            captcha: captchaString
        })
    })
    .then(r => r.json())
    .then(r => {

        const mvn = r.mvn;
        console.log(mvn);
        return;




        function showPopup(id, isError = false) {
            const elm = document.getElementById(id);
            elm.classList.remove("hidden");
            if (isError) document.getElementById("confirmation-popup-icon").src = "/img/exclamation-mark.png";
            document.getElementById("close-confirmation-box-button").onclick = () => confirmationContainer.classList.add("hidden");
            confirmationContainer.classList.remove("hidden");
        }

        const responseStatus = r.status;

        switch (r.status) {
            case "duplicate": showPopup("confirmation-duplicate"); break;
            case "success": showPopup("confirmation-success"); break;
            case "toomany": showPopup("confirmation-too-many", true); break;
            default: showPopup("confirmation-other-error", true); break;
        }

        grecaptcha.reset();
    })
}