require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  appName: process.env.APP_NAME || "wad-capstone",
  appVersion: process.env.APP_VERSION || "1.0.0",
  version: process.env.APP_VERSION || "1.0.0",
  env: process.env.NODE_ENV || "development",
};
