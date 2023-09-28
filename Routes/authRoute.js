const { register, login, refresh, logout, createVideoRoom, forgetPassword } = require("../Controllers/authController");
const { getProfile, updateProfile, feedback } = require("../Controllers/profileController");
const { apiLimiter } = require("../Utils/rateLimiter");


const router = require("express").Router();

// router.get("/verify", verify);
router.post("/register", register);
router.post("/login", apiLimiter, login);
router.post("/forget-password", forgetPassword);
// router.get("/refresh-token", refresh);
router.get("/logout", logout);
router.post("/profile/:id", updateProfile);
router.get("/getprofile/:id", getProfile);
router.get("/token", createVideoRoom)
router.post("/feedback", feedback)
module.exports = router;