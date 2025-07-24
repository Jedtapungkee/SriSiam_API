const express = require('express');
const { createCategory, listCategories, deleteCategory } = require('../controllers/category');
const { adminCheck, authCheck } = require('../middlewares/authCheck');
const router = express.Router();


router.post("/category",authCheck,adminCheck,createCategory)
router.get("/category",listCategories)
router.delete("/category/:id",authCheck,adminCheck,deleteCategory)

module.exports = router;