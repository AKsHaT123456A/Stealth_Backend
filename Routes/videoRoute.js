const {  createRoom, join, sendCallRequest } = require('../Controllers/videoController');

const router = require('express').Router();

router.get('/create-room',createRoom);
router.get('/join',join);
router.get("/send-call-request",sendCallRequest);

module.exports = router;