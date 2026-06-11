const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "defaultsecret";
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
