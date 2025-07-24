const express = require('express');
const router = express.Router();

const { adminCheck, authCheck } = require('../middlewares/authCheck');
const { createProduct, list, read, update, remove, listby,searchFilters } = require('../controllers/product');

router.post('/product',authCheck,adminCheck,createProduct)
router.get('/products/:count',list)
router.get('/product/:id', read);
router.put('/product/:id', update);
router.delete('/product/:id', authCheck, adminCheck,remove);
router.post('/productby',listby)
router.post('/search/filters',searchFilters)


module.exports = router;