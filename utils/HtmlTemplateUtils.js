import path from 'path';

const BASE_PATH = path.resolve()

export const EMAIL_PROPERTIES = {
    RESET_PASSWORD: {
        subject: "Reset Password",
        templateDirectory: path.join(BASE_PATH, '/templates/reset-password-notification/reset-password-notification.html')
    },
    ACCOUNT_VERIFICATION: {
        subject: "Account verification",
        templateDirectory: path.join(BASE_PATH, '/templates/account-verification/account-verification.html')
    },
    BOOKING: {
        subject: "Booking successful",
        templateDirectory: path.join(BASE_PATH, '/templates/booking-notification/booking-notification.html')
    }
}

