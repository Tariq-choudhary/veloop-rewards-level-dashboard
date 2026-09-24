import { verifyToken } from "../utils/jwt.js";
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Authentication required." });
  try { req.auth = verifyToken(token); next(); }
  catch { return res.status(401).json({ message: "Session expired. Please sign in again." }); }
}
