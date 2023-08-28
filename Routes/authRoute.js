const { verify, register, login, refresh, logout } = require("../Controllers/authController");
const { apiLimiter } = require("../Utils/rateLimiter");


const router = require("express").Router();

router.get("/verify", verify);
router.get("/register", register);
router.get("/login",apiLimiter, login);
router.get("/refresh-token", refresh);
router.get("/logout", logout);

module.exports = router;