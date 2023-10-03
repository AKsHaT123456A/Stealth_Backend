const { createRoom, join, sendCallRequest, manageCall, getCallHistory, showCallHistory, updatePhone, reset, } = require('../Controllers/videoController');

const router = require('express').Router();

router.get('/create-room', createRoom);
router.get('/join/:id', join);
router.post('/manage', manageCall);
router.get('/notify', sendCallRequest);
router.get('/call', getCallHistory);
router.get("/getCalls",showCallHistory);
router.get("/reset/:roomName/:phone",reset);
router.get("/getCallDetails",updatePhone);
// router.get("/send-call-request",sendCallRequest);

module.exports = router;