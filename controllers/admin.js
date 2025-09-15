const Product = require('../models/product')
const Cart = require('../models/cart')
exports.getAllProducts = async (req,res,next) => { 
   req.user.getProducts().then(products => {
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

exports.postDeleteProduct = async (req,res,next) => {
  const prodId = req.params.productId;
  await Product.destroy({
  where: { id : prodId}  
  });
  const products = await req.user.getProducts();
    return res.render('shop/product-list', {
      prods: products,
      pageTitle: 'products',
      role: 'admin',
      path: '/admin/allProducts'
    });
  
};

exports.postNewProduct = (req,res, next) => {
  req.user
  .createProduct({
    title: req.body.title,
    price: req.body.price,
    imgUrl: req.body.imgUrl,
    description: req.body.description
  });
  res.render('shop/home',{
    pageTitle: 'product',
    role: 'admin',
    path: '/home'
  })
}

 exports.getViewEditProduct = async (req,res,next) => {
  const prodId = req.params.productId;
  console.log(prodId);
    req.user.getProducts({where: {id: prodId}}).then(product =>
      res.render('admin/up-add-product', {
        product: product[0],
        role: 'admin',
        pageTitle: '/addProduct',
        path: '/addProduct',
        editing: true
      }));   
 };

 exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.id;
  const products = await req.user.getProducts({ where: { id: prodId } });
  await products[0].update({
    tile: req.body.tile,
    price: req.body.price,
    description: req.body.description,
    imgUrl: req.body.imgUrl
  })
  const newProducts = await req.user.getProducts();
    return res.render('shop/product-list', {
      prods: newProducts,
      pageTitle: 'products',
      role: 'admin',
      path: '/admin/allProducts'
    });
}