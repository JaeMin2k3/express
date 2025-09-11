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
exports.getAllProducts = async (req, res, next) => {
    req.user.getProducts().then(product => {
      res.render('shop/product-list', {
      prods: product,
      pageTitle: 'Shop',
      path: 'user/products',
      hasProducts: product.length > 0,
      activeShop: true,
      productCSS: true,
      role: 'user'
    
    })})
    
}; 
// xem chi tiet san pham
exports.getViewProductDetail = async (req,res,next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  req.user.getProducts({where: {id: prodId}}).then(product => { 
    console.log(product[0]);
    res.render('shop/product-detail',{
    role: 'user',
    product: product[0],
    pageTitle: 'Product Detail',
    path: 'user/products/detail'
    });
  })  
   

}; 

exports.postAddProductToCart = async (req, res, next) => {
  try {
    const productId = req.body.prodId;
    console.log(productId);
    const cart = await req.user.getCart();
    let newQty = 1;
    if(cart){
      const productsInCart = await cart.getProducts({ where: { id: productId } });

      

      if (productsInCart.length > 0) {
        const product = productsInCart[0];
        const oldQty = product.cartItem.quantity || 0;
        newQty = oldQty + 1;
        await cart.addProduct(product, { through: { quantity: newQty } });
      } else {
        const product = await Product.findByPk(productId);
        await cart.addProduct(product, { through: { quantity: newQty } });
      }
    }else{
      const newCart = await req.user.createCart();
      const product = await Product.findByPk(productId);
      await newCart.addProduct(product, { through: { quantity: newQty } });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};



exports.deleteCartItem = async (req,res, next) => {
  const prodId = req.params.productId;
  await Cart.destroy({where: {id: prodId}});
  let totalPrice = 0;
  const cart = await Cart.findAll();
    return res.render('shop/cart', {
    cart: cart,
    totalPrice: totalPrice,
    role: 'user',
    path: '/user/cart'
     })
  };
   

exports.getViewCart = async(req,res, next) => {
  const cart = await req.user.getCart();
  console.log(cart);
  if(cart){
    cart.getProducts().then(products => {
      res.render('shop/cart',{
      cart: products,
      role: 'user',
      tiltle: 'Cart',
      totalPrice: 1000
    })
    }).catch(err => {
      console.log(err);
    });
  }else{
    res.render('shop/cart',{
      cart: [],
      role: 'user',
      tiltle: 'Cart',
      totalPrice: 0
    })
  }
  // req.user.getCart().then(cart => {
  //   console.log(cart);
  //   if(cart.length > 0){
  //   return cart.getProducts().then(products => {
  //     console.log(products);
  //     res.render('shop/cart',{
  //     cart: products,
  //     role: 'user',
  //     tiltle: 'Cart',
  //     totalPrice: 1000
  //   })
  //   })
  //   }
  }
  



