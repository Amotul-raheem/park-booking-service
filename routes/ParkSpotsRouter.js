import express from "express";
import moment from "moment";
import {ParkSpace} from "../models/ParkSpace.js";
import {BOOKING_STATUS} from "../utils/BookingStatus.js";
import Booking from "../models/Booking.js";

const parkSpotsRouter = express.Router();

parkSpotsRouter.post("/get-park-spots", async (req, res) => {
    try {
        const reqCheckIn = moment(req.body.check_in).format()
        const reqCheckOut = moment(req.body.check_out).format()

        let parkSpots = {}

        const pendingAndActiveBookings = await Booking.find({$or: [{booking_status: BOOKING_STATUS.PENDING}, {booking_status: BOOKING_STATUS.IN_USE}]})

        let unavailableSpotIds = pendingAndActiveBookings.reduce((accum, booking) => {
                let checkIn = moment(booking.check_in).format()
                let checkOut = moment(booking.check_out).format()
                let isCheckInInRange = isDateBetween(reqCheckIn, checkIn, checkOut)
                let isCheckOutInRange = isDateBetween(reqCheckOut, checkIn, checkOut)

                if (isCheckInInRange || isCheckOutInRange === true) {
                    accum.push(booking.space_id)
                }
                return accum
            },
            [])

        let unavailableParkSpaces = await ParkSpace.find({_id: {$in: unavailableSpotIds}}, {space_name: 1 });
        let availableParkSpaces = await ParkSpace.find({_id: {$nin: unavailableSpotIds}}, {space_name: 1});

        parkSpots.unavailable = unavailableParkSpaces
        parkSpots.available = availableParkSpaces

        res.status(200).json({ parkSpots: parkSpots })

    } catch (error) {
        res.status(500).send(error);
    }

})

function isDateBetween(refDate, startDate, stopDate) {
    let isDateInRange = moment(refDate).isBetween(startDate, stopDate)
    return refDate === startDate || refDate === stopDate || isDateInRange === true;
}


export default parkSpotsRouter