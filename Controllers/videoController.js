const Call = require('../Models/call');
const Seller = require('../Models/seller');
const { handleErrorResponse } = require('../Utils/errorHandler');

async function createVideoRoom(roomName) {
    return `https://stealth-zys3.onrender.com/api/v1/video/join?roomName=${roomName}`;
}

// Function to find a call by room name
async function findCallByRoomName(roomName) {
    return await Call.findOne({ roomName: roomName });
}

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

    try {
        let videoCall = await findCallByRoomName(roomName);

        if (!videoCall) {
            videoCall = new Call({ roomName, isNotified: true });
            await videoCall.save();
        } else {
            videoCall.isNotified = true;
            await videoCall.save();
        }

        res.redirect(`https://starlit-dasik-f4ad0d.netlify.app/?roomCode=${roomName}`);
    } catch (error) {
        handleErrorResponse(res, roomName, error);
    }
};

// Send a call request to the room owner
module.exports.sendCallRequest = async (req, res) => {
    const roomName = req.query.roomName;

    try {
        const user = await findCallByRoomName(roomName);

        if (!user) {
            return res.json({ message: 'Call request not found' });
        }

        res.json({ message: 'Call request sent to owner', isNotified: user.isNotified, userName: userName });
    } catch (error) {
        handleErrorResponse(res, roomName, error);
    }
};

// Manage call request
module.exports.manageCall = async (req, res) => {
    const { isAccepted, isRejected, roomName } = req.query;

    try {
        const user = await findCallByRoomName(roomName);

        if (!user) {
            return res.json({ message: 'Call request not found' });
        }

        user.isAccepted = Boolean(isAccepted);
        user.isRejected = Boolean(isRejected);
        user.isNotified = false;

        await user.save();

        const message = isAccepted ? 'Call request accepted' : 'Call request rejected';

        res.json({ message, isAccepted: user.isAccepted });
    } catch (error) {
        handleErrorResponse(res, roomName, error);
    }
};

// Get call history
module.exports.getCallHistory = async (req, res) => {
    const { roomName } = req.query;

    try {
        if (!roomName) {
            return res.json({ message: 'Room name not found' });
        }
        const user = await findCallByRoomName(roomName);

        if (!user) {
            return res.json({ message: 'Call request not found' });
        }

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
        const formattedDate = date.toLocaleString('en-In', options);
        await Call.findByIdAndUpdate(user.id, { date: formattedDate });
        const seller = await Seller.findOne({ roomName });

        res.json({ isAccepted: user.isAccepted, isRejected: user.isRejected, token: user.token, isOpen: seller.isOpen });
    } catch (error) {
        handleErrorResponse(res, roomName, error);
    }
};

// Show call history
module.exports.showCallHistory = async (req, res) => {
    const { roomName, id } = req.query;

    try {
        const callInstance = await findCallByRoomName(roomName);

        if (!callInstance) {
            return res.json({ message: 'Call request not found' });
        }

        const user = await Seller.findById(id);

        if (!user) {
            return res.json({ message: 'User not found' });
        }

        user.calls.addToSet(callInstance._id);
        await user.save();

        const userWithResponses = await seller.findById(id).populate({
            path: 'calls',
            select: 'roomName cusNumber date isNotified isRejected isAccepted phone duration'
        });

        res.json({ message: userWithResponses.calls });
    } catch (error) {
        handleErrorResponse(res, roomName, error);
    }
};

// Update phone number
module.exports.updatePhone = async (req, res) => {
    const { phone, roomName, duration } = req.query;
    console.log(duration);
    try {
        const room = await Call.findOneAndUpdate(
            { roomName: roomName },
            { $set: { phone, duration } },
        );
        console.log(room);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json({ message: "Phone number updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
module.exports.isOpenFunction = async (req, res) => {
    const { id } = req.params;
    const { isOpen } = req.query;
    try {
        const seller = await Seller.findByIdAndUpdate({ _id: id }, { $set: { isOpen } });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        res.json({ message: "Status updated successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
module.exports.reset = async (req, res) => {
    const { roomName, phone } = req.query;
    try {
        const room = await Call.findOneAndUpdate(
            { roomName: roomName, phone: phone },
            { $set: { isAccepted: false, isRejected: false } },
        );
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json({ message: "reset successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

}