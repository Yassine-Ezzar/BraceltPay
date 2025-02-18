const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-pin");
      next();
    } catch (error) {
      res.status(401).json({ message: "Token invalide" });
    }
  } else {
    res.status(401).json({ message: "Non autorisé, aucun token" });
  }
};

module.exports = { protect };
