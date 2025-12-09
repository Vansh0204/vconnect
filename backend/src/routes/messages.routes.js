const express = require('express');
const router = express.Router();
const { getMyMessages, sendMessage } = require('../controllers/messages.controller');

router.get('/me', getMyMessages);
router.post('/send', sendMessage);

module.exports = router;