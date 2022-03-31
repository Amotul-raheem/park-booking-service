import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    space_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkSpace'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    check_in: {
        type: Date,
        required: true
    },
    check_out: {
        type: Date,
        required: false
    },
    booking_date: {
        type: Date,
        required: false
    },
    booking_ref_number: {
        type: String,
    },
    booking_status: {
        type: String
    },
    price: {
        type: Number
    },
    paid: {
        type: Boolean,
        default: false
    }
})

const Booking = mongoose.model('booking', bookingSchema);
export default Booking;
