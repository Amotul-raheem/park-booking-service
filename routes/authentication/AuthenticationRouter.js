import express from "express"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import joi from "joi";
import dotenv from "dotenv";
import {v4 as uuidv4} from 'uuid';
import {sendAccountVerificationNotificationEmail} from "../../service/EmailNotificationService.js";
import User from "../../models/User.js";
import {isTokenExpired} from "../../utils/TokenUtils.js";

dotenv.config()
const authenticationRouter = express.Router();

// sign-up route
const signUpValidator = joi.object({
    username: joi.string().min(3).required(),
    email: joi.string().min(3).required().email(),
    password: joi.string().min(6).required()
});

authenticationRouter.post("/sign-up", async (req, res) => {
    try {
        const {error} = await signUpValidator.validateAsync(req.body);
        if (error) {
            res.status(500).send(error.details[0].message)
        }
        const email = req.body.email;
        const username = req.body.username;

        const emailExist = await User.findOne({email: email});
        if (emailExist) {
            res.status(400).send("Email already exists.");
            console.log("Email already exists.")
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const verificationToken = uuidv4();

        const user = new User({
            username: username,
            email: email,
            password: hashedPassword,
            verification_token: verificationToken,
            verification_token_creation_date: Date.now()
        });

        // Save user to database
        await user.save();

        const link = `${process.env.BASE_URL}/account-verification/${verificationToken}`;
        console.log(link)

        // Send email verification to user in notification service
        sendAccountVerificationNotificationEmail({
            username,
            email: email,
            accountVerificationLink: link
        })

        res.status(200).send("user created")
    } catch (error) {
        res.status(500).send(error);
    }
});

// sign in Route

const signInValidator = joi.object({
    email: joi.string().min(3).required().email(),
    password: joi.string().min(6).required()
});

authenticationRouter.post("/sign-in", async (req, res) => {
    const {error} = await signInValidator.validateAsync(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("Incorrect Email");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Incorrect password");

    try {
        if ((!user.isVerified && !isTokenExpired(user.verification_token_creation_date)) || user.isVerified) {
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_STRING, {expiresIn: '48h'});
            res.header('Access-Control-Expose-Headers', 'token').header("token", token)
            res.status(200).send("Login successfully")
        } else {
            return res.status(401).send('Your Email has not been verified. Check your mail');
        }

    } catch (error) {
        res.status(500).send(error);
    }
});

// Email verification route
authenticationRouter.post("/verify-email/:verificationToken", async (req, res) => {
    try {
        //Checks if user's token exists in database
        const user = await User.findOne({verification_token: req.params.verificationToken});
        const username = user.username
        const email = user.email

        if (!user) return res.status(400).send("Invalid Token");

        //Checks if token has expired
        if (isTokenExpired(user.verification_token_creation_date)) {
            res.status(401).send("Link provided has expired")

            const verificationToken = uuidv4();

            const link = `${process.env.BASE_URL}/account-verification/${verificationToken}`;
            console.log(link)

            // Send email verification to user in notification service
            sendAccountVerificationNotificationEmail({
                username,
                email: email,
                accountVerificationLink: link
            })
        }
        user.isVerified = true;
        user.verification_token_creation_date = null;
        user.verification_token = null;
        await user.save();

        res.status(200).send("Email verified successfully.");

    } catch (error) {
        res.status(500).send(error);
    }
})


export {authenticationRouter}