# Office Planner — Full Repo

This repository contains a simple full-stack Office Daily Update app:
- Backend: Node.js + Express + pg (Postgres)
- Frontend: React (Vite)
- DB schema: SQL file for Postgres (use Supabase or any Postgres instance)

**This zip provides everything you need to run locally or deploy.**

---

## Contents
- office-planner-backend/  (Express server)
- office-planner-frontend/ (Vite + React frontend)
- db/office-planner-schema.sql

---

## Quick local run (recommended: use Supabase managed Postgres)

### 1) Prepare database
- Create a Postgres database (Supabase recommended).
- Run `db/office-planner-schema.sql` in your DB to create tables.

### 2) Backend
```bash
cd office-planner-backend
# copy .env.example -> .env and set DATABASE_URL
npm install
npm run dev
```
Server runs at http://localhost:4000 by default.

### 3) Frontend
```bash
cd office-planner-frontend
# copy .env.example -> .env and set VITE_API_BASE if different
npm install
npm run dev
```
Open printed dev URL (usually http://localhost:5173).

---

## Deploy
- Database: Supabase (managed Postgres) — create project and run SQL file.
- Backend: Render / Railway / Heroku — set `DATABASE_URL` env var and deploy the backend folder.
- Frontend: Vercel — connect frontend repo and set `VITE_API_BASE` to deployed backend URL.

---

## Important notes about data persistence
- The backend intentionally has no DELETE endpoints to prevent accidental data deletion.
- Use a managed DB (Supabase) which offers backups & snapshots.
- Regularly export CSV backups from Supabase for additional safety.

---

## Files included
See the zip contents. If you want, I can:
- Initialize a GitHub repo with these files (you'll get a public repo)
- Or produce a variant that serves the frontend from the backend (single host)

Reply with what you want next:
- `github` — I will prepare instructions to push to GitHub and deploy.
- `single-host` — modify code so Express serves the built frontend (one deployment).
- `help run` — I will walk you step-by-step while you run commands locally.
