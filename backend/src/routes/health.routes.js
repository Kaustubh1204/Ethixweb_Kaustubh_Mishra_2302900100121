const { Router } = require("express");
const db = require("../config/database");

const router = Router();

router.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1;");
    res.status(200).json({
      success: true,
      data: {
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Service running but database connection failed",
      },
    });
  }
});

module.exports = router;
