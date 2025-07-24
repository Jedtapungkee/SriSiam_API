const express = require('express');
const { create, list,remove } = require('../controllers/educationlevel');
const { adminCheck, authCheck } = require('../middlewares/authCheck');
const router = express.Router();


router.post("/education-level",authCheck,adminCheck,create)
router.get("/education-level",list)
router.delete("/education-level/:id",authCheck,adminCheck,remove)

module.exports = router;