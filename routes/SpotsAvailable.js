import {ParkSpace} from "../models/ParkSpace.js";
import {BOOKING_STATUS} from "../utils/BookingStatus.js";
import express from "express";
import Booking from "../models/Booking.js";
import getDates from "../utils/GetDates.js";

const spotsAvailableRouter = express.Router();

spotsAvailableRouter.post("/isSpotAvailable", async (req, res) => {
    let unavailableSpots = []
    const pendingBookings = await Booking.find({booking_status: BOOKING_STATUS.PENDING})
    var dt = new Date("30 July 2010 15:05 UTC");
    document.write(dt.toISOString());

    const checkIn = req.body.check_in
    const checkOut = req.body.check_out

    for (let i = 0; i < pendingBookings.length; i++) {
        let x = (pendingBookings[i].space_id);
        let y = (pendingBookings[i].check_in);
        let z = (pendingBookings[i].check_out);

        const dates = getDates(new Date(y), new Date(z))
        dates.forEach(function (date) {
            // console.log(date)
            if (date === checkOut || date === checkIn) {
                unavailableSpots.push(x)
            }else{
                console.log("ok")
            }
        })
    }
    console.log(unavailableSpots)
    res.send("working")


})


// Usage
// const dates = getDates(new Date(2013, 10, 22), new Date(2013, 11, 25))
// dates.forEach(function (date) {
//     console.log(date)
// })

export default spotsAvailableRouter