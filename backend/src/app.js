const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config/env");

const healthRoutes = require("./routes/health.routes");
const leadsRoutes = require("./routes/leads.routes");
const adminAuthRoutes = require("./routes/admin-auth.routes");
const adminLeadsRoutes = require("./routes/admin-leads.routes");
const errorHandler = require("./middleware/error-handler");

const app = express();

// Security headers
app.use(helmet());

// CORS configuration supporting credentials
const allowedOrigins = [
  config.FRONTEND_ORIGIN,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Mount API routes
app.use("/api", healthRoutes);
app.use("/api", leadsRoutes);
app.use("/api", adminAuthRoutes);
app.use("/api", adminLeadsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Endpoint ${req.method} ${req.url} does not exist`,
    },
  });
});

// Central error handler
app.use(errorHandler);

module.exports = app;
