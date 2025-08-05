const express = require('express');
const { chatWithBot } = require('../controllers/chatbot');
const router = express.Router();

router.post('/chatbot/message',chatWithBot)


module.exports = router;