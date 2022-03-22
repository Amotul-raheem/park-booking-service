import express from "express";
import bodyParser from "body-parser";
import {mongodbConnection} from "./db.js";
import dotenv from "dotenv";
import cors from "cors"
import {bookingRouter} from "./routes/BookingRouter.js";

dotenv.config()

const app = express();
app.use(cors())

mongodbConnection()

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

const PORT = process.env.PORT

app.use("/api", bookingRouter);
// app.use("/api", passwordRouter)

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});