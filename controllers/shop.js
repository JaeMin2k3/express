const Product = require('../models/product');
const Cart = require('../models/cart');
// trang home
exports.getViewHome = (req,res,next) => {
  res.render('shop/home',{
    pageTitle: 'home',
    path: 'user/home',
    role: 'user'
  });
};

//lay toan bo san pham
exports.getAllProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: 'user/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
      role: 'user'
    });
  });
}; 
// xem chi tiet san pham
exports.getViewProductDetail = (req,res,next) => {
  const productId = req.params.productId;
   Product.findById(productId, product =>{
    console.log(product)
    res.render('shop/product-detail',{
    role: 'user',
    product: product,
    pageTitle: 'Product Detail',
    path: 'user/products/detail'
    });
  });
}; 

exports.postAddProductToCart = (req,res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  let cartProduct = new Product();
  console.log(cartProduct);
  Product.findById(prodId, (product)=> {
    cartProduct = product;
    let price = Number (cartProduct.price)
    Cart.addProdudctToCart(prodId, cartProduct.title, price);
    res.render('shop/cart',{
      product: cartProduct,
      path:'/cart',
      role:'user'
    })
  });
}

exports.getViewCart = (req,res,next) => {
  Cart.getAllCart(cart => {
    console.log(cart);
    res.render('shop/cart', {
    cart: cart,
    role: 'user',
    path: '/user/cart'
  })
  });
}
