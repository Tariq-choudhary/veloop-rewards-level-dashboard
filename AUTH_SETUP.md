# VELOOP Real Login System

This version adds a real Node.js + Express + PostgreSQL authentication backend while keeping the existing VELOOP dashboard, XP Catcher, levels, Wallet, Profile, sounds and navigation.

## 1. Frontend

From the project root:

```powershell
npm install
copy .env.example .env.local
npm run dev
```

`.env.local` should contain:

```env
VITE_API_URL=http://localhost:4000/api
```

## 2. PostgreSQL

After PostgreSQL is installed, open pgAdmin or SQL Shell.

First create the database by running:

```sql
CREATE DATABASE veloop;
```

Then connect to the `veloop` database and run the complete contents of:

```text
database/02_schema.sql
```

## 3. Backend

Open a second PowerShell:

```powershell
cd backend
npm install
copy .env.example .env
```

Open `backend/.env` and set:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/veloop
JWT_SECRET=PUT_A_LONG_RANDOM_SECRET_HERE
FRONTEND_URL=http://localhost:5173
```

Do NOT send your database password or JWT secret in chat and do NOT commit `backend/.env`.

Start the API:

```powershell
npm run dev
```

You should see:

```text
VELOOP API running on http://localhost:4000
```

## 4. Start the frontend

In the first PowerShell:

```powershell
npm run dev
```

Open the Vite URL shown in the terminal.

You can use:

- `/login`
- `/register`
- `/` for the authenticated dashboard
- `/profile` for the protected Profile page

## Authentication behavior

- Passwords are hashed with bcrypt.
- Login returns a JWT.
- The frontend stores only the JWT token.
- Protected API calls send `Authorization: Bearer <token>`.
- `/api/auth/me` restores the signed-in user after a refresh.
- Sign Out removes the token and returns to `/login`.
- User records are stored in PostgreSQL.

## Deployment later

Frontend can remain on Netlify.

Backend can be deployed separately (for example on Render), with PostgreSQL hosted locally during development and then moved to a hosted PostgreSQL provider for production. Update `VITE_API_URL` on the frontend to the deployed API URL.


## Persistent XP, VE Coins, Gems and Game Score

The updated project now saves reward progress to PostgreSQL through the authenticated backend.

- `POST /api/auth/reward` securely applies XP, VE Coins, Gems and best game score to the logged-in user.
- XP level progression is calculated on the server using the dashboard's 2,000 XP-per-level threshold pattern.
- Wallet balances are read from the authenticated PostgreSQL user record.
- The XP Catcher result sends its XP, Gems, VE Coins and best score to the backend.
- Quick-earn XP actions are also persisted.
- The backend automatically adds the `best_score` column when it starts. `database/03_progress_migration.sql` is included for manual database setup if preferred.

After replacing the project folder, restart the backend with `npm run dev`. Then refresh the frontend and play a game. You can verify persistence in psql with:

```sql
SELECT name, email, level, xp, ve_coins, gems, best_score FROM users;
```
