const { generateToken } = require("../utils/jwt");
const UserDTO = require("../dto/user.dto");

class SessionService {
  async login(user) {
    const credentials = {
      email: user.email,
      _id: user._id.toString(),
      rol: user.rol,
    };
    const token = generateToken(credentials);
    const userDTO = new UserDTO(user);
    return { token, userDTO, cartId: user.cart };
  }

  async register(user) {
    return new UserDTO(user);
  }
}

module.exports = SessionService;
