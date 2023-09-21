const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const sellerSchema = mongoose.Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Please enter your phone number'],
        minlength: [10, 'Please enter a valid 10-digit phone number'],
        maxlength: [10, 'Please enter a valid 10-digit phone number'],
        index: true, 
        unique: true 
    },
    shopName: {
        type: String,
        default: '',
        trim: true
    },
    webLink: {
        type: String,
        default: ''
    },
    socialLink: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    calls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'callSchema'
    }],
    isOpen: {
        type: Boolean,
        default: false
    },
    shopLink: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        required: [true, 'Please enter your password']
    },
    clicks: {
        type: Number,
        default: 0
    },
    isRegistered: {
        type: Boolean,
        default: false
    },
    token:{
        type:String,
        default:''
    }
});

// Hash password before saving
sellerSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Add indexes for more efficient queries
sellerSchema.index({ phone: 1, shopLink: 1 });

module.exports = mongoose.model('Seller', sellerSchema);
