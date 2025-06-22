# Racing Lap Time Tracker

**Current version:** v1.1

Racing Lap Time Tracker is a demo application for recording and displaying lap
records for racing simulation games. The project is split into a Node.js backend
API, a React frontend and a small PostgreSQL database schema. A Docker Compose
configuration is provided for a quick local setup.

## Features

- JWT based authentication and basic user profiles
- Admin interface for verifying lap times and managing users
- REST API for games, tracks, layouts, cars and lap times
- Image uploads served from `/api/uploads`
- Markdown support for descriptions and comments
- Optional Wikipedia scraper utility for quick data entry
- Unit tests for both backend and frontend

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- [pnpm](https://pnpm.io/) for the frontend
- PostgreSQL

## Setup

### Backend

```bash
cd backend
npm install
npm run dev  # or `npm start` for production
```

Configuration lives in `backend/.env` (see `backend/.env.example`). Important
variables include `DATABASE_URL`, `JWT_SECRET`, `UPLOAD_DIR`, `CONTENT_DIR` and
`APP_VERSION`.

Uploaded images are stored in `frontend/public/images` by default. Markdown
content lives under `frontend/public/content` and is served from `/content`.
Game and vehicle metadata can be placed under `frontend/public/GamePack`. Use
the **Scan GamePack** button on the Admin page to import any `*.json` files
found in these folders.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev  # starts the Vite dev server
```

Ensure `VITE_API_URL` points to the backend API (e.g. `http://localhost:5000/api`).
Use `pnpm build` to create a production bundle.

### Docker Compose

A `docker-compose.yml` file sets up PostgreSQL, the backend and the frontend:

1. Copy `backend/.env.example` to `backend/.env` and adjust as needed.
2. Copy `.env.example` to `.env` and set `VITE_API_URL` to the public API URL.
3. Run `docker compose build --no-cache frontend` and then `docker compose up -d`.
4. Visit `http://localhost:5173` to access the UI.

Database data is stored in the `db-data` volume and images are written to
`frontend/public/images`, which is mounted into both containers. The
`frontend/public/GamePack` folder is also mounted so the backend can scan the
example metadata files.

### Database

To initialise a standalone database manually run:

```bash
psql -U <user> -d <database> -f database/schema.sql
psql -U <user> -d <database> -f database/seed_data.sql
```

Sample lap times from `database/sample_lap_times.json` are loaded on first start
when the table is empty.

### Running Tests

```bash
cd backend && npm install && npm test
cd ../frontend && pnpm install && pnpm test
```

### Scraper Utility

Fetch game, track or car information from Wikipedia:

```bash
node backend/scrapers/scrapeInfo.js "Monza" "Ferrari 488 GT3"
```

The Admin interface exposes this functionality through the **Info Search** page.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.
