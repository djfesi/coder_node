const { Router } = require("express");
const User = require("./../dao/models/user.model");
const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const user = await User.findOne({ email, password });
  if (!user) {
    return res
      .status(400)
      .json({ error: "Incorrect username and/or password." });
  }
  req.session.user = { email, _id: user._id.toString() };
  const role = email === "adminCoder@coder.com" ? "Admin" : "User";
  res.cookie("userRole", role, { signed: true });

  res.redirect("/products");
});

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, age, email, password } = req.body;
    const user = await User.create({
      firstName,
      lastName,
      age: +age,
      email,
      password,
    });
    req.session.user = { email, _id: user._id.toString() };
    res.redirect("/products");
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("userRole");
  req.session.destroy((_) => {
    res.redirect("/login");
  });
});

module.exports = router;
