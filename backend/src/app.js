// backend/src/app.js

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all routes
app.use("/", routes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
