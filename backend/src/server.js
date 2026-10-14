const app = require("./app");
const config = require("./config/env");
const db = require("./config/database");

const PORT = config.PORT;

const server = app.listen(PORT, async () => {
  console.log(`[SERVER] EthixWeb Backend running on port ${PORT} in ${config.NODE_ENV} mode`);
  try {
    const res = await db.query("SELECT NOW()");
    console.log(`[DATABASE] Neon PostgreSQL connected successfully at ${res.rows[0].now}`);
  } catch (err) {
    console.error("[DATABASE] Connection test failed:", err.message);
  }
});

const gracefulShutdown = () => {
  console.log("[SERVER] Received shutdown signal, closing server...");
  server.close(() => {
    console.log("[SERVER] HTTP server closed.");
    db.pool.end(() => {
      console.log("[DATABASE] Connection pool closed.");
      process.exit(0);
    });
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
