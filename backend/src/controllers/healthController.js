// backend/src/controllers/healthController.js

exports.healthCheck = (req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "TracIt backend is running",
    timestamp: new Date().toISOString()
  });
};
