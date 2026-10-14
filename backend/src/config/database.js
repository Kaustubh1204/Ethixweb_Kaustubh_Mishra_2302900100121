const { Pool } = require("pg");
const config = require("./env");

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("[DATABASE] Unexpected client error on idle client", err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
