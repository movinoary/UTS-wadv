const express = require("express");
const routes = express.Router();
const config = require("../config");
const { getHealth } = require("../controller/healthController");
const { getInfo } = require("../controller/infoController");

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check API
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: Server status OK
 */
routes.get("/health", getHealth);
/**
 * @swagger
 * /info:
 *   get:
 *     summary: Informasi API
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: Metadata API berhasil diambil
 */
routes.get("/info", getInfo);

module.exports = routes;
