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



// DELETE /user/cart/:productId
exports.deleteCartItem = async (req, res, next) => {
  try {
    const prodId = req.params.productId;

    const cart = await req.user.getCart();
    if (!cart) {
      return res.render('shop/cart', { cart: [], role: 'user', title: 'Cart', totalPrice: 0 });
    }

    // Xóa hẳn product khỏi giỏ (xóa dòng trong CartItem)
    await cart.removeProduct(prodId);  // <<< quan trọng: dùng removeProduct thay vì destroy trên mảng

    // Lấy lại dữ liệu sau khi xóa để render
    const products = await cart.getProducts({ through: { attributes: ['quantity'] } });
    const items = products.map(p => ({
      ...p.get({ plain: true }),
      quantity: p.cartItem?.quantity ?? 0
    }));
    const totalPrice = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);

    return res.render('shop/cart', {
      cart: items,
      role: 'user',
      title: 'Cart',
      totalPrice
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

// Controller: GET /user/cart
exports.getViewCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    if (!cart) {
      return res.render('shop/cart', {
        cart: [],
        role: 'user',
        title: 'Cart',
        totalPrice: 0
      });
    }

    // Lấy danh sách Product trong giỏ + quantity từ bảng trung gian
    const products = await cart.getProducts({
      through: { attributes: ['quantity'] }  // quan trọng!
      // có thể thêm include option khác nếu cần (ảnh, category...)
    });

    // Chuẩn hoá dữ liệu cho view
    const items = products.map(p => ({
      ...p.get({ plain: true }), // plain: true -> chuyển instance sequelize thành object javascript thuần.
      quantity: p.cartItem?.quantity ?? 0
    }));

    const totalPrice = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);

    return res.render('shop/cart', {
      cart: items,            // [{ id, title, price, quantity, ... }]
      role: 'user',
      title: 'Cart',
      totalPrice: totalPrice
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.getOrder = (req, res, next) => {
  
}

exports.postOrder = async (req,res, next) => {
  req.user.getCart().then(cart => {
    return cart.getProducts();
  }).then(products => {
    return req.user.createOrder()
    .then(order => {
      return order.addProducts(products.map(product => {
        product.orderItem = {quantity: product.cartItem.quantity};
        return product;
      }))
    })
    .catch(err => console.log(err));
  })
  .then(result => {
    res.redirect('/user/order');
  })
  .catch(err => console.log(err));
}


  



