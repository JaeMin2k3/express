const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename), 
  'data', 
  'cart.json');

  const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  };
  module.exports = class cart {
    static addProdudctToCart(id, productName, productPrice){
      //fetch the previous cart
      fs.readFile(p, (err, fileContent) => {
        let cart = {products: [], totalPrice: Number(0)};
         try {
          cart = JSON.parse(fileContent);
        } catch (e) {
          console.log(e);
        }
        // analyze the cart => find existing product
        const existingProduct = cart.products.findIndex(prod => prod.id === id);
        let updateProduct;
        //add new product/ increase quantity
        if(existingProduct >= 0) {
          cart.products[existingProduct].qty +=1 ;
        }else {
          updateProduct = {id: id, name: productName, qty: 1};
          cart.products = [...cart.products, updateProduct];
        }
        cart.totalPrice = cart.totalPrice + productPrice;
        console.log(cart.totalPrice);
        fs.writeFile(p,JSON.stringify(cart), err => {
          console.log(err);
        });
      });
    }

      static getAllCart(cb){
        getProductsFromFile(cb)
      }
  };

