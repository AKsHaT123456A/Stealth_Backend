const call = require('../Models/call');
const { handleErrorResponse } = require('../Utils/errorHandler');
const logger = require('../Utils/logger');
const io = require('../Utils/socketSetup');

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
    const call = call.findOne({ roomName: roomName });
    if(call) {
        call.isNotified = true;
        call.save();
        return res.json({ message: 'Call request sent to owner', isNotified: call.isNotified });
    }
    await call.create({ roomName: roomName, isNotified: true });

    redirectToVideoRoom(res, roomName);
};

// Send a call request to the room owner
module.exports.sendCallRequest = async (req, res) => {
    const roomName = req.query.roomName;
    const userName = "Akshat"
    try {
        const user = await call.findOne({ roomName: roomName });
        if (!user) return res.json({ message: 'Call request not found' });
        res.json({ message: 'Call request sent to owner', isNotified: user.isNotified, userName: userName });
    } catch (error) {
        handleCallRequestError(res, error);
    }
};

// Helper function: Create a Twilio video room (to be implemented)
async function createVideoRoom(roomName) {
    return `https://stealth-zys3.onrender.com/api/v1/video/join?roomName=${roomName}`;
}


module.exports.manageCall = async (req, res) => {
    const { isAccepted, isRejected, roomName } = req.body;
    console.log(isAccepted, isRejected, roomName);
    const user = await call.findOne({ roomName: roomName });
    if (!user) return res.json({ message: 'Call request not found' });
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
module.exports.getCallHistory = async (req, res) => {
    const { roomName } = req.query;
    console.log(roomName);
    const user = await call.findOne({ roomName: roomName });
    console.log(user);
    if (!user) return res.json({ isRejected: true });

    return res.json({ isAccepted: user.isAccepted, isRejected: user.isRejected });
}
// Helper function: Redirect to the video room page
function redirectToVideoRoom(res, roomName) {
    res.redirect(`https://stealth-frontend-ten.vercel.app/`);
}
// Helper function: Handle errors during call request
function handleCallRequestError(res, error) {
    const errorMessage = 'Failed to send call request';
    logger.error(errorMessage, error);
    handleErrorResponse(res, 500, errorMessage, error);
}
