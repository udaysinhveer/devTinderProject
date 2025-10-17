const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");

router.post("/sendConnectionRequest", userAuth, async (requestAnimationFrame, res) => {
    const user = req.user;
    console.log("sending a connection request");

    res.send(user.firstName + "sent the connect request")

});

module.exports = router