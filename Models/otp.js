const { Schema, model } = require('mongoose');

const otpSchema = new Schema(
    {
        phone: {
            type: String,
            required: true,
            index: true 
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

// Add an index on the 'createdAt' field to optimize the removal of expired documents
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = model('Otp', otpSchema);
