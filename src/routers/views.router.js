const express = require("express");
const router = express.Router();
const {
  userIsLoggedIn,
  userIsNotLoggedIn,
} = require("./../dao/middlewares/auth.middleware");
const User = require("./../dao/models/user.model");
const ProductManagerDB = require("../dao/dbManager/productManager");
const CartManagerDB = require("../dao/dbManager/cartManager");

const productManagerDB = new ProductManagerDB();
const cartManagerDB = new CartManagerDB();

router.get("/products", async (req, res) => {
  let userLogged = false;
  let user;
  if (req.session.user) {
    userLogged = true;
    user = await User.findOne({ email: req.session.user.email });
  }
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
      userLogged: userLogged,
      user: user.firstName,
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
  let userLogged = false;
  if (req.session.user) {
    userLogged = true;
  }
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
    userLogged: userLogged,
    products: products,
    useWS: true,
    scripts: ["live_products.js", "products.js"],
  });
});

router.get("/chat", async (req, res) => {
  let userLogged = false;
  if (req.session.user) {
    userLogged = true;
  }
  res.render("chat", {
    title: "Messages",
    userLogged: userLogged,
    useWS: true,
    scripts: ["chat.js"],
  });
});

router.get("/carts/:cid", userIsLoggedIn, async (req, res) => {
  if (req.session.user) {
    userLogged = true;
  }
  try {
    const cartId = req.params.cid;
    const cartProducts = await cartManagerDB.getCartProducts(cartId);
    if (cartProducts) {
      res.render("cart", {
        title: "Cart Details",
        cartId: cartId,
        userLogged: userLogged,
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

router.get("/register", userIsNotLoggedIn, (_, res) => {
  res.render("register", {
    title: "Register",
  });
});

router.get("/login", userIsNotLoggedIn, (_, res) => {
  res.render("login", {
    title: "Login",
  });
});

router.get("/profile", userIsLoggedIn, async (req, res) => {
  const idFromSession = req.session.user._id;
  const userRole = req.signedCookies.userRole;
  let userLogged = false;
  if (req.session.user) {
    userLogged = true;
  }

  const user = await User.findOne({ _id: idFromSession });
  res.render("profile", {
    title: "My Profile",
    userRole: userRole,
    userLogged: userLogged,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      email: user.email,
    },
  });
});
module.exports = router;
