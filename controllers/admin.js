const Product = require('../models/product')
const Cart = require('../models/cart')
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

exports.getAddProduct = (req,res,next)=>{
  res.render('admin/up-add-product', {
    path:'/admin/add-product',
    product: {},
    role: 'admin',
    pageTitle: 'addProduct',
    editing: false
  });
};

exports.postDeleteProduct = (req,res,next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  Product.deleteProduct(prodId);
  Product.findById(prodId, product => {
    Cart.deleteProductInCart(product);
  })
  res.render('shop/home', {
    pageTitle: ' Home Admin',
    role: 'admin',
    path: '/product'
  })
};

exports.postNewProduct = (req,res, next) => {
  let newProduct = new Product(null, req.body.title, null, req.body.description, req.body.price);
  console.log(newProduct);
  newProduct.save();
  res.render('shop/home',{
    pageTitle: 'product',
    role: 'admin',
    path: '/home'
  })
}

 exports.getViewEditProduct = (req,res,next) => {
  const prodId = req.params.productId;
    Product.findById(prodId,(product) => {
      res.render('admin/up-add-product', {
        product: product,
        role: 'admin',
        pageTitle: '/addProduct',
        path: '/addProduct',
        editing: true
      })
    }
  );
 };

 exports.postEditProduct = (req, res, next) => {
  const editProduct = new Product(req.body.id, req.body.title, null, req.body.description, req.body.price);
  Product.editProduct(editProduct.id, editProduct);
  Product.fetchAll(newProduct => {
  res.render('shop/product-list',{
    prods: newProduct,
    pageTitle: 'products',
    role: 'admin',
    path: '/admin/allProducts'
    })
  })
}