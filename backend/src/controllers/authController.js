import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";
import { signToken } from "../utils/jwt.js";

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    level: row.level,
    xp: row.xp,
    veCoins: row.ve_coins,
    gems: row.gems,
    bestScore: row.best_score ?? 0,
  };
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  const cleanName = String(name || "").trim().slice(0, 80);
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (cleanName.length < 2) return res.status(400).json({ message: "Please enter your name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return res.status(400).json({ message: "Enter a valid email address." });
  if (String(password || "").length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [cleanEmail]);
  if (existing.rowCount) return res.status(409).json({ message: "An account with this email already exists." });

  const hash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO users (name,email,password_hash) VALUES ($1,$2,$3)
     RETURNING id,name,email,level,xp,ve_coins,gems,best_score`,
    [cleanName, cleanEmail, hash],
  );
  const user = publicUser(result.rows[0]);
  res.status(201).json({ user, token: signToken(user) });
}

export async function login(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (!result.rowCount) return res.status(401).json({ message: "Invalid email or password." });
  const row = result.rows[0];
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid email or password." });
  const user = publicUser(row);
  res.json({ user, token: signToken(user) });
}

export async function reward(req, res) {
  const xp = Math.max(0, Math.min(5000, Number.parseInt(req.body.xp, 10) || 0));
  const veCoins = Math.max(0, Math.min(5000, Number.parseInt(req.body.veCoins, 10) || 0));
  const gems = Math.max(0, Math.min(5000, Number.parseInt(req.body.gems, 10) || 0));
  const bestScore = Math.max(0, Math.min(1000000, Number.parseInt(req.body.bestScore, 10) || 0));

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const currentResult = await client.query(
      "SELECT id, level, xp, ve_coins, gems, best_score FROM users WHERE id = $1 FOR UPDATE",
      [req.auth.id],
    );
    if (!currentResult.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "User not found." });
    }

    const current = currentResult.rows[0];
    let level = current.level;
    let nextXP = current.xp + xp;
    while (nextXP >= level * 2000) {
      nextXP -= level * 2000;
      level += 1;
      if (level > 99) {
        level = 99;
        nextXP = 0;
        break;
      }
    }

    const result = await client.query(
      `UPDATE users
       SET level = $1, xp = $2, ve_coins = ve_coins + $3, gems = gems + $4,
           best_score = GREATEST(best_score, $5), updated_at = NOW()
       WHERE id = $6
       RETURNING id,name,email,level,xp,ve_coins,gems,best_score`,
      [level, nextXP, veCoins, gems, bestScore, req.auth.id],
    );

    await client.query("COMMIT");
    res.json({ user: publicUser(result.rows[0]), leveledUp: level > current.level });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function me(req, res) {
  const result = await pool.query(
    "SELECT id,name,email,level,xp,ve_coins,gems,best_score FROM users WHERE id = $1",
    [req.auth.id],
  );
  if (!result.rowCount) return res.status(404).json({ message: "User not found." });
  res.json({ user: publicUser(result.rows[0]) });
}
