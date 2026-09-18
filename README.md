# Bundle Builder

Bundle Builder take-home project using React + TypeScript + Vite on the frontend and Express + TypeScript on the backend.

## Tech Stack

- Frontend: React, TypeScript, Vite, CSS Modules, Zustand
- Backend: Express, TypeScript
- Testing: Vitest, React Testing Library, Supertest
- Quality: ESLint, Prettier

## Project Structure

- `frontend`: UI app with feature-based folders for bundle builder
- `backend`: JSON API for bundle options/config
- `package.json` (root): convenience scripts for running both projects

## Run Locally

1. Install dependencies:
   - `npm install`
   - `npm --prefix frontend install`
   - `npm --prefix backend install`
2. Start frontend + backend together:
   - `npm run dev`
3. Frontend runs at `http://localhost:5173`
4. Backend runs at `http://localhost:4001`

## Deploy on Render (Free)

1. Deploy backend as a **Web Service**
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
2. Copy the backend URL (example: `https://bundle-builder-api.onrender.com`)
3. Deploy frontend as a **Static Site**
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Env var: `VITE_API_BASE=https://YOUR-API-URL/api/bundle`
4. Share the frontend URL

## API Endpoints

- `GET /api/health`
- `GET /api/bundle/options`
- `GET /api/bundle/config`

## Commands

- `npm run test` (runs backend and frontend tests)
- `npm run lint` (runs backend and frontend linting)
- `npm run build` (builds backend and frontend)
- `npm run format` (formats backend and frontend source)
