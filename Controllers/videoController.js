const Call = require('../Models/call');
const call = require('../Models/call');
const seller = require('../Models/seller');
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
    console.log(roomName);
    // Attempt to find an existing call with the given roomName
    let videoCall = await call.findOne({ roomName: roomName });
    console.log(videoCall);
    if (videoCall) {
        // Update the existing videoCall and save it
        videoCall.isNotified = true;
        await videoCall.save();

        return res.redirect(`https://stealth-frontend-ten.vercel.app/?roomCode=${roomName}`);
        // return res.json({ message: 'Call request sent to owner', isNotified: videoCall.isNotified });
    }

    // If no existing call was found, create a new one
    videoCall = new call({ roomName: roomName, isNotified: true });
    await videoCall.save();
    return res.redirect(`https://stealth-frontend-ten.vercel.app/?roomCode=${roomName}`);

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
    const { isAccepted, isRejected, roomName } = req.query;
    console.log(req.query);
    console.log(isAccepted, isRejected, roomName);
    const user = await call.findOne({ roomName: roomName });
    if (!user) return res.json({ message: 'Call request not found' });
    if (isAccepted) {
        user.isAccepted = true;
        user.isNotified = false;
        user.save();
        return res.json({ message: 'Call request accepted', isAccepted: user.isAccepted });
    }
    user.isRejected = true;
    user.isNotified = false;
    user.save();
    return res.json({ message: 'Call request rejected', isRejected: user.isRejected });

}
module.exports.getCallHistory = async (req, res) => {
    const { roomName } = req.query;
    console.log(roomName);
    
    const user = await call.findOne({ roomName: roomName });
    const date = new Date();
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };
    const formattedDate = date.toLocaleString('en-US', options);
    await Call.findByIdAndUpdate(user._id, { date: formattedDate });
    if (!user) {
        return res.json({ message: 'Call request not found' });
    }
    return res.json({ isAccepted: user.isAccepted, isRejected: user.isRejected, token: user.token });
}
module.exports.showCallHistory = async (req, res) => {
    const { roomName, id } = req.query;

    try {
        const callInstance = await call.findOne({ roomName: roomName });

        if (!callInstance) {
            return res.json({ message: 'Call request not found' });
        }

        const user = await seller.findById(id);

        if (!user) {
            return res.json({ message: 'User not found' });
        }

        user.calls.addToSet(callInstance._id);
        await user.save();

        const userWithResponses = await seller.findById(id).populate({
            path: 'calls',
            select: 'roomName cusNumber date isNotified isRejected isAccepted phone duration'
        });

        return res.json({ message: userWithResponses.calls });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while retrieving call history', error: error.message });
    }
};
module.exports.updatePhone = async (req, res) => {
    const { phone, roomName } = req.query;
    console.log(roomName, phone);

    try {
        const room = await Call.findOneAndUpdate(
            { roomName: roomName }, // Find the document with the specified roomName
            { phone: phone }, // Update the phone field with the new value
        );

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        console.log(room);
        return res.json({ message: "Phone number updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// Helper function: Handle errors during call request
function handleCallRequestError(res, error) {
    const errorMessage = 'Failed to send call request';
    logger.error(errorMessage, error);
    handleErrorResponse(res, 500, errorMessage, error);
}