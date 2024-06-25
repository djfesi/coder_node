const express = require("express");
const router = express.Router();
const {
  userIsLoggedIn,
  userIsNotLoggedIn,
  authorizeViewUser,
  authorizeViewAdmin,
} = require("../middlewares/auth.middleware");
const ViewController = require("../controllers/view.controller");

const viewController = new ViewController();

router.get("/", (_, res) => {
  res.redirect("/products");
});

router.get("/products", (req, res) => viewController.renderProducts(req, res));

router.get("/realtimeproducts", authorizeViewAdmin, (req, res) =>
  viewController.renderRealTimeProducts(req, res)
);

router.get("/chat", authorizeViewUser, (req, res) =>
  viewController.renderChat(req, res)
);

router.get("/carts/:cid", userIsLoggedIn, authorizeViewUser, (req, res) =>
  viewController.renderCart(req, res)
);

router.get("/register", userIsNotLoggedIn, (_, res) =>
  viewController.renderRegister(_, res)
);

router.get("/login", userIsNotLoggedIn, (_, res) =>
  viewController.renderLogin(_, res)
);

router.get("/profile", userIsLoggedIn, (req, res) =>
  viewController.renderProfile(req, res)
);

router.get("/forgot-password",userIsNotLoggedIn, (req, res) =>
  viewController.renderResetPassword(req, res)
);

router.get("/reset-password/:token", userIsNotLoggedIn, (req, res) =>
  viewController.renderChangePassword(req, res)
);

module.exports = router;
