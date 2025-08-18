const Product = require('../models/product')

exports.getAllProducts = (req,res,next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      role: 'admin',
      path: '/products',
      pageTitle: 'home'
    })
  })
};

exports.postAddProduct = (req,res,next)=>{

};

exports.postDeleteProduct = (req,res,next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  Product.deleteProduct(prodId);
  res.render('shop/home', {
    pageTitle: ' Home Admin',
    role: 'admin',
    path: '/product'
  })
};
