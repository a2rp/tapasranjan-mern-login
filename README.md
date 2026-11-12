# MERN Authentication

A small MERN starter for account registration and sign-in. It uses Express, MongoDB, bcrypt password hashes, and short-lived JWTs stored in HTTP-only cookies.

## Requirements

- Node.js 20.19+ or 22.12+
- MongoDB locally or a MongoDB Atlas connection string

## Run locally

1. In `backend`, copy `.env.example` to `.env`. Set `MONGODB_URI` and `JWT_SECRET` to a private random value of at least 32 characters. Generate a key with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"` and keep it private.
2. Install and start the API:

   ```sh
   cd backend
   npm install
   npm start
   ```

3. In a second terminal, copy `frontend/.env.example` to `frontend/.env`, then install and start the UI:

   ```sh
   cd frontend
   npm install
   npm start
   ```

The API listens on `http://localhost:8911` and the UI on `http://localhost:3000`. The default API origin is configured for local development. Set `CLIENT_ORIGIN` to the exact deployed UI origin when hosting the API elsewhere. For cross-site cookies, configure `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true` and serve the API over HTTPS.

## API

- `POST /api/v1/user/register` — validate input, hash the password, create an account, and start a session
- `POST /api/v1/user/login` — verify credentials and start a session
- `GET /api/v1/user/me` — return the signed-in user
- `POST /api/v1/user/logout` — clear the session cookie

Passwords are never returned by the API. Sessions use HTTP-only cookies with a 12-hour expiry. The signing key and database URI are read from environment variables; do not commit local `.env` files.

If you deployed an earlier version, rotate its old in-code JWT signing key before deploying this version.
When upgrading an existing database, normalize email values and resolve duplicates before first startup; the API now enforces a unique email index.
