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
module.exports.join = (req, res) => {
    const roomName = req.query.roomName;

    notifyOwner(roomName);
    redirectToVideoRoom(res, roomName);
};

// Send a call request to the room owner
module.exports.sendCallRequest = async (req, res) => {
    const recipientId = req.body.recipientId;
    const roomName = req.body.roomName;

    try {
        if (!isRegisteredUser(recipientId)) {
            return handleRecipientNotRegistered(res);
        }

        await notifyOwner(roomName);
        res.json({ message: 'Call request sent to owner' });
    } catch (error) {
        handleCallRequestError(res, error);
    }
};

// Helper function: Create a Twilio video room (to be implemented)
async function createVideoRoom(roomName) {
    // Uncomment and integrate Twilio video room creation
    // const room = await client.video.rooms.create({
    //     recordParticipantsOnConnect: true,
    //     statusCallback: 'http://example.org',
    //     type: 'peer-to-peer',
    //     uniqueName: roomName
    // });

    return `http://localhost:3000/api/v1/video/join?roomName=${roomName}`;
}

// // Helper function: Notify the owner about room joining
// function notifyOwner(roomName) {
//     const owner = roomOwners[rooms[roomName].owner]; // Assuming you have a roomOwners object
//     io.notifyOwner(owner.id, roomName);
// }

// // Helper function: Redirect to the video room page
// function redirectToVideoRoom(res, roomName) {
//     res.redirect(`http://localhost:5173/room/${roomName}`);
// }

// // Helper function: Check if the recipient is a registered user
// function isRegisteredUser(userId) {
//     return roomOwners[userId]?.registered || false;
// }

// // Helper function: Handle recipient not registered error
// function handleRecipientNotRegistered(res) {
//     return handleErrorResponse(res, 403, 'Recipient is not a registered user');
// }

// // Helper function: Handle errors during room creation
// function handleRoomCreationError(res, roomName, error) {
//     const errorMessage = `Failed to create room '${roomName}'`;
//     logger.error(errorMessage, error);
//     handleErrorResponse(res, 500, errorMessage, error);
// }

// // Helper function: Handle errors during call request
// function handleCallRequestError(res, error) {
//     const errorMessage = 'Failed to send call request';
//     logger.error(errorMessage, error);
//     handleErrorResponse(res, 500, errorMessage, error);
// }
