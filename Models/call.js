const mongoose = require('mongoose');

const callSchema = mongoose.Schema({
    video: {
        type: String,
        default: "",
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"],
        min: [1, "Duration must be at least 1 minute"],
        max: [60, "Duration cannot exceed 60 minutes (1 hour)"],
        index: true
    },
    cusNumber: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('Call', callSchema);
