// jshint esversion:6

const express = require("express");
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const constants = require("./Utils/constants");
const socketSetup = require('./Utils/socketSetup');
const dbconnect = require("./Connections/db");
// const authRoutes = require("./Routes/authRoute");
const videoRoutes = require("./Routes/videoRoute");
const { auth } = require("./Middleware/auth");
const logger = require("./Utils/logger");
const { timingMiddleware } = require("./Middleware/timingRequest");

const app = express();
const server = http.createServer(app);
const apiPrefix = '/api/v1';

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(timingMiddleware);

// Security middlewares
app.use(helmet({
    contentSecurityPolicy: false, // Disabling CSP as it might need further configuration
}));
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} request to ${req.originalUrl}`);
    logger.debug(`Request Headers: ${JSON.stringify(req.headers)}`);
    logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
    next();
});

// Compression middleware
app.use(compression());

// Set up socket connection
socketSetup(server);

// Routes
// Serve index.html for the root route
app.get('/', auth, (req, res) => {
    res.send("Welcome to Liviso!!!")
});
// app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/video`, videoRoutes);

// Connect to the database
dbconnect();

// Start the server
server.listen(constants.PORT, () => {
    logger.info(`Server running at port ${constants.PORT}`);
});
