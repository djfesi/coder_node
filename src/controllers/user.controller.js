const User = require("../models/user.model");

class UserController {
  async togglePremiumStatus(req, res) {
    const { uid } = req.params;
    try {
      const user = await User.findById(uid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.premium == true) {
        user.premium = undefined;
      } else {
        user.premium = true;
      }
      await user.save();

      res.status(200).json({
        message: `User ${
          user.premium == true ? "upgraded to" : "downgraded from"
        } premium`,
        user,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
