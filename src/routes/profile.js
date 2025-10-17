const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");

router.get("/profile",userAuth, async (req, res) => {

    const user = req.user

    if (!user) {
        throw new Error("user does not exist")
    }
    res.send(user);
})

module.exports = router