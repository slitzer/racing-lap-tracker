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

The development server proxies requests to `/uploads` to the backend so
uploaded images can be accessed from the same URL as the frontend. Ensure
`VITE_API_URL` points to your backend instance (for example
`http://localhost:5000/api`) when running locally or from another device.

Use `pnpm build` to create a production build.

## Docker Compose

The repository ships with a `docker-compose.yml` configuration for a quick
development setup. It starts PostgreSQL, the backend API and the frontend app.

1. Copy `backend/.env.example` to `backend/.env` and adjust the variables if
   needed (especially `JWT_SECRET`). The default `DATABASE_URL` points to the
   `db` service used by Docker Compose.
2. Copy `frontend/.env.production` and set `VITE_API_URL` to the publicly
   reachable URL of the backend, for example `http://localhost:5000/api`.
3. Ensure the `database` directory is present; Docker Compose mounts it
   read-only to the backend so the sample lap times can be imported
   automatically on first startup.
4. The `db` service includes a healthcheck so the backend waits for PostgreSQL
   to accept connections before starting.
5. Run `docker compose build --no-cache frontend` followed by
   `docker compose up -d` from the project root. Building the images requires
   internet access. The `frontend/Dockerfile` runs `npm install -g pnpm`, which
   downloads packages from `registry.npmjs.org`; without a network connection
   this step fails with `EAI_AGAIN`.
6. Visit `http://localhost:5173` to access the UI. The API will be available at

   `http://localhost:5000`.

When the `db` service starts for the first time it runs the SQL files from the
`database` directory automatically, so the schema and seed data are loaded
without any manual steps.

On startup the backend checks if the `lap_times` table is empty and, if so,
loads the records from `database/sample_lap_times.json`. This means the sample
lap times appear automatically on a fresh installation.

Database data is stored in the `db-data` volume and uploaded files are kept in
`backend/uploads`.

## Database Setup

Create a PostgreSQL database and apply the schema and seed files:

```bash
psql -U <user> -d <database> -f database/schema.sql
psql -U <user> -d <database> -f database/seed_data.sql
```

When running with Docker Compose, these files are mounted to the `db` service
and executed automatically on the first start. Simply remove the `db-data`
volume and run `docker compose up -d` again to reset the database.

Adjust connection settings in your backend environment variables as needed.

**Note**: The Admin page's Import function accepts JSON files created via the
Export button. Existing records are preserved and any duplicates in the file are
skipped during import.
During the import process the Admin page now shows a progress bar and log of actions.

## Running Tests

Before running tests make sure all dependencies are installed:

```bash
cd backend && npm install
cd ../frontend && pnpm install
```

Run the backend and frontend test suites with:

```bash
npm test      # from ./backend
pnpm test     # from ./frontend
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
