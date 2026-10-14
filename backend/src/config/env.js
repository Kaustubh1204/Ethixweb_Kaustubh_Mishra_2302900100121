const dotenv = require("dotenv");
dotenv.config();

const requiredEnv = ["DATABASE_URL", "ADMIN_EMAIL", "ADMIN_PASSWORD", "JWT_SECRET"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`[FATAL] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  TESTER_EMAIL: process.env.TESTER_EMAIL || "tester123@gmail.com",
  TESTER_PASSWORD: process.env.TESTER_PASSWORD || "tester123455",
  JWT_SECRET: process.env.JWT_SECRET,
};
