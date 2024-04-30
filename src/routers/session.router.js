const { Router } = require("express");
const User = require("./../dao/models/user.model");
const { hashPassword, isValidPassword } = require("../utils/hashing");
const passport = require("passport");

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    // const { email, password } = req.body;
    // if (!email || !password) {
    //   return res.status(400).json({ error: "Invalid credentials" });
    // }
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res
    //     .status(401)
    //     .json({ error: "Incorrect username and/or password." });
    // }
    // if (!isValidPassword(password, user.password)) {
    //   return res
    //     .status(401)
    //     .json({ error: "Incorrect username and/or password." });
    // }
    req.session.user = { email: req.user.email, _id: req.user._id.toString() };
    const role = req.user.email === "adminCoder@coder.com" ? "Admin" : "User";
    res.cookie("userRole", role, { signed: true });
    res.redirect("/products");
  }
);

router.get("/faillogin", (_, res) => {
  res.send("Error login user");
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (_, res) => {
    try {
      // const { firstName, lastName, age, email, password } = req.body;
      // const existUser = await User.findOne({ email });

      // if (existUser) {
      //   return res
      //     .status(400)
      //     .json({ error: "The user is already registered" });
      // }

      // const user = await User.create({
      //   firstName,
      //   lastName,
      //   age: +age,
      //   email,
      //   password: hashPassword(password),
      // });
      // req.session.user = { email, _id: user._id.toString() };
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
    res.redirect("/login");
  });
});

module.exports = router;
