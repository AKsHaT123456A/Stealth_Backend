const jwt = require('jsonwebtoken');

module.exports.auth = function (req, res, next) {
    const accessToken = req.headers['auth-token']; // Get the access token from the headers
    const refreshToken = req.cookies.refreshToken; // Get the refresh token from the cookies
    console.log(accessToken, refreshToken);
    if (!accessToken && !refreshToken) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        if (accessToken) {
            const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.user = verified;
            return next();
        } else if (refreshToken) {
            const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            req.user = verified;

            // Generate a new access token and send it in the response headers
            const newAccessToken = jwt.sign({ _id: verified._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.setHeader('new-access-token', newAccessToken);

            return next();
        }
    } catch (error) {
        return res.status(400).json({ message: 'Invalid Token' });
    }
};
