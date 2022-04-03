import express from "express";
import moment from "moment";
import {ParkSpace} from "../models/ParkSpace.js";
import {BOOKING_STATUS} from "../utils/BookingStatus.js";

import Booking from "../models/Booking.js";
import getDates from "../utils/GetDates.js";

const totalSpotsRouter = express.Router();

totalSpotsRouter.post("/isSpotAvailable", async (req, res) => {
    const reqCheckIn = moment(req.body.check_in).format()
    const reqCheckOut = moment(req.body.check_out).format()

    let totalSpots = {}

    const pendingAndInuseBookings = await Booking.find({$or: [{booking_status: BOOKING_STATUS.PENDING}, {booking_status: BOOKING_STATUS.INUSE}]})

    let unavailableSpots = pendingAndInuseBookings.reduce(async (accum, booking) => {
            let checkIn = moment(booking.check_in).format()
            let checkOut = moment(booking.check_out).format()
            let isCheckInInRange = reqCheckIn.isBetween(checkIn, checkOut)
            let isCheckOutInRange = reqCheckOut.isBetween(checkIn, checkOut)

            if (isCheckInInRange && isCheckOutInRange === true) {
                accum.push(booking.space_id)
            }
        },
        [])

    let unavailableParkSpaces = await ParkSpace.find({_id: {$in: unavailableSpots}}, {space_name: 1, _id: false});

    // for (let i = 0; i < pendingAndInuseBookings.length; i++) {
    //     let x = (pendingAndInuseBookings[i].space_id);
    //     let y = (pendingAndInuseBookings[i].check_in);
    //     let z = (pendingAndInuseBookings[i].check_out);
    //
    //     const dates = getDates(new Date(y), new Date(z))
    //     dates.forEach(function (date) {
    //         // console.log(date)
    //         if (date === checkOut || date === checkIn) {
    //             unavailableSpots.push(x)
    //         } else {
    //             console.log("ok")
    //         }
    //     })
    // }
    // console.log(unavailableSpots)
    res.send("working")


})


// Usage
// const dates = getDates(new Date(2013, 10, 22), new Date(2013, 11, 25))
// dates.forEach(function (date) {
//     console.log(date)
// })

export default totalSpotsRouter