const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const customerSchema = mongoose.Schema({
    phone: {
        type: Number,
        required: [true, 'Enter Your Phone Number'],
        minlength: [10, 'Enter Valid Phone Number'],
        maxlength: [10, 'Enter Valid Phone Number'],
        index: true,
        unique: true
    },
});
// Hash password before saving
customerSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('Customer', customerSchema);
