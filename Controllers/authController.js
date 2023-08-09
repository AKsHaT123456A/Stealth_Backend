const { sendOtpVerify, sendOtpPassword } = require("../Utils/sendOtp");
const Seller = require("../Models/seller");
const seller = require("../Models/seller");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const constants = require("../Utils/constants");

module.exports.register = async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);
    if (!phone) {
        return res.status(400).json({ message: "Please provide Phone Number" });
    }

    try {
        sendOtpVerify(otp, phone);
        return res.status(201).json({ message: "OTP sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while sending OTP", error: error.message });
    }
};

module.exports.login = async (req, res) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return res.status(400).json({ message: "Please provide Phone Number and Password" });
    }
    const user = await seller.findOne({ phone });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
    }
    try {
        const accessToken = jwt.sign({ _id: user.id }, constants.ACCESS_TOKEN_SECRET, { expiresIn: constants.TOKEN_EXPIRATION });
        const refreshToken = jwt.sign({ _id: user.id }, constants.REFRESH_TOKEN_SECRET);

        res.cookie('refreshToken', refreshToken, { httpOnly: true }); // Store refresh token in a secure cookie

        return res.status(200).json({ message: 'Logged in successfully', accessToken });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while creating the user", error: error.message });
    }
};



module.exports.verify = async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ message: "Please provide Phone Number and OTP" });
    }

    const password = constants.PASSWORD;
    const user = new Seller({ phone, password, isRegistered: true });

    try {
        await user.save();
        sendOtpPassword(password, phone);
        return res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while creating the user" });
    }
};

module.exports.refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

    try {
        jwt.verify(refreshToken, constants.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token' });
            const newAccessToken = jwt.sign({ _id: decoded._id }, constants.ACCESS_TOKEN_SECRET, { expiresIn: constants.TOKEN_EXPIRATION });
            return res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out successfully' });
};