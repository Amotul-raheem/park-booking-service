import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    reset_token: {
        type: String,
        required: false
    },
    reset_token_creation_date: {
        type: Date,
        required: false
    },
    verification_token: {
        type: String,
    },
    verification_token_creation_date: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    card: {
        card_number: {
            type: Number,
        },
        card_type: {
            type: String,
        },
        expiry_month: {
            type: Date,
        },
        expiry_year: {
            type: Date,
        },
        security_code: {
            type: Number,
        }
    }
})

const User = mongoose.model('user', userSchema);
export default User;
