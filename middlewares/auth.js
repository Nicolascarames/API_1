const jwt = require("jsonwebtoken");
const { generateError } = require("../helpers");

const authUser = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw generateError("No token exist", 401);
    }

    let token;
    try {
      token = jwt.verify(authorization, process.env.SECRET);
    } catch (error) {
      throw generateError("Token incorrect", 401);
    }

    req.userId = token.id;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
};
