import express from "express"
import User from "../../models/User.js";
import authVerify from "../../middleware/AuthVerify.js";

const userProfileRouter = express.Router();

userProfileRouter.get("/get-user-profile", authVerify, async (req, res) => {
    try {
        const user = await User.findOne({user_id: req.userId});

        const userProfile = {
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            date_of_birth: user.date_of_birth
        }
        res.status(200).json(userProfile)

    } catch (error) {
        res.status(500).send(error);
    }

})
userProfileRouter.post("/update-user-profile", authVerify, async (req, res) => {
    try {
        const user = await User.findOne({user_id: req.userId});

        user.first_name = req.body.first_name
        user.last_name = req.body.last_name
        user.gender = req.body.gender
        user.date_of_birth = req.body.date_of_birth
        user.username = req.body.username
        await user.save()

        res.status(200).send("User profile updated")

    } catch (error){
        res.status(500).send(error);
    }
})

export {userProfileRouter}