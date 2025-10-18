const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateSignUpData, validateEditProfileData } = require("../utils/validation");

router.get("/profile/view", userAuth, async (req, res) => {

    const user = req.user

    if (!user) {
        throw new Error("user does not exist")
    }
    res.send(user);
});

router.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        console.log(loggedInUser);
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        console.log(loggedInUser);

        res.json({
            message: `${loggedInUser.firstName}, Your profile updated successfully`,
            data: loggedInUser
        });
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

module.exports = router