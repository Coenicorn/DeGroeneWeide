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

function rstBorder(elm) {
    elm.style.border = "";
    // try and remove error codes
    try {
        let c = elm.parentElement.getElementsByClassName("errnote");
        for (let e of c) {
            elm.parentElement.removeChild(e);
        }
    } catch(e) {}
}

voornaam.onchange = () => rstBorder(voornaam)
achternaam.onchange = () => rstBorder(achternaam)
email.onchange = () => rstBorder(email)
notities.onchange = () => rstBorder(notities)
begin_datum.onchange = () => rstBorder(begin_datum);
eind_datum.onchange = () => rstBorder(eind_datum)
aantal_gasten.onchange = () => rstBorder(aantal_gasten)
accommodatie.onchange = () => rstBorder(accommodatie)
// cool phonenumber selecter messes with function
telefoonnummer.onchange = () => {
    telefoonnummer.style.border = "";
    // try and remove error codes
    try {
        let c = telefoonnummer.parentElement.parentElement.getElementsByClassName("errnote");
        for (let e of c) {
            telefoonnummer.parentElement.parentElement.removeChild(e);
        }
    } catch(e) {}
}



function addErrNoteToInputElement(id, errStringArray) {
    document.getElementById(id).style.border = "";
    errStringArray.forEach(str => {
    

        let errNote = document.createElement("p");
        errNote.classList.add("errnote");
        errNote.innerText = str;
        // phone number selector messes with hierarchy
        if (id === "telefoonnummer") telefoonnummer.parentElement.parentElement.prepend(errNote);
        else document.getElementById(id).parentElement.prepend(errNote);

        document.getElementById(id).style.border = "2px solid red";
    
    })
}

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

    begin_datum.value = d1.toISOString().split("T")[0];
    eind_datum.value = d2.toISOString().split("T")[0];

    aantal_gasten.value = 1;
    accommodatie.children[1].setAttribute("selected", true);
    notities.innerText = "Lorem ipsum dolor sit amet";
}


window.onload = function() {begin_datum.min = new Date().toISOString().split("T")[0]; eind_datum.min = new Date().toISOString().split("T")[0];}

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
    // only check phone number
    // I am just WAAAYY to lazy to check that in the backend
    if (!window.iti.isValidNumber()) {
        return addErrNoteToInputElement("telefoonnummer", ["telefoonnummer is niet geldig"])
    }

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
            accomodation: accommodatie.value,
            notes: notities.value,

            captcha: captchaString
        })
    })
    .then(r => r.json())
    .then(r => {

        const mvn = r.mvn;

        if (mvn) {
            // some values are malformed
            Object.entries(mvn).forEach((key) => {
                rstBorder(document.getElementById(key[0]))
                key[1].forEach(str => {
                

                    let errNote = document.createElement("p");
                    errNote.classList.add("errnote");
                    errNote.innerText = str;
                    // phone number selector messes with hierarchy
                    if (key[0] === "telefoonnummer") telefoonnummer.prepend(errNote);
                    else document.getElementById(key[0]).parentElement.prepend(errNote);

                    document.getElementById(key[0]).style.border = "2px solid red";
                
                })
            });

            grecaptcha.reset();
        } else {
            function showPopup(id, isError = false) {
                for (let node of document.getElementById("confirmation-states").children) {
                    node.classList.add("hidden")
                }
                const elm = document.getElementById(id);
                elm.classList.remove("hidden");
                if (isError) document.getElementById("confirmation-popup-icon").src = "/img/exclamation-mark.png";
                document.getElementById("close-confirmation-box-button").onclick = () => confirmationContainer.classList.add("hidden");
                confirmationContainer.classList.remove("hidden");
            }

            switch (r.status) {
                case "duplicate": showPopup("confirmation-duplicate"); break;
                case "success": showPopup("confirmation-success"); break;
                case "toomany": showPopup("confirmation-too-many", true); break;
                default: showPopup("confirmation-other-error", true); break;
            }

            grecaptcha.reset();
        }
    })
}