import express from "express";
import moment from "moment";
import {ParkSpace} from "../models/ParkSpace.js";
import {BOOKING_STATUS} from "../utils/BookingStatus.js";
import Booking from "../models/Booking.js";

const totalSpotsRouter = express.Router();

totalSpotsRouter.post("/isSpotAvailable", async (req, res) => {
    try {
        const reqCheckIn = moment(req.body.check_in).format()
        const reqCheckOut = moment(req.body.check_out).format()

        let totalSpots = {}

        const pendingAndInuseBookings = await Booking.find({$or: [{booking_status: BOOKING_STATUS.PENDING}, {booking_status: BOOKING_STATUS.INUSE}]})
        const fulfilledAndCancelledBookings = await Booking.find({$or: [{booking_status: BOOKING_STATUS.FULFILLED}, {booking_status: BOOKING_STATUS.CANCELLED}]})

        let availableSpots = fulfilledAndCancelledBookings.map(getAvailableSpaceId)
        let unavailableSpots = pendingAndInuseBookings.map(getUnavailableSpaceId)

        let unavailableParkSpaces = await ParkSpace.find({_id: {$in: unavailableSpots}}, {space_name: 1, _id: false});
        let availableParkSpaces = await ParkSpace.find({_id: {$in: availableSpots}}, {space_name: 1, _id: false});

        function getAvailableSpaceId(booking) {
            let spaces = []
            spaces.push(booking.space_id)
            return spaces
        }

        function getUnavailableSpaceId(booking) {
            let spaces = []
            let checkIn = moment(booking.check_in).format()
            let checkOut = moment(booking.check_out).format()
            let isCheckInInRange = isDateBetween(reqCheckIn, checkIn, checkOut)
            let isCheckOutInRange = isDateBetween(reqCheckOut, checkIn, checkOut)

            if (isCheckInInRange || isCheckOutInRange === true) {
                spaces.push(booking.space_id)
            }
            return spaces
        }

        totalSpots.unavailabe = unavailableParkSpaces
        totalSpots.available = availableParkSpaces

        console.log(totalSpots)
        res.status(200).send("Parkspaces updated successfully")

    } catch (error) {
        res.status(500).send(error);
    }

})

function isDateBetween(refDate, startDate, stopDate) {
    let isDateInRange = moment(refDate).isBetween(startDate, stopDate)
    return refDate === startDate || refDate === stopDate || isDateInRange === true;
}


export default totalSpotsRouter