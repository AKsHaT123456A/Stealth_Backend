const Call = require('../Models/call');
const Seller = require('../Models/seller');
const { handleErrorResponse } = require('../Utils/errorHandler');

async function createVideoRoom(roomName, id) {
    return `https://stealth-zys3.onrender.com/api/v1/video/join/${id}?roomName=${roomName}`;
}

// Function to find a call by room name
async function findCallByRoomName(roomName, phone) {
    return await Call.findOne({ roomName: roomName, phone: phone });
}

// Create a video room
module.exports.createRoom = async (req, res) => {
    const roomName = req.query.roomName;

    try {
        const seller = await Room.findOne({ shopName: roomName });
        const id = seller.id;
        const joinLink = await createVideoRoom(roomName, id);
        res.json({ joinLink });
    } catch (error) {
        handleErrorResponse(res, roomName, error);
    }
};

// Join the video room and notify the owner
module.exports.join = async (req, res) => {

    const roomName = req.query.roomName;
    const id = req.params.id;
    const seller = await Seller.findById(id).select('+phone');
    console.log(seller);
    const phone = seller.phone;
    console.log(phone);
    res.redirect(`https://starlit-dasik-f4ad0d.netlify.app/?roomCode=${roomName}&id=${id}&phone=${phone}`);
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
    const { isAccepted, isRejected, roomName, id, phone } = req.query;
    console.log(roomName, id);

    try {
        const user = await Call.findOne({ roomName, userId: id, phone: phone });
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: 'Call request not found', roomName, id, phone });
        }

        user.isAccepted = Boolean(isAccepted);
        user.isRejected = Boolean(isRejected);

        await user.save();

        const message = isAccepted ? 'Call request accepted' : 'Call request rejected';

        res.json({ message, isAccepted: user.isAccepted, });
    } catch (error) {
        handleErrorResponse(res, roomName, error);
    }
};

// Get call history
module.exports.getCallHistory = async (req, res) => {
    const { roomName, id, phone } = req.query;

    try {
        if (!roomName) {
            return res.json({ message: 'Room name not found' });
        }

        // Find the call history by roomName, userId, and phone
        let callHistory = await Call.findOne({ roomName, userId: id, phone });

        // Get the current date and time formatted as "4 Oct 2023, 7:53:38 pm" in IST (Indian Standard Time)
        const currentDate = new Date().toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZone: 'Asia/Kolkata',
        });

        if (!callHistory) {
            // If no call history exists, create a new one
            callHistory = new Call({
                date: currentDate,
                roomName,
                userId: id,
                phone
            });
            await callHistory.save();
            return res.json({ message: 'Call is created' });
        }

        // Update the date field in the call history record
        callHistory.date = currentDate;
        callHistory.phone = phone;
        await callHistory.save();

        // Find the seller information based on roomName
        const seller = await Seller.findOne({ shopName: roomName });

        if (!seller) {
            return res.json({ message: 'Seller not found' });
        }

        // Respond with the relevant information
        res.json({
            isAccepted: callHistory.isAccepted,
            isRejected: callHistory.isRejected,
            token: seller.token,
            isOpen: seller.isOpen
        });
    } catch (error) {
        handleErrorResponse(res, roomName, error);
    }
};

// Show call history
module.exports.showCallHistory = async (req, res) => {
    const { roomName, id } = req.query;
    try {
        if (!roomName) {
            return res.json({ message: 'Room name not found' });
        }

        // Find all call history documents with the specified roomName
        const callHistoryList = await Call.find({ roomName, userId: id });
        console.log(callHistoryList);
        if (!callHistoryList || callHistoryList.length === 0) {
            return res.status(400).json({ message: [], roomName, id });
        }
        // Find the seller information based on roomName
        const seller = await Seller.findById(id);

        if (!seller) {
            return res.jstatus(400).json({ message: 'Seller not found' });
        }

        // Add each call history document to the user's calls Set
        for (const callHistory of callHistoryList) {
            seller.calls.addToSet(callHistory);
        }

        // Save the updated user document
        await seller.save();
        // Respond with the relevant information
        return res.status(200).json({
            callHistoryList
        });
    } catch (error) {
        handleErrorResponse(res, roomName, error);
    }
};

// Update phone number
module.exports.updatePhone = async (req, res) => {
    const { id, roomName, duration, token, phone } = req.query;
    console.log(duration);
    try {
        let videoCall = await Call.findOne({ roomName, userId: id, phone });
        console.log(videoCall);
        if (videoCall) {
            const _id = videoCall._id;
            const updateObject = {
                duration,
                roomName
            };
            await Call.findByIdAndUpdate({ _id }, { $set: updateObject });
            return res.json({ message: 'Phone number updated successfully' });
        }
        videoCall = new Call({ roomName, phone, duration, token, userId: id });
        await videoCall.save();
        // console.log(videoCall);
        return res.json({ message: 'Phone number saved successfully' });
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
    const { roomName, phone } = req.params;
    try {
        const room = await Call.findOneAndUpdate(
            { roomName: roomName, userId: phone },
            { $set: { isAccepted: false, isRejected: false } },
        );
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        console.log(room);

        res.json({ message: "reset successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}