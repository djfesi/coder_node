const express = require("express");
const UserController = require("../controllers/user.controller");

const router = express.Router();
const userController = new UserController();

router.put("/premium/:uid", (req, res) => userController.togglePremiumStatus(req, res));

module.exports = router;
