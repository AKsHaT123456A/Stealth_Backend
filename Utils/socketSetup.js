// socketSetup.js
const socketIO = require('socket.io');
const { generateToken04 } = require('./genToken');
const constants = require('./constants');

module.exports = (server) => {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        logger.info(`A user connected: ${socket.id}`);

        socket.on('click', async () => {
            try {
                logger.info(`User ${socket.id} clicked on the link`);

                const userId = socket.id;
                const token = await generateToken04(constants.APP_ID, userId, constants.APP_SECRET, 3600, '');

                logger.info(`Token generated for ${socket.id}: ${token}`);
                socket.emit('token', token);
            } catch (error) {
                logger.error(`Error generating token for ${socket.id}: ${error.message}`);
                socket.emit('tokenError', { message: 'Token generation failed', error: error.message });
            }
        });

        socket.on('joinRoom', (roomName) => {
            socket.join(roomName);
            logger.info(`User ${socket.id} joined room ${roomName}`);
        });

        // Function to notify the owner about the call request
        socket.notifyOwner = (ownerId, senderId, roomName) => {
            // Emit the call request event to the owner
            io.to(ownerId).emit('callRequest', { senderId, roomName });
        };

        socket.on('sendMessage', (roomName, message) => {
            logger.info(`User ${socket.id} sent a message in room ${roomName}: ${message}`);
            // Broadcast the message to all users in the room
            io.to(roomName).emit('message', { user: socket.id, message });
        });

        socket.on('disconnect', () => {
            logger.info(`User ${socket.id} disconnected`);
        });
    });
};
