const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin')
router.get('/allProducts', adminController.getAllProducts )
router.post('/add-product', adminController.postAddProduct)
router.post('/delete/:productId', adminController.postDeleteProduct)

module.exports = router;