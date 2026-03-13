// backend/src/routes/index.js

const express = require("express");
const router = express.Router();

// Import route modules
const healthRoute = require("./health");

// Mount routes
router.use("/api", healthRoute);

module.exports = router;
