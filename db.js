import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()


const mongodbConnection = ( () => {
    try {
        mongoose.connect(process.env.MONGODB_URL,() => console.log("connected to database successfully"));
    } catch (error) {
        console.log(error.message)
    }
})
export {mongodbConnection};
