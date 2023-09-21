const { register, login, refresh, logout, createVideoRoom } = require("../Controllers/authController");
const { profile, getprofile } = require("../Controllers/profileController");
const { apiLimiter } = require("../Utils/rateLimiter");


const router = require("express").Router();

// router.get("/verify", verify);
router.post("/register", register);
router.post("/login", apiLimiter, login);
router.get("/refresh-token", refresh);
router.get("/logout", logout);
router.post("/profile/:id", profile);
router.get("/getprofile/:id", getprofile);
router.get("/token",createVideoRoom)

module.exports = router;