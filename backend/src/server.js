import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { pool } from "./config/database.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));

async function ensureProgressSchema() {
  await pool.query(
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS best_score INTEGER NOT NULL DEFAULT 0`
  );
}

ensureProgressSchema().catch((error) => {
  console.error("Progress schema setup failed:", error.message);
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      ok: true,
      database: "connected",
    });
  } catch {
    res.status(503).json({
      ok: false,
      database: "unavailable",
    });
  }
});

app.use("/api/auth", authRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    message: "Server error.",
  });
});

export default app;

if (!process.env.VERCEL) {
  const port = Number(process.env.PORT || 4000);

  app.listen(port, () => {
    console.log(`VELOOP API running on http://localhost:${port}`);
  });
}