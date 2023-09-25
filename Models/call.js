const mongoose = require('mongoose');

const callSchema = mongoose.Schema({
    roomName: {
        type: String,
        default: "",
        trim: true
    },
    // duration: {
    //     type: Number,
    //     required: [true, "Duration is required"],
    //     min: [1, "Duration must be at least 1 minute"],
    //     max: [60, "Duration cannot exceed 60 minutes (1 hour)"],
    //     index: true
    // },
    cusNumber: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: ""
    },
    isNotified:{
        type:Boolean,
        default:false
    },
    isRejected:{
        type:Boolean,
        default:false
    },
    isAccepted:{
        type:Boolean,
        default:false
    },
    token:{
        type:String,
        default:""
    }
});

const Call= mongoose.model('Call', callSchema);
module.exports=Call
