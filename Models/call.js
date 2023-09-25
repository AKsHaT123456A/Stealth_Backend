// models/call.js
const mongoose = require('mongoose');

const callSchema = mongoose.Schema({
    roomName: {
        type: String,
        default: "",
        trim: true
    },
    cusNumber: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: ""
    },
    isNotified: {
        type: Boolean,
        default: false
    },
    isRejected: {
        type: Boolean,
        default: false
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: ""
    }
});

const Call = mongoose.model('Call', callSchema);
module.exports = Call;
