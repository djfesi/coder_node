const express = require("express");
const router = express.Router();
const path = `${__dirname}/../../data/products.json`;
const ProductManager = require("../dao/controllers/productManager");
const ProductManagerDB = require("../dao/dbManager/productManager");

const productManager = new ProductManager(path);
const productManagerDB = new ProductManagerDB();

router.get("", async (_, res) => {
  const products = await productManagerDB.getProducts();
  res.render("home", {
    title: "List products",
    products: products,
    useWS: false,
    scripts: ["products.js"],
  });
});

router.get("/realtimeproducts", async (_, res) => {
  const products = await productManagerDB.getProducts();
  res.render("realTimeProducts", {
    title: "Live products",
    products: products,
    useWS: true,
    scripts: ["live_products.js", "products.js"],
  });
});

module.exports = router;
