import express from "express"
import User from "../models/User.js";
import {ParkSpace} from "../models/ParkSpace.js";
import Booking from "../models/Booking.js";
import {v4 as uuidv4} from 'uuid';
import authVerify from "../middleWare/AuthVerify.js";
import {BOOKING_STATUS} from "../utils/BookingStatus.js";

const bookingRouter = express.Router();


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

        res.status(200).send("Booking successful")
    } catch (error) {
        res.status(500).send(error);
    }
})


export {bookingRouter}

