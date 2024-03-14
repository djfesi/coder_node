const express = require("express");
const router = express.Router();
const path = `${__dirname}/../../data/products.json`;
const ProductManager = require("../controllers/productManager");
const productManager = new ProductManager(path);

router.get("", async (_, res) => {
  const products = await productManager.getProducts();
  res.render("home", {
    title: "List products",
    products: products,
    useWS: false,
    scripts: ["products.js"],
  });
});

router.get("/realtimeproducts", async (_, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", {
    title: "Live products",
    products: products,
    useWS: true,
    scripts: ["live_products.js", "products.js"],
  });
});

module.exports = router;
