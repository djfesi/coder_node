const User = require("../models/user.model");
const crypto = require("crypto");
const hashingUtils = require("../utils/hashing");
const MailService = require("../services/mail.service");
const mailService = new MailService();

class PasswordController {
  async requestResetPassword(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expireDate = Date.now() + 3600000; // 1 hour from now

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expireDate;

    await user.save();

    await mailService.sendResetPasswordEmail(user.email, token);
    req.logger.info(`Reset password email sent: ${user.email}`);
    res.status(200).json({ message: "Reset password email sent" });
  }

  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (hashingUtils.isValidPassword(newPassword, user.password)) {
      return res.status(400).json({ error: "Cannot use the same password" });
    }

    user.password = hashingUtils.hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    req.logger.info(`Password reset successfully: ${user.email}`);
    res.status(200).json({ message: "Password reset successfully" });
  }
}

module.exports = PasswordController;
