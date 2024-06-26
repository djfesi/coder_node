const SessionService = require("../services/session.service");

class SessionController {
  constructor() {
    this.sessionService = new SessionService();
  }

  async login(req, res) {
    try {
      const { token, userDTO, cartId } = await this.sessionService.login(req.user);
      req.session.user = { email: req.user.email, _id: req.user._id.toString() };
      res.cookie("userRole", req.user.rol, { signed: true });
      res.cookie("premium", req.user.premium);
      res.cookie("accessToken", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json({ token, cartId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async current(req, res) {
    try {
      const userDTO = new UserDTO(req.user);
      res.json(userDTO);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async register(req, res) {
    try {
      const userDTO = await this.sessionService.register(req.user);
      res.status(201).json(userDTO);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = SessionController;
