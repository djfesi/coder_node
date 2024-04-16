const express = require("express");
const router = express.Router();
const ProductManagerDB = require("../dao/dbManager/productManager");

const productManagerDB = new ProductManagerDB();

router.get("/products", async (req, res) => {
  const { page, limit, sort } = req.query;
  if (sort === "asc" || sort === "desc") {
    sortOption = { price: sort === "asc" ? 1 : -1 };
  } else {
    sortOption = null;
  }
  try {
    let options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: sortOption,
      lean: true,
    };
    let products = await productManagerDB.getProducts({}, options);
    res.render("home", {
      title: "List products",
      products: products,
      useWS: false,
      scripts: ["products.js"],
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  const { page, limit, sort } = req.query;
  if (sort === "asc" || sort === "desc") {
    sortOption = { price: sort === "asc" ? 1 : -1 };
  } else {
    sortOption = null;
  }
  let options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 3,
    sort: sortOption,
    lean: true,
  };
  let products = await productManagerDB.getProducts({}, options);
  res.render("realTimeProducts", {
    title: "Live products",
    products: products,
    useWS: true,
    scripts: ["live_products.js", "products.js"],
  });
});

router.get("/chat", async (_, res) => {
  res.render("chat", {
    title: "Messages",
    useWS: true,
    scripts: ["chat.js"],
  });
});

module.exports = router;
