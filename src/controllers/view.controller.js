const User = require("../models/user.model");
const ProductService = require("../services/product.service");
const CartService = require("../services/cart.service");

class ViewController {
  constructor() {
    this.productService = new ProductService();
    this.cartService = new CartService();
  }

  async renderProducts(req, res) {
    let userLogged = false;
    let user;
    if (req.cookies["accessToken"]) {
      userLogged = true;
    }
    if (req.session.user) {
      user = await User.findOne({ email: req.session.user.email });
    }
    const { page, limit, sort } = req.query;
    const sortOption =
      sort === "asc" || sort === "desc"
        ? { price: sort === "asc" ? 1 : -1 }
        : null;

    try {
      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sort: sortOption,
        lean: true,
      };
      const products = await this.productService.getProducts({}, options);
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
  }

  async renderRealTimeProducts(req, res) {
    let userLogged = false;
    if (req.cookies["accessToken"]) {
      userLogged = true;
    }
    const { page, limit, sort } = req.query;
    const sortOption =
      sort === "asc" || sort === "desc"
        ? { price: sort === "asc" ? 1 : -1 }
        : null;

    try {
      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 3,
        sort: sortOption,
        lean: true,
      };
      const products = await this.productService.getProducts({}, options);
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
  }

  renderChat(req, res) {
    const userLogged = req.cookies["accessToken"] ? true : false;
    res.render("chat", {
      title: "Messages",
      userLogged,
      useWS: true,
      scripts: ["chat.js", "products.js"],
    });
  }

  async renderCart(req, res) {
    const userLogged = req.cookies["accessToken"] ? true : false;
    try {
      const cartId = req.params.cid;
      const cartProducts = await this.cartService.getCartProducts(cartId);
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
  }

  renderRegister(_, res) {
    res.render("register", {
      title: "Register",
    });
  }

  renderLogin(_, res) {
    res.render("login", {
      title: "Login",
      scripts: ["auth.js"],
    });
  }

  async renderProfile(req, res) {
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
  }
}

module.exports = ViewController;
