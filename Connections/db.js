const mongoose = require("mongoose");
const logger = require("../Utils/logger");
const constants = require("../Utils/constants");

const dbconnect = async () => {
    try {
        await mongoose.connect(constants.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: constants.DB_MAX_POOL_SIZE, // Set the maximum connection pool size
        });

        logger.info('Connected to the database');

        // Close the mongoose connection when the Node.js process is terminated
        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                logger.info('Mongoose connection closed due to application termination');
                process.exit(0);
            });
        });
    } catch (error) {
        logger.error('Error connecting to the database:', error);
    }
};

module.exports = dbconnect;
