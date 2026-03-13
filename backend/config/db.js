// backend/config/db.js

const { Pool } = require("pg");

const DB_NAME = process.env.POSTGRES_DB || "tracit_db";
const DB_USER = process.env.POSTGRES_USER || "tracit_user";
const DB_PASS = process.env.POSTGRES_PASSWORD || "tracitpass";
const DB_HOST = process.env.POSTGRES_HOST || "tracit_postgres";
const DB_PORT = process.env.POSTGRES_PORT || 5432;

// Create connection pool
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASS,
  port: DB_PORT,
});

// Function to test DB connection
async function testConnection() {
  try {
    await pool.query("SELECT NOW()");
    console.log("🟩 PostgreSQL connection test passed");
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err);
    throw err;
  }
}

module.exports = { pool, testConnection };
