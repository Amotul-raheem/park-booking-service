import handlebars from "handlebars";
import {EMAIL_PROPERTIES} from "../utils/HtmlTemplateUtils.js";
import readHTMLFile from "../utils/FileUtils.js";
import sendMail from "../client/EmailSender.js";


const sendAccountVerificationNotificationEmail = ({username, email, accountVerificationLink}) => {
    try {
        const accountVerificationHtmlTemplate = readHTMLFile(EMAIL_PROPERTIES.ACCOUNT_VERIFICATION.templateDirectory)
        const template = handlebars.compile(accountVerificationHtmlTemplate);
        const replacements = {
            username: username,
            link: accountVerificationLink,
        };
        const htmlFileToSend = template(replacements);
        sendMail(email, htmlFileToSend, EMAIL_PROPERTIES.ACCOUNT_VERIFICATION.subject)
        console.log("Account verification email successfully sent to " + username)
    } catch (error) {
        console.log("Account verification email failed to send to" + username)
    }
}

const sendBookingNotificationEmail = ({username, checkInTime, checkOutTime, parkSpaceName, email}) => {
    try {
        const bookingNotificationHtmlTemplate = readHTMLFile(EMAIL_PROPERTIES.BOOKING.templateDirectory)
        const template = handlebars.compile(bookingNotificationHtmlTemplate);
        const replacements = {
            username: username,
            checkIn: checkInTime,
            checkOut: checkOutTime,
            space_name: parkSpaceName
        };
        const htmlFileToSend = template(replacements);
        sendMail(email, htmlFileToSend, EMAIL_PROPERTIES.BOOKING.subject)
        console.log("Booking successful email sent to " + username)
    } catch (error) {
        console.log("Booking email failed to send to " + username)
    }

}

const sendResetPasswordNotificationEmail = ({username, email, resetPasswordLink}) => {
    try {
        const resetPasswordNotificationHtmlTemplate = readHTMLFile(EMAIL_PROPERTIES.RESET_PASSWORD.templateDirectory)

        const template = handlebars.compile(resetPasswordNotificationHtmlTemplate);
        const replacements = {
            username: username,
            link: resetPasswordLink,
            email: email
        };
        const htmlFileToSend = template(replacements);
        sendMail(email, htmlFileToSend, EMAIL_PROPERTIES.RESET_PASSWORD.subject)
        console.log("Reset password email sent successfully to " + username)
    } catch (error) {
        console.log("Reset password email failed to send to " + username)
    }
}


export {sendResetPasswordNotificationEmail, sendBookingNotificationEmail, sendAccountVerificationNotificationEmail};


