const express = require("express");
const router = express.Router();
const ProductManagerDB = require("../dao/dbManager/productManager");

const productManagerDB = new ProductManagerDB();

router.get("", async (_, res) => {
  let products = await productManagerDB.getProducts();
  products = products.map((prod) => prod.toObject());
  res.render("home", {
    title: "List products",
    products: products,
    useWS: false,
    scripts: ["products.js"],
  });
});

router.get("/realtimeproducts", async (_, res) => {
  let products = await productManagerDB.getProducts();
  products = products.map((prod) => prod.toObject());
  res.render("realTimeProducts", {
    title: "Live products",
    products: products,
    useWS: true,
    scripts: ["live_products.js", "products.js"],
  });
});

router.get("/chat", async (_, res) => {
  res.render("chat", {
    title: "Chat",
    useWS: true,
    scripts: ["chat.js"],
  });
});

module.exports = router;
