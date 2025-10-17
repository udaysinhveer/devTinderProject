const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email address")
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender Data is not valid")
            }
        }
    },
    about: {
        type: String,
        default: "This is the default value of the user"
    },
    skills: {
        type: [String]
        //mongoose.Schema.Types.Mixed is similar to type any
    }
},
    { timestamps: true },
);


userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Dev@Uday#2710", { expiresIn: "1d", }) // generating JWT token
    return token;
}

const userModel = mongoose.model("user", userSchema);
module.exports = userModel