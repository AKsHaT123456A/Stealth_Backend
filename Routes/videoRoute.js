const { createRoom, join, sendCallRequest, manageCall } = require('../Controllers/videoController');

const router = require('express').Router();

router.get('/create-room', createRoom);
router.get('/join', join);
router.get('/manage', manageCall);
router.get('/notify', sendCallRequest);
// router.get("/send-call-request",sendCallRequest);

module.exports = router;