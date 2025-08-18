const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin')
router.get('/allProducts', adminController.getAllProducts )
router.get('/add-product', adminController.getAddProduct)
router.post('/add-product', adminController.postNewProduct)
router.post('/delete/:productId', adminController.postDeleteProduct)
router.get('/editProduct/:productId', adminController.getViewEditProduct)
router.post('/editProduct', adminController.postEditProduct)
module.exports = router;