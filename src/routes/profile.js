const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");

router.get("/profile/view",userAuth, async (req, res) => {

    const user = req.user

    if (!user) {
        throw new Error("user does not exist")
    }
    res.send(user);
});

router.patch("/profile/edit", userAuth, async (req, res)=>{
    
})
module.exports = router