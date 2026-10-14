const jwt = require("jsonwebtoken");
const config = require("../config/env");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || "").toLowerCase().trim();

    let authenticatedAdmin = null;

    if (
      cleanEmail === config.ADMIN_EMAIL.toLowerCase().trim() &&
      password === config.ADMIN_PASSWORD
    ) {
      authenticatedAdmin = { email: config.ADMIN_EMAIL, role: "admin" };
    } else if (
      cleanEmail === config.TESTER_EMAIL.toLowerCase().trim() &&
      password === config.TESTER_PASSWORD
    ) {
      authenticatedAdmin = { email: config.TESTER_EMAIL, role: "admin" };
    }

    if (!authenticatedAdmin) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    }

    const token = jwt.sign(
      { email: authenticatedAdmin.email, role: authenticatedAdmin.role },
      config.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set HTTP-Only Cookie
    const isProduction = config.NODE_ENV === "production";
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.status(200).json({
      success: true,
      data: {
        admin: {
          email: authenticatedAdmin.email,
          role: authenticatedAdmin.role,
        },
        token, // Also return in body for Authorization header flexibility
      },
      message: "Admin login successful",
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const isProduction = config.NODE_ENV === "production";
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        admin: {
          email: req.admin.email,
          role: req.admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  getMe,
};
