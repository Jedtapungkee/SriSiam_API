const express = require('express');
const router = express.Router();
const { adminCheck, authCheck } = require("../middlewares/authCheck");
const { changeStatus, getOrdersAdmin } = require('../controllers/admin.');

router.put("/admin/order-status", authCheck, adminCheck, changeStatus);
router.get("/admin/orders", authCheck, adminCheck, getOrdersAdmin);

module.exports = router;