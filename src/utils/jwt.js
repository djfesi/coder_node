const jwt = require("jsonwebtoken");
const PRIVATE_KEY = "coderhouse_cursoNode_2024";
module.exports = {
  generateToken: (credentials) => {
    const token = jwt.sign(credentials, PRIVATE_KEY, { expiresIn: "60m" });
    return token;
  },
  secret: PRIVATE_KEY,
};
