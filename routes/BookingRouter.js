import express from "express"
import dotenv from "dotenv";
import User from "../models/User.js";
import {ParkSpace} from "../models/ParkSpace.js";
import Booking from "../models/Booking.js";
import {v4 as uuidv4} from 'uuid';
import authVerify from "../middleware/AuthVerify.js";
import {BOOKING_STATUS} from "../utils/BookingStatus.js";
import sendEmail from "../Client/BookingNotificationClient.js";

const bookingRouter = express.Router();
dotenv.config()

bookingRouter.post("/booking", authVerify, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        const parkSpace = await ParkSpace.findOne({space_name: req.body.space_name});
        if (!parkSpace) {
            res.status(400).send("Invalid booking");
        }

        const booking = new Booking({
            space_id: parkSpace._id,
            user_id: user._id,
            check_in: req.body.check_in,
            check_out: req.body.check_out,
            booking_date: Date.now(),
            booking_ref_number: uuidv4(),
            price: req.body.price,
            booking_status: BOOKING_STATUS.PENDING,
            paid: true
        });
        await booking.save();

        user.card_number = req.body.card_number
        user.card_type = req.body.card_type
        user.expiry_month = req.body.expiry_month
        user.expiry_year = req.body.expiry_year
        user.security_code = req.body.security_code
        await user.save()

        const  BOOKING_NOTIFICATION_ENDPOINT = process.env. BOOKING_NOTIFICATION_ENDPOINT
        const username = user.username
        x
        await sendEmail(username, req.body.space_name, req.body.check_in, req.body.check_out, BOOKING_NOTIFICATION_ENDPOINT)
        console.log("Booking successful email sent to" + username)

        res.status(200).send("Booking successful")
    } catch (error) {
        res.status(500).send(error);
    }
})

bookingRouter.post("/cancel-booking", async (req, res) => {
    try {
        const cancelledBooking = await Booking.findOne({_id: req.body._id});

        cancelledBooking.booking_status = BOOKING_STATUS.CANCELLED
        await cancelledBooking.save()
        res.status(200).send("Booking cancelled successfully")

    } catch (error) {
        res.status(500).send(error);
    }
})

bookingRouter.post("/user-bookings", authVerify, async (req, res) => {
    try {
        const userBookings = await Booking.find({user_id: req.body.user_id});

        let pendingBookings = userBookings.filter(booking => booking.booking_status === BOOKING_STATUS.PENDING);
        let activeBookings = userBookings.filter(booking => booking.booking_status === BOOKING_STATUS.ACTIVE);
        let cancelledBookings = userBookings.filter(booking => booking.booking_status === BOOKING_STATUS.CANCELLED);
        let fulfilledBookings = userBookings.filter(booking => booking.booking_status === BOOKING_STATUS.FULFILLED);

        let allUserBookings = {}

        allUserBookings.pending = pendingBookings
        allUserBookings.active = activeBookings
        allUserBookings.cancelled = cancelledBookings
        allUserBookings.fulfilled = fulfilledBookings

        res.status(200).json(allUserBookings)
    } catch (error) {
        res.status(500).send(error);
    }
})

export {bookingRouter}

