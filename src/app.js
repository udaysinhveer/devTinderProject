const express = require("express")
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
app.use(express.json());
app.use(cookieParser()); // cookie-parser is a middleware that helps Express read cookies from the incoming HTTP requests.

const User = require("./models/user")

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);


app.get("/userWithEmailId", async (req, res) => {

    const userEmail = req.body.emailId

    try {
        const user = await User.find({ emailId: userEmail })
        if (user.length >= 0) {
            res.status(404).send("User not found")
        } else {
            res.send(user)
        }
    } catch (err) {
        res.status(400).send('User not found')
    }
})

app.get("/allUsers", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Error fetching users" });
    }
});

app.delete("/deleteUser", async (req, res) => {
    const userId = req.body.userId

    try {
        await User.findByIdAndDelete(userId);
        res.status(200).send("User Deleted Successfully");
    } catch (err) {
        res.status(400).send({ message: "unable to delete user" })
    }
})


// update user using the patch 

app.patch("/updateUser/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body

    try {

        const allowedUpdates = [
            "about", "firstName", "lastName", "gender", "age", "skills", "password",
        ]
        const isUpdateAllowed = Object.keys(data).every(k =>
            allowedUpdates.includes(k)
        );

        if (!isUpdateAllowed) {
            throw new Error("Updates not allowed")
        };

        if (data?.skills.length > 10) {
            throw new Error("Skills should not be more than 10")
        }

        await User.findByIdAndUpdate(userId, req.body);
        res.status(200).send("User Updated Successfully");
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})




const startServer = async () => {
    await connectDB(); // Wait for DB connection
    app.listen(3000, () => {
        console.log(`🚀 Server is listening on port ${3000}`);
    });
};

startServer();
