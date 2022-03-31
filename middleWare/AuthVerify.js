import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

const authVerify = function (req, res, next) {
    const token = req.header("token");
    if (!token) return res.status(401).send("Access Denied");

    try {
        req.userId = jwt.verify(token, process.env.TOKEN_STRING);
        console.log("Booking verified")
        next();
    } catch (error) {
        res.status(400).send("Invalid token")
    }
}


export default authVerify;