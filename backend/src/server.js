// backend/src/server.js

const app = require("./app");
const { testConnection } = require("../config/db");

const PORT = process.env.PORT || 5200;

// Start server AFTER DB test passes
(async () => {
  try {
    await testConnection();
    console.log("✅ PostgreSQL connection test passed");

    app.listen(PORT, () => {
      console.log(`🚀 TracIt backend running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
