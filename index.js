// jshint esversion:6

// Importing modules
const express = require("express");
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const http = require('http');
const socketIO = require('socket.io');
const { generateToken04 } = require('./Utils/genToken');
const constants = require("./Utils/constants");
const dbconnect = require("./Connections/db");
const authRoutes = require("./Routes/authRoute");
const { auth } = require("./Middleware/auth");


// Initializing the app and server state
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const apiPrefix = '/api/v1';

// !Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Security middlewares
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(helmet.contentSecurityPolicy());

//!Socket connection setup
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('click', async () => {
        try {
            console.log('User clicked on the link');
            const userId = socket.id;
            const token = await generateToken04(constants.APP_ID, userId, constants.APP_SECRET, 3600, '');
            console.log('Token generated:', token);

            socket.emit('token', token);
        } catch (error) {
            console.error('Error generating token:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Routes
app.get("/", auth, (req, res) => {
    res.send("Welcome!!!!");
});
app.use(`${apiPrefix}/auth`, authRoutes);

// Connect to the database
dbconnect();

// Start the server
server.listen(constants.PORT, () => {
    console.log(`Server running at port ${constants.PORT}`);
});
