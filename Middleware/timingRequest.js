const logger = require("../Utils/logger");

// Custom Middleware for Timing Requests
module.exports.timingMiddleware = (req, res, next) => {
    const start = performance.now();
    res.on('finish', () => {
        const end = performance.now();
        const duration = end - start;
        logger.info(`Request to ${req.originalUrl} took ${duration}ms`);
    });
    next();
};