const jwt = require("jsonwebtoken");
const PRIVATE_KEY = "coderhouse_cursoNode_2024";
module.exports = {
  generateToken: (credentials) => {
    const token = jwt.sign(credentials, PRIVATE_KEY, { expiresIn: "60m" });
    return token;
  },
  decodeToken: (token) => {
    try {
      const decoded = jwt.verify(token, PRIVATE_KEY);
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  },
  secret: PRIVATE_KEY,
};
