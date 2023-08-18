const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError("Необходима авторизация"));
  }

  let payload;

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    next(new UnauthorizedError("Необходима авторизация"));
  }

  req.user = payload;

  next();
};

module.exports = auth;
