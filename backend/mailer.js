import * as nodemailer from "nodemailer";
import config from "./config.js";
import { err_log, info_log } from "./util.js";
import * as fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // For TLS
    auth: {
        user: "shocomellow.boerbert@gmail.com",
        pass: "ulcv wotm rxgt efvr"
    }
});

// this is used if the html doesn't get sent
const mailFallbackContent = "Hallo $CLIENTNAME!\nWe hebben een reserveringsverzoek van je ontvangen!\nKlik de link hieronder om je reservering te bevestigen:\n\n$CONFIRMATIONLINK\n\nWas jij dit niet? Dan hoef je nu niks te doen!\nAls je je zorgen maakt over je data kan je een mail sturen naar shocomellow.boerbert@gmail.com.";
const mailContent = fs.readFileSync(path.join(import.meta.dirname, "./resources/confirmationmailcontent.html"), { encoding: "utf-8" });

export async function sendMailConfirmationEmail(confirmationLink, mailAddress, clientFirstName) {
    try {
        const nameFirstCapitalized = clientFirstName.charAt(0).toUpperCase() + clientFirstName.slice(1).toLowerCase();

        const mailOptions = {
            from: "shocomellow.boerbert@gmail.com",
            to: mailAddress,
            subject: "bevestig je reservering",
            text: mailFallbackContent,
            html: mailContent
                .replace("$CONFIRMATIONLINK", confirmationLink)
                .replace("$CLIENTNAME", nameFirstCapitalized)
        }

        transporter.sendMail(mailOptions, (err) => {
            if (err) err_log("error in mail callback", err);
            else debug_log("mail callback; mail was actually sent");
        });
    } catch(e) {
        err_log("error while sending confirmation mail", e);
    }
}