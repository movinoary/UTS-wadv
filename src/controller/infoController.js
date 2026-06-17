const config = require("../config");

const getInfo = (req, res) => {
  res.status(200).json({
    name: config.appName,
    version: config.version,
    environment: config.env,
    node: process.version,
    endpoints: [
      { method: "GET", path: "/health", description: "Healthcheck" },
      { method: "GET", path: "/api/info", description: "API information" },
      { method: "GET", path: "/api/echo/:msg", description: "Echo a message" },
    ],
  });
};

module.exports = { getInfo };
