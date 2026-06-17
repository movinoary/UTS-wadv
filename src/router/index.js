const express = require("express");
const routes = express.Router();
const { getHealth } = require("../controller/healthController");
const { getInfo } = require("../controller/infoController");

routes.get("/health", getHealth);
routes.get("/info", getInfo);

routes.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} tidak ditemukan.`,
    hint: "Kunjungi GET /api/info untuk melihat daftar endpoint yang tersedia.",
  });
});

routes.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      config.env === "development"
        ? err.message
        : "Terjadi kesalahan di server.",
  });
});

module.exports = routes;
