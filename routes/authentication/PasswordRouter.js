import express from "express"
import bcrypt from "bcryptjs";
import joi from "joi";
import dotenv from "dotenv";
import {v4 as uuidv4} from 'uuid';
import {sendResetPasswordNotificationEmail} from "../../service/EmailNotificationService.js";
import User from "../../models/User.js";
import {isTokenExpired} from "../../utils/TokenUtils.js";

dotenv.config()
const passwordRouter = express.Router();

//forgot-password route
const emailValidator = joi.object({
    email: joi.string().min(3).required().email(),
})

passwordRouter.post("/forgot-password", async (req, res) => {
    try {
        //Checks that email sent by user is a valid email.
        const {error} = await emailValidator.validateAsync(req.body);
        if (error) {
            res.status(400).send(error.details[0].message)
        }

        //Checks if the user with email exists in database.
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            res.status(400).send("Incorrect Email");
        }
        //Generates a random token that is unique to te user.
        const resetToken = uuidv4();

        //Adds new fields to the userSchema; reset-token and reset-token creation date
        user.reset_token = resetToken
        user.reset_token_creation_date = Date.now();
        await user.save()

        const link = `${process.env.BASE_URL}/reset-password/${resetToken}`;
        sendResetPasswordNotificationEmail({resetPasswordLink: link, email: user.email, username: user.username})

        res.status(200).send("Password reset link sent to your email");
    } catch (error) {
        res.status(500).send(error);
    }
})

// reset-password route
const passwordValidator = joi.object({
    password: joi.string().min(6).required()
})

passwordRouter.post("/reset-password/:resetToken", async (req, res) => {
    try {
        //Validates password using joi validation
        const {error} = await passwordValidator.validateAsync(req.body);
        if (error) {
            res.status(400).send(error.details[0].message)
        }

        //Checks if user's token exists in database
        const user = await User.findOne({reset_token: req.params.resetToken});
        if (!user) return res.status(400).send("Invalid Token");

        //Checks if token has expired
        if (isTokenExpired(user.reset_token_creation_date)) {
            res.status(401).send("Link provided has expired")
        }

        //Encrypts user's new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        //Sets user's token and creation date to default
        user.reset_token_creation_date = null;
        user.reset_token = null;
        await user.save();

        res.status(200).send("Password reset successfully.");

    } catch (error) {
        res.status(500).send(error);
    }
});


export {passwordRouter}