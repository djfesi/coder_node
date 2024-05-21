const express = require("express");
const router = express.Router();
const {
  userIsLoggedIn,
  userIsNotLoggedIn,
} = require("../middlewares/auth.middleware");
const User = require("../models/user.model");
const ProductService = require("../services/product.service");
const CartService = require("../services/cart.service");

const productService = new ProductService();
const cartService = new CartService();

router.get('/', (_, res) => {
  res.redirect('/products'); 
});

router.get("/products", async (req, res) => {
  let userLogged = false;
  let user;
  if (req.cookies["accessToken"]) {
    userLogged = true;
  }
  if (req.session.user) {
    user = await User.findOne({ email: req.session.user.email });
  }
  const { page, limit, sort } = req.query;
  const sortOption = sort === "asc" || sort === "desc" ? { price: sort === "asc" ? 1 : -1 } : null;

  try {
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: sortOption,
      lean: true,
    };
    let products = await productService.getProducts({},options);
    res.render("home", {
      title: "List products",
      userLogged,
      user: user?.firstName || "",
      products,
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
  if (req.cookies["accessToken"]) {
    userLogged = true;
  }
  const { page, limit, sort } = req.query;
  const sortOption = sort === "asc" || sort === "desc" ? { price: sort === "asc" ? 1 : -1 } : null;

  try {
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 3,
      sort: sortOption,
      lean: true,
    };
    const products = await productService.getProducts({}, options);
    res.render("realTimeProducts", {
      title: "Live products",
      userLogged,
      products,
      useWS: true,
      scripts: ["live_products.js", "products.js"],
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/chat", (req, res) => {
  const userLogged = req.cookies["accessToken"] ? true : false;
  res.render("chat", {
    title: "Messages",
    userLogged,
    useWS: true,
    scripts: ["chat.js", "products.js"],
  });
});

router.get("/carts/:cid", userIsLoggedIn, async (req, res) => {
  const userLogged = req.cookies["accessToken"] ? true : false;
  try {
    const cartId = req.params.cid;
    const cartProducts = await cartService.getCartProducts(cartId);
    if (cartProducts) {
      res.render("cart", {
        title: "Cart Details",
        cartId,
        userLogged,
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
    scripts: ["auth.js"],
  });
});

router.get("/profile", userIsLoggedIn, async (req, res) => {
  const idFromSession = req.session.user._id;
  const userRole = req.signedCookies.userRole;
  const userLogged = req.cookies["accessToken"] ? true : false;

  try {
    const user = await User.findOne({ _id: idFromSession });
    res.render("profile", {
      title: "My Profile",
      userRole,
      userLogged,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
      },
      scripts: ["products.js"],
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
