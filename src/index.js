// File: src/index.js (versi terbaru Minggu 2)
const config = require("./config");
const express = require("express");
const routes = require("./router");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Data
const setupSwagger = require("./data/swagger");

const tasksRoutes = require("./router/tasks.router");
const usersRoutes = require("./router/user.router");
const authRoutes = require("./router/auth.router"); // BARU

const authenticate = require("./middleware/authenticate"); // BARU

const app = express();

// ─── Middleware Global ───────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`,
    );
  });
  next();
});
app.use(helmet());

// ─── CORS Configuration ─────────────────────────────────────
const corsOptions = {
  origin: config.allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};
app.use(cors(corsOptions));

// Rate limiter untuk semua endpoint API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maks 100 request per IP per 15 menit
  standardHeaders: true, // Kirim header RateLimit-* standar
  legacyHeaders: false,
  message: {
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Terlalu banyak request. Coba lagi dalam beberapa menit.",
    },
  },
});
// Rate limiter ketat untuk endpoint autentikasi
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Hanya 5 percobaan login per 15 menit per IP
  message: {
    error: {
      code: "TOO_MANY_ATTEMPTS",
      message: "Terlalu banyak percobaan. Coba lagi dalam 15 menit.",
    },
  },
});

// ─── Routes ─────────────────────────────────────────────────
app.use("/", routes); // /health
app.use("/auth", authRoutes);
app.use("/api", routes); // /api/info, /api/echo/:msg
app.use("/api/v1", authenticate);
app.use("/api/v1/tasks", tasksRoutes); // /api/v1/tasks (CRUD)
app.use("/api/v1/users", usersRoutes); // /api/v1/users (CRUD)
app.use("/api/v1/auth", authRoutes); // /api/v1/auth (register, login, refresh, logout, me)

// ─── Swagger UI ─────────────────────────────────────────────
setupSwagger(app);

app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} tidak ditemukan.`,
      hint: "Kunjungi GET /api/docs untuk dokumentasi API.",
    },
  });
});
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message:
        config.env === "development"
          ? err.message
          : "Terjadi kesalahan di server.",
    },
  });
});

// ─── Update error handler: tangani error dari authService ─
app.use((err, req, res, next) => {
  // Error dengan statusCode dari authService
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: { code: err.code || "AUTH_ERROR", message: err.message },
    });
  }
  // Prisma P2002: email duplikat (sudah ada user dengan email tersebut)
  if (err.code === "P2002") {
    return res.status(409).json({
      error: { code: "DUPLICATE_RESOURCE", message: "Data sudah digunakan." },
    });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message:
        config.env === "development"
          ? err.message
          : "Terjadi kesalahan di server.",
    },
  });
});

// ─── Start Server ────────────────────────────────────────────
app.listen(config.port, () => {
  console.log("─".repeat(50));
  console.log(` ${config.appName} v${config.version}`);
  console.log(` Environment : ${config.env}`);
  console.log(` Database : postgresql`);
  console.log(` Server : http://localhost:${config.port}`);
  console.log(` Docs : http://localhost:${config.port}/api/docs`);
  console.log("─".repeat(50));
});

module.exports = app;
