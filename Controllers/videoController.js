const call = require('../Models/call');
const { handleErrorResponse } = require('../Utils/errorHandler');
const logger = require('../Utils/logger');
const io = require('../Utils/socketSetup');
// const roomOwners = require('./roomOwners'); // Import the simulated roomOwners data or your data source

// Create a video room
module.exports.createRoom = async (req, res) => {
    const roomName = req.query.roomName;

    try {
        const joinLink = await createVideoRoom(roomName);
        res.json({ joinLink });
    } catch (error) {
        handleErrorResponse(res, roomName, error);
    }
};

// Join the video room and notify the owner
module.exports.join = async (req, res) => {
    const roomName = req.query.roomName;
    const user = await call.create({ roomName: roomName, isNotified: true });

    // notifyOwner(roomName);
    redirectToVideoRoom(res, roomName);
};

// Send a call request to the room owner
module.exports.sendCallRequest = async (req, res) => {
    const roomName = req.body.roomName;

    try {
        const user = await call.findOne({ roomName: roomName });
        // if (!isRegisteredUser(recipientId)) {
        //     return handleRecipientNotRegistered(res);
        // }

        // await notifyOwner(roomName);
        res.json({ message: 'Call request sent to owner', isNotified: user.isNotified });
    } catch (error) {
        handleCallRequestError(res, error);
    }
};

// Helper function: Create a Twilio video room (to be implemented)
async function createVideoRoom(roomName) {
    return `https://stealth-zys3.onrender.com/api/v1/video/join?roomName=${roomName}`;
}

// Helper function: Notify the owner about room joining
function notifyOwner(roomName) {
    const owner = roomOwners[rooms[roomName].owner]; // Assuming you have a roomOwners object
    io.notifyOwner(owner.id, roomName);
}


module.exports.manageCall = async (req, res) => {
    const { isAccepted, isRejected, roomName } = req.body;
    const user = await call.findOne({ roomName: roomName });

    if (isAccepted) {
        user.isAccepted = true;
        user.isNotified = false;
        user.save();
        return res.json({ message: 'Call request accepted', isAccepted: user.isAccepted });
    }
    if (isRejected) {
        user.isRejected = true;
        user.isNotified = false;
        user.save();
        return res.json({ message: 'Call request rejected', isRejected: user.isRejected });
    }

}
// Helper function: Redirect to the video room page
function redirectToVideoRoom(res, roomName) {
    res.redirect(`http://localhost:5173/room/${roomName}`);
}

// Helper function: Check if the recipient is a registered user
function isRegisteredUser(userId) {
    return roomOwners[userId]?.registered || false;
}

// Helper function: Handle recipient not registered error
function handleRecipientNotRegistered(res) {
    return handleErrorResponse(res, 403, 'Recipient is not a registered user');
}

// Helper function: Handle errors during room creation
function handleRoomCreationError(res, roomName, error) {
    const errorMessage = `Failed to create room '${roomName}'`;
    logger.error(errorMessage, error);
    handleErrorResponse(res, 500, errorMessage, error);
}

// Helper function: Handle errors during call request
function handleCallRequestError(res, error) {
    const errorMessage = 'Failed to send call request';
    logger.error(errorMessage, error);
    handleErrorResponse(res, 500, errorMessage, error);
}
