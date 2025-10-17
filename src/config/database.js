// config/database.js
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://testuday01_db_user:Tvf4Kocxms9O0Cvg@namastenodejs.wlppxg8.mongodb.net/devTinder";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'testuday01_db', // Optional if DB name is already in URI
        });
        console.log("✅ MongoDB connected successfully.");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1); // Exit process if DB connection fails
    }
};

module.exports = connectDB;
