const seller = require("../Models/seller");
const constants = require("../Utils/constants");

const profile = async (req, res) => {
    try {
        const { id } = req.params;
        const { shopName } = req.body.shopName;
        const shopLink = `https://stealth-zys3.onrender.com/api/v1/video/join?roomName=${shopName}`;
        await seller.findByIdAndUpdate({ _id: id }, { $set: { shopLink, ...req.body } });
        return res.status(200).json({ message: "Profile Updated" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const getprofile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await seller.findById({ _id: id });
        return res.status(200).json({ message: "Profile Updated", user });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

module.exports = { profile, getprofile };