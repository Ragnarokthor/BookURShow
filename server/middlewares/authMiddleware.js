const jwt = require("jsonwebtoken");
require("dotenv").config(); // ✅ Load environment variables

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ success: false, message: "No token provided" });
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verifiedToken.userId;
    next();
  } catch (error) {
    res.status(401).send({ success: false, message: "Token Invalid" });
  }
};
