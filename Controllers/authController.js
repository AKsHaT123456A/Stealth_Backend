const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const constants = require('../Utils/constants');
const Seller = require('../Models/seller');
const logger = require('../Utils/logger');
const { handleErrorResponse } = require('../Utils/errorHandler');
const emailer = require('../Utils/sendPassword');
const Call = require('../Models/call'); // Renamed to avoid variable name conflict
const pass = require('../Utils/randomPassword');

const handleError = (res, statusCode, message, error) => {
    logger.error(message, error);
    return handleErrorResponse(res, statusCode, message, error);
};

module.exports.register = async (req, res) => {
    try {
        const { phone, email, name } = req.body;

        if (!phone || !email) {
            return handleError(res, 400, 'Please provide both phone and email');
        }

        const user = new Seller({ phone, email, name, password: pass });

        await user.save();
        emailer(email, pass, phone);
        logger.info('User created successfully');
        return res.status(201).json({ message: 'User created successfully', userId: user._id });
    } catch (error) {
        return handleError(res, 500, 'An error occurred while creating the user', error);
    }
};

module.exports.login = async (req, res) => {
    try {
        const { phone, password, token } = req.body;
        console.log(phone, password, token);

        if (!phone || !password) {
            return handleError(res, 400, 'Please provide both phone and password');
        }

        const user = await Seller.findOne({ phone }).select('+password +shopName').lean();
        const call = await Call.findOne({ phone });
        if (!user) {
            return handleError(res, 400, 'User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return handleError(res, 400, 'Invalid password');
        }

        const [accessToken, refreshToken] = await generateTokens(user._id);
        const id = user._id;
        console.log(id);
        const seller = await Seller.findByIdAndUpdate(id, { $set: { token } });
        console.log(seller);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
        if (call) {
            call.token = token;
            await call.save();
            return res.status(200).json({ message: 'Logged in successfully', userId: user._id, accessToken });
        }
        const roomName = user.shopName;
        // const date = new Date();
        await Call.create({ token, phone, roomName, userId: user._id });
        return res.status(200).json({ message: 'Logged in successfully', userId: user._id, accessToken });
    } catch (error) {
        return handleError(res, 500, 'An error occurred while logging in', error);
    }
};

module.exports.forgetPassword = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return handleError(res, 400, 'Please provide both phone and new password');
        }
        hashedPassword = await bcrypt.hash(password, 10);

        const user = await Seller.findOneAndUpdate({ phone }, { password: hashedPassword });

        if (!user) {
            return handleError(res, 400, 'User not found');
        }

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        return handleError(res, 500, 'An error occurred while updating the password', error);
    }
};
module.exports.logout = (req, res) => {
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' });
    logger.info('Logged out successfully');
    return res.status(200).json({ message: 'Logged out successfully' });
};

async function generateTokens(userId) {
    const accessToken = jwt.sign({ _id: userId }, constants.ACCESS_TOKEN_SECRET, { expiresIn: constants.TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ _id: userId }, constants.REFRESH_TOKEN_SECRET);
    return [accessToken, refreshToken];
}

module.exports.createVideoRoom = async (req, res) => {
    try {
        const { roomName } = req.query;

        if (!roomName) {
            return handleError(res, 400, 'Please provide a roomName');
        }

        const user = await Call.findOne({ roomName });

        if (!user) {
            return res.json({ message: 'Call request not found' });
        }

        const phone = user.phone;
        const call = await Call.findOne({ phone });

        return res.json({ message: 'Call request sent to owner', token: call.token });
    } catch (error) {
        return handleError(res, 500, 'An error occurred while creating the video room', error);
    }
};
