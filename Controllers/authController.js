const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const constants = require('../Utils/constants');
const Seller = require('../Models/seller');
const logger = require('../Utils/logger');
const { handleErrorResponse } = require('../Utils/errorHandler');
const emailer = require('../Utils/sendPassword');

// Create a reusable function for handling errors
const handleError = (res, statusCode, message, error) => {
    logger.error(message, error);
    return handleErrorResponse(res, statusCode, message, error);
};

// Register a new user
module.exports.register = async (req, res) => {
    try {
        const { name, phone, email } = req.body;

        if (!phone) {
            return handleError(res, 400, 'Please provide a phone number');
        }

        const password = 12345;
        const user = new Seller({ phone, password});

        await user.save();
        emailer(email, password);
        logger.info('User created successfully');
        return res.status(201).json({ message: 'User created successfully' ,userId: user._id});
    } catch (error) {
        return handleError(res, 500, 'An error occurred while creating the user', error);
    }
};

// Login
module.exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return handleError(res, 400, 'Please provide a phone number and password');
        }

        const user = await Seller.findOne({ phone }, { _id: 1, password: 1 }).lean();

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

// Refresh access token
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

// Logout
module.exports.logout = (req, res) => {
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' });
    logger.info('Logged out successfully');
    return res.status(200).json({ message: 'Logged out successfully' });
};

// Create a function to generate access and refresh tokens
async function generateTokens(userId) {
    const accessToken = jwt.sign({ _id: userId }, constants.ACCESS_TOKEN_SECRET, { expiresIn: constants.TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ _id: userId }, constants.REFRESH_TOKEN_SECRET);
    return [accessToken, refreshToken];
}

// Create a function to refresh the access token
async function refreshAccessToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, constants.REFRESH_TOKEN_SECRET);
    return jwt.sign({ _id: decoded._id }, constants.ACCESS_TOKEN_SECRET, { expiresIn: constants.TOKEN_EXPIRATION });
}
