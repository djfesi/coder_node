const { Router } = require("express");
const passport = require("passport");
const passportMiddleware = require("../utils/passportMiddleware");
const SessionController = require("../controllers/session.controller");

const router = Router();
const sessionController = new SessionController();

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
    failureFlash: true,
  }),
  (req, res) => sessionController.login(req, res)
);

router.get("/faillogin", (_, res) => {
  return res.status(401).json({ error: "Incorrect username and/or password." });
});

router.get("/current", passportMiddleware("jwt"), (req, res) => {
  sessionController.current(req, res);
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
  }),
  (req, res) => sessionController.register(req, res)
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
    res.cookie("userRole", req.user.rol, { signed: true });
    res.cookie("premium", req.user.premium);
    res.redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("userRole");
    res.clearCookie("cartId");
    res.clearCookie("premium");
    res.clearCookie("accessToken");
    res.redirect("/login");
  });
});

module.exports = router;
