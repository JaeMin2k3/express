const fs = require('fs');
const path = require('path');
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id,title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
    console.log(this);
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id,cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }

  static updateProduct(productId, product){
  fs.readFile(p,(err, fileContent)=>{
    let products = [];
    if(!err){
      products = JSON.parse(fileContent);
    }
    let index = products.find(pro => pro.id === productId);
   const updated = { ...product, id: products[index].id };
     products[index] = updated; // ghi đè hết
    fs.writeFile(p, JSON.stringify(products), e => {console.log(e)});
  }); 
  }

  static deleteProduct(productId){
    getProductsFromFile(products => {
      const newProducts = products.filter(prod => prod.id !== productId);
      fs.writeFile(p,JSON.stringify(newProducts), e => {console.log(e)});
    })
  };

  static editProduct(productId, product){
    getProductsFromFile(products => {
      let newProducts = products.filter(prod => prod.id !== productId);
      newProducts = [...newProducts, product]
      fs.writeFile(p,JSON.stringify(newProducts), e => {console.log(e)});
    })
  };
}; 
