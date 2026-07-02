const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("AUTH HEADER:", req.headers.authorization);

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Access Denied"
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    console.log("VERIFIED USER:", verified);

    req.user = verified;

    next();

  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid Token"
    });
  }
};

module.exports = authMiddleware;