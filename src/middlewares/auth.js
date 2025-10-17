const jwt = require("jsonwebtoken");
User = require("../models/user")


// authentication using the Jwt token
const userAuth = async (req, res, next) => {
    // read the token from the request cookies
    // validate the token
    // Find the user

    try {
        const { token } = req.cookies;

        if (!token) {
           throw new Error("Token is not valid!!!!!!!!!!!!!!!!!!!!!!!!!") 
        }

        const decodedObj = await jwt.verify(token, "Dev@Uday#2710")

        const { _id } = decodedObj;

        const user = await User.findById(_id)

        if (!user) {
            throw new Error("User not found")
        }
        req.user = user;
        next()
    } catch (err) {
        res.status(400).send("Error:" + err.message)
    }

}

module.exports = {
    userAuth,
};