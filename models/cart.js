const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingIndex = cart.products.findIndex((prod) => prod.id === id);
      const existingElem = cart.products[existingIndex];

      let updatedProduct;
      if (existingElem) {
        updatedProduct = { ...existingElem };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, prodPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }

      let cart = JSON.parse(fileContent);
      let updatedProduct = { ...cart };
      const product = updatedProduct.products.find((p) => p.id == id);
      const productQty = product.qty;

      updatedProduct.products = updatedProduct.products.filter(
        (p) => p.id !== id
      );
      updatedProduct.totalPrice =
        updatedProduct.totalPrice - productQty * prodPrice;

      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        console.log(err);
      });
    });
  }
};
