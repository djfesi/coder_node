const { Router } = require("express");
const passport = require("passport");
const { generateToken } = require("../utils/jwt");
const passportMiddleware = require("../utils/passportMiddleware");

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
    failureFlash: true,
  }),
  async (req, res) => {
    req.session.user = { email: req.user.email, _id: req.user._id.toString() };
    const role = req.user.email === "adminCoder@coder.com" ? "Admin" : "User";
    res.cookie("userRole", role, { signed: true });
    const credentials = {
      email: req.user.email,
      _id: req.user._id.toString(),
      rol: req.user.rol,
    };
    const token = generateToken(credentials);
    res.cookie("accessToken", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json({ token, cartId: req.user.cart });
  }
);

router.get("/faillogin", (_, res) => {
  return res.status(401).json({ error: "Incorrect username and/or password." });
});

router.get("/current", passportMiddleware("jwt"), async (req, res) => {
  return res.json(req.user);
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (_, res) => {
    try {
      res.redirect("/products");
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
);

router.get("/failregister", (_, res) => {
  res.send("Error register user");
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    req.session.user = { email: req.user.email, _id: req.user._id.toString() };
    const role = req.user.email === "adminCoder@coder.com" ? "Admin" : "User";
    res.cookie("userRole", role, { signed: true });
    res.redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("userRole");
    res.clearCookie("cartId");
    res.clearCookie("accessToken");
    res.redirect("/login");
  });
});

module.exports = router;
