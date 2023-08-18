import express from "express";
import moment from "moment";
import {BOOKING_STATUS} from "../../enums/BookingStatus.js";
import Booking from "../../models/Booking.js";
import {ParkSpace} from "../../models/ParkSpace.js";

const parkSpotsRouter = express.Router();

parkSpotsRouter.post("/get-park-spots", async (req, res) => {
    try {
        const reqCheckIn = moment(req.body.check_in).format()
        const reqCheckOut = moment(req.body.check_out).format()

        let parkSpots = {}

        const pendingAndActiveBookings = await Booking.find({$or: [{booking_status: BOOKING_STATUS.PENDING}, {booking_status: BOOKING_STATUS.ACTIVE}]})

        let unavailableSpotIds = pendingAndActiveBookings.reduce((accum, booking) => {
            let checkIn = moment(booking.check_in).format()
            let checkOut = moment(booking.check_out).format()
            let isReqCheckInInRange = isDateBetween(reqCheckIn, checkIn, checkOut)
            let isReqCheckOutInRange = isDateBetween(reqCheckOut, checkIn, checkOut)
            let isCheckInInRange = isDateBetween(checkIn, reqCheckIn, reqCheckOut)
            let isCheckOutInRange = isDateBetween(checkOut, reqCheckIn, reqCheckOut)

            if (isReqCheckInInRange || isReqCheckOutInRange || isCheckInInRange || isCheckOutInRange) {
                accum.push(booking.space_id)
            }
            return accum
        }, [])
        let unavailableParkSpaces = await ParkSpace.find({_id: {$in: unavailableSpotIds}}, {space_name: 1});
        let availableParkSpaces = await ParkSpace.find({_id: {$nin: unavailableSpotIds}}, {space_name: 1});

        parkSpots.unavailable = unavailableParkSpaces
        parkSpots.available = availableParkSpaces

        res.status(200).json(parkSpots)

    } catch (error) {
        res.status(500).send(error);
    }

})

function isDateBetween(refDate, startDate, stopDate) {
    let isDateInRange = moment(refDate).isBetween(startDate, stopDate)
    return refDate === startDate || refDate === stopDate || isDateInRange === true;
}


export default parkSpotsRouter