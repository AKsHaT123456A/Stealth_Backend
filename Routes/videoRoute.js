const { createRoom, join, sendCallRequest, manageCall, getCallHistory } = require('../Controllers/videoController');

const router = require('express').Router();

router.get('/create-room', createRoom);
router.get('/join', join);
router.get('/manage', manageCall);
router.get('/notify', sendCallRequest);
router.post('/call', getCallHistory);
// router.get("/send-call-request",sendCallRequest);

module.exports = router;