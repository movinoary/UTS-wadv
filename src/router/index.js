const express = require("express");
const routes = express.Router();
const config = require("../config");
const { getHealth } = require("../controller/healthController");
const { getInfo } = require("../controller/infoController");

routes.get("/health", getHealth);
routes.get("/info", getInfo);

module.exports = routes;
