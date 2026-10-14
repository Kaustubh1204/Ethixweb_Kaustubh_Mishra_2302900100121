const jwt = require("jsonwebtoken");
const config = require("../config/env");

const requireAdmin = (req, res, next) => {
  // Support both HTTP-only cookie and Authorization Bearer header
  let token = req.cookies?.admin_token;
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required to access admin resources",
      },
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Invalid or expired session. Please sign in again.",
      },
    });
  }
};

module.exports = requireAdmin;
