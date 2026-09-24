-- VELOOP progress persistence migration.
-- Safe to run against an existing VELOOP database.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS best_score INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS users_level_idx ON users(level);
