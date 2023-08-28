const logger = require("./logger");

module.exports.handleErrorResponse = (res, statusCode, message, error) => {
    if (error) {
        logger.error(`Error: ${message}`, error);
        return res.status(statusCode).json({ message, error: error.message });
    } else {
        logger.error(`Error: ${message}`);
        return res.status(statusCode).json({ message });
    }
};

