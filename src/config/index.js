require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  appName: process.env.APP_NAME || "wad-capstone",
  appVersion: process.env.APP_VERSION || "1.0.0",
  version: process.env.APP_VERSION || "1.0.0",
  env: process.env.NODE_ENV || "development",
  database_url: process.env.DATABASE_URL || "",
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(","),
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
};
