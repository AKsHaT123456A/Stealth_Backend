const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sellerSchema = mongoose.Schema({
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
    shopName: {
        type: String,
        default: "",
        trim: true
    },
    webLink: {
        type: String,
        default: ""
    },
    socialLink: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    calls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "callSchema"
    }],
    isOpen: {
        type: Boolean,
        default: false
    },
    shopLink: {
        type: String,
        default: "",
        uniques:true
    },
    password:{
        type: String,
        required: [true, "Enter Your Password"],
    },
    clicks: {
        type: Number,
        default: 0
    },
    isRegistered: {
        type: Boolean,
        default: false
    }
});

// Hash password before saving
sellerSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
module.exports = mongoose.model('Seller', sellerSchema);
