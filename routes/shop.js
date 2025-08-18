const path = require('path');

const express = require('express');


const shopController = require('../controllers/shop')
const router = express.Router();
//user
router.get('/home',shopController.getViewHome);

router.get('/allProducts',shopController.getAllProducts)

router.get('/products/:productId',shopController.getViewProductDetail);

router.post('/cart', shopController.postAddProductToCart)

router.get('/viewCart', shopController.getViewCart)


module.exports = router;
