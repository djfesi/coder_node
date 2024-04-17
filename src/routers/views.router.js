const express = require("express");
const router = express.Router();
const ProductManagerDB = require("../dao/dbManager/productManager");
const CartManagerDB = require("../dao/dbManager/cartManager");

const productManagerDB = new ProductManagerDB();
const cartManagerDB = new CartManagerDB();

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

router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cartProducts = await cartManagerDB.getCartProducts(cartId);
    if (cartProducts) {
      res.render("cart", {
        title: "Cart Details",
        cartId: cartId,
        products: cartProducts,
        isEmpty: cartProducts.length === 0,
        scripts: ["products.js"],
      });
    } else {
      res.status(404).render("error", { message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).render("error", { message: "Error al obtener el carrito" });
  }
});
module.exports = router;
