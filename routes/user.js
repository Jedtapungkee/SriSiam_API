const express = require('express');
const { listUsers, changeStatus, changeRole, userCarts } = require('../controllers/user');
const router = express.Router();
const { adminCheck, authCheck } = require('../middlewares/authCheck');

router.get('/users',listUsers)
router.post('/change-status',authCheck,adminCheck,changeStatus)
router.post('/change-role',authCheck,adminCheck,changeRole)
router.post('/user/cart', authCheck, userCarts)




module.exports = router;