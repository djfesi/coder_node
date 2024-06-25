const express = require("express");
const PasswordController = require("../controllers/password.controller");

const router = express.Router();
const passwordController = new PasswordController();

router.post("/request-reset", (req, res) => passwordController.requestResetPassword(req, res));
router.post("/reset", (req, res) => passwordController.resetPassword(req, res));

module.exports = router;
