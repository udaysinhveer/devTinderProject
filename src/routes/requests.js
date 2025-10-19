const express = require("express");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user")

const { userAuth } = require("../middlewares/auth");

router.post("/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            const allowedStatus = ["ignored", "interested"];

            if (!allowedStatus.includes(status)) {
                return res.status(400).json({ message: "Invalid status type " + status })
            }

            const toUser = await User.findById(toUserId);
            if (!toUser) {
                return res.status(404).json({Message:"Invalid connection request, user not found"})
            }

            // If there is an existing connection request or not 

            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ],
            });
            if (existingConnectionRequest) {
                return res
                .status(400).send({message:"Connection request already exist"})
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            });

            const data = await connectionRequest.save();

            res.json({
                message: `${req.user.firstName}  ${status} ${toUser.lastName}`,
                data,
            });

        } catch (err) {
            res.status(400).send("ERROR " + err.message)
        }

    });

module.exports = router