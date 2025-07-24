const express = require('express');
const { listUsers, changeStatus } = require('../controllers/user');
const router = express.Router();


router.get('/users',listUsers)
router.post('/change-status',changeStatus)

module.exports = router;