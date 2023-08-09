const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        default: "",
        trim: true
    },
    phone: {
        type: Number,
        required: [true, "Enter Your Phone Number"],
        minlength: [10, "Enter Valid Phone Number"],
        maxlength: [10, "Enter Valid Phone Number"],
        index: true,
        unique:true
    },
    password: {
        type: String,
        required: [true, "Enter Your Password"],
        minlength: [8, "Password must be at least 8 characters long"],
        trim: true,
        select: false,
    },
    
});

// Hash password before saving
customerSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Generate JWT token
customerSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
};

module.exports = mongoose.model('Customer', customerSchema);
