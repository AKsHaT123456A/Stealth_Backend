const { register, login, refresh, logout } = require("../Controllers/authController");
const { profile, getprofile } = require("../Controllers/profileController");
const { apiLimiter } = require("../Utils/rateLimiter");


const router = require("express").Router();

// router.get("/verify", verify);
router.get("/register", register);
router.get("/login", apiLimiter, login);
router.get("/refresh-token", refresh);
router.get("/logout", logout);
router.post("/profile/:id", profile);
router.get("/getprofile/:id", getprofile);

module.exports = router;