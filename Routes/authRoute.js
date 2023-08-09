const { verify, register, login, refresh, logout } = require("../Controllers/authController");


const router = require("express").Router();

router.get("/verify", verify);
router.get("/register", register);
router.get("/login", login);
router.get("/refresh-token", refresh);
router.get("/logout", logout);

module.exports = router;