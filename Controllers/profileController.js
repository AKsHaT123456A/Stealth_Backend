const Seller = require("../Models/seller");
const constants = require("../Utils/constants");

// Update seller's profile
const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { shopName } = req.body;

        // Capitalize the first letter of shopName
        const updatedShopName = shopName.charAt(0).toUpperCase() + shopName.slice(1);

        // Construct shopLink
        const shopLink = `https://stealth-zys3.onrender.com/api/v1/video/join?roomName=${updatedShopName}`;

        // Update seller's profile
        await Seller.findByIdAndUpdate({ _id: id }, { $set: { shopLink, ...req.body } });

        return res.status(200).json({ message: "Profile Updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

// Get seller's profile
const getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve seller's profile including populated calls
        const user = await Seller.findById(id)
            .populate({
                path: 'calls',
                select: '-_id -__v',
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Profile Retrieved", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving profile", error: error.message });
    }
};

module.exports = { updateProfile, getProfile };
