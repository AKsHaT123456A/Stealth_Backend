const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const constants = require('../Utils/constants');
const Seller = require('../Models/seller');
const logger = require('../Utils/logger');
const { handleErrorResponse } = require('../Utils/errorHandler');
const emailer = require('../Utils/sendPassword');
const Call = require('../Models/call'); // Renamed to avoid variable name conflict

const handleError = (res, statusCode, message, error) => {
    logger.error(message, error);
    return handleErrorResponse(res, statusCode, message, error);
};

module.exports.register = async (req, res) => {
    try {
        const { phone, email } = req.body;

        if (!phone || !password) {
            return handleError(res, 400, 'Please provide both phone and password');
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Seller({ phone, password: hashedPassword });
        

        await user.save();
        emailer(email, password); // Ensure this function is implemented securely
        logger.info('User created successfully');
        return res.status(201).json({ message: 'User created successfully', userId: user._id });
    } catch (error) {
        return handleError(res, 500, 'An error occurred while creating the user', error);
    }
};

module.exports.login = async (req, res) => {
    try {
        const { phone, password, token } = req.body;
        console.log(phone,password);
        console.log(token);

        if (!phone || !password) {
            return handleError(res, 400, 'Please provide both phone and password');
        }

        const user = await Seller.findOne({ phone }, { _id: 1, password: 1 }).lean();
        const call = await Call.findOneAndUpdate({ phone });
console.log(call);
        if (call) {
            call.token = token;
            await call.save();
        }

        await Call.create({ token, phone });

        if (!user) {
            return handleError(res, 400, 'User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return handleError(res, 400, 'Invalid password');
        }

        const [accessToken, refreshToken] = await generateTokens(user._id);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
        return res.status(200).json({ message: 'Logged in successfully', userId: user._id, accessToken });
    } catch (error) {
        return handleError(res, 500, 'An error occurred while logging in', error);
    }
};

module.exports.refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return handleError(res, 401, 'Refresh token required');
        }

        const newAccessToken = await refreshAccessToken(refreshToken);

        logger.info('Access token refreshed');
        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        return handleError(res, 500, 'An error occurred while refreshing token', error);
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

async function refreshAccessToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, constants.REFRESH_TOKEN_SECRET);
    return jwt.sign({ _id: decoded._id }, constants.ACCESS_TOKEN_SECRET, { expiresIn: constants.TOKEN_EXPIRATION });
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
