# Racing Lap Time Tracker

This repository contains a simple skeleton for a racing lap time tracker. It is split into three parts:

- **backend** – Node.js/Express API
- **frontend** – React client built with Vite and pnpm
- **database** – PostgreSQL schema and seed data

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [pnpm](https://pnpm.io/) for the frontend
- PostgreSQL

## Backend Setup

```bash
cd backend
npm install
npm run dev  # or `npm start` for production
```

Environment variables can be configured in `backend/.env` (see `backend/.env.example`).

Uploaded files are stored in the `backend/uploads` directory by default. The server
creates this folder automatically on startup and serves its contents at `/uploads`.
You can change the location by setting the `UPLOAD_DIR` environment variable.

## Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev   # starts the Vite dev server
```

Use `pnpm build` to create a production build.

## Database Setup

Create a PostgreSQL database and apply the schema and seed files:

```bash
psql -U <user> -d <database> -f database/schema.sql
psql -U <user> -d <database> -f database/seed_data.sql
```

Adjust connection settings in your backend environment variables as needed.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
