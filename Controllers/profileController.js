const seller = require("../Models/seller");
const constants = require("../Utils/constants");

const profile = async (req, res) => {
    try {
        const { id } = req.params;
        const shopName = req.body.shopName;
        const updatedShopName = shopName.charAt(0).toUpperCase() + shopName.slice(1);
        
        const sell = await seller.findById({ id });
        if (sell) {
            const shopLink = sell.shopLink;
            return res.status(200).json({ message: "Profile is Updated" });
        }
        const shopLink = `https://stealth-zys3.onrender.com/api/v1/video/join?roomName=${updatedShopName}`;
        await seller.findByIdAndUpdate({ _id: id }, { $set: { shopLink: shopLink, ...req.body } });
        return res.status(200).json({ message: "Profile Updated" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const getprofile = async (req, res) => {
    try {
        const { id } = req.params;

        // Assuming 'seller' is your Mongoose model
        const user = await seller.findById(id)
            .populate({
                path: 'calls',
                select: '-_id -__v', // Exclude _id and __v fields
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Profile Retrieved", user });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


module.exports = { profile, getprofile };