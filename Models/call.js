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
    isRejected: {
        type: Boolean,
        default: false
    },
    userId:{
        type: String,
        default: ""
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: ""
    },
    phone:{
        type: String,
        default: ""
    },
    duration:{
        type: String,
        default: ""
    },
    feedback:{
        type:String,
        default:""
    },
    emoji:{
        type:String,
        default:""
    }
});

const Call = mongoose.model('Call', callSchema);
module.exports = Call;
