const express = require("express");
const router = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post('/signup', async (req, res) => {

    const { password, firstName, lastName, emailId } = req.body
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
    });

    try {
        validateSignUpData(req);
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("invalid credentials")

            // never use and err message like email id is not found, it expose the our database. Instead, use generic error messages 
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {

            // const token = await jwt.sign({ _id: user._id }, "Dev@Uday#2710", { expiresIn:"1d",}) // generating JWT token
            // 1. _id:user._id  ======> This is the payload, meaning the actual data you want to embed inside the JWT (JSON Web Token).
            //2. "Dev@Uday#2710" ======> It’s the secret key that signs the token to prevent tampering and ensures verification fails if the token is altered.

            const token = await user.getJWT()

            res.cookie("token", token);
            res.send("login successfully");
            console.log('token', token);

        } else {
            throw new Error("Password is Incorrect")
        }

    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})

router.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    })
        .send("Logout Successful!!");
})

module.exports = router