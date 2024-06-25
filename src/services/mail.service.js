const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendResetPasswordEmail(to, token) {
    const resetLink = `http://localhost:8080/reset-password/${token}`;
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Password Reset",
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="${resetLink}">link</a> to reset your password. This link will expire in 1 hour.</p>
      `,
    });
  }
}

module.exports = MailService;