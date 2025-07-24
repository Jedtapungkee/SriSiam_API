const express = require('express');
const { listUsers } = require('../controllers/user');
const router = express.Router();


router.get('/users',listUsers)


module.exports = router;