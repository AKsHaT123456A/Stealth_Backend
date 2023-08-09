const { Schema, model } = require("mongoose");

const otpSchema = new Schema(
    {
        phone: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false
        },
        expires: 300 // Automatically remove after 5 minutes
    }
);

module.exports = model("Otp", otpSchema);
