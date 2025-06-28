# Racing Lap Time Tracker

**Current version:** v1.1

Racing Lap Time Tracker is a small demonstration project for storing and
displaying lap records from racing simulation games. The repository contains a
Node.js backend API, a React frontend and a lightweight PostgreSQL schema. A
ready to use Docker Compose configuration makes running everything together
straightforward.

## Architecture

The application is split into three pieces:

1. **Backend** – Express based REST API providing authentication, lap time
   management and administrative endpoints.
2. **Frontend** – React application built with Vite and Tailwind CSS.
3. **Database** – PostgreSQL schema stored under `database/` for games, tracks,
   layouts, cars and recorded laps.

Docker Compose orchestrates all services for local development. Each component
can also run independently if you prefer manual setup.

## Features

* JWT based authentication and basic user profiles.
* Admin interface for verifying lap times and managing users.
* REST API for games, tracks, layouts, cars and lap times.
* Image uploads served from `/api/uploads`.
* GitHub Flavored Markdown support for descriptions and comments.
* Automatic import of game data from `frontend/public/GamePack`.
* Optional Wikipedia scraper utility for quick metadata entry.
* Unit tests for both backend and frontend.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- [pnpm](https://pnpm.io/) for the frontend
- PostgreSQL

## Setup

### Environment Variables

Configuration lives in `backend/.env` (see `backend/.env.example`). Key settings
include:

* `DATABASE_URL` – PostgreSQL connection string
* `JWT_SECRET` – secret used to sign authentication tokens
* `PORT` – backend HTTP port
* `UPLOAD_DIR` – path for user uploaded images
* `CONTENT_DIR` – Markdown content directory
* `APP_VERSION` and `DB_VERSION` – displayed in the API `/api/version` endpoint
* `SEED_SAMPLE_LAPTIMES` – load sample data on first start
* `ENABLE_SAMPLE_DATA` – allow generating demo users and lap times from the Admin page

The frontend uses a single variable `VITE_API_URL` to point at the backend API.

### Backend

```bash
cd backend
npm install
npm run dev  # or `npm start` for production
```

Uploaded images are stored in `frontend/public/images` by default. Markdown
content lives under `frontend/public/content` and is served from `/content`.
Game and vehicle metadata can be placed under `frontend/public/GamePack`. Use
the **Scan GamePack** button on the Admin page to import any `*.json` files
found in these folders.

### GamePack Manager

A helper script is available to tidy up a GamePack directory and create a
compressed archive. It moves legacy layout folders into a `layouts` directory,
reformats JSON files and reports the total number of games, tracks, layouts and
cars found. Run it from the repository root:

```bash
npm run gamepack --prefix backend [inputDir] [outputFile]
```

The default input directory is `frontend/public/GamePack` and the output file is
`GamePack.zip`. A `gamepack.log` file is written alongside the archive with a
full summary of actions performed.

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
# Optionally load the sample game and track data
# psql -U <user> -d <database> -f database/sample_seed_data.sql.disabled
# If upgrading from an older version run the layout metadata migration
# psql -U <user> -d <database> -f database/migrations/2025-06-add-layout-metadata.sql
# If upgrading from an older version run the car metadata migration
# psql -U <user> -d <database> -f database/migrations/2025-07-add-car-metadata.sql
# If upgrading from an older version run the track metadata migration
# psql -U <user> -d <database> -f database/migrations/2025-08-add-track-metadata.sql
# Or run all migrations automatically
# npm run migrate --prefix backend
```

Sample lap times from `database/sample_lap_times.json` are loaded on first start
when the table is empty. Set `SEED_SAMPLE_LAPTIMES=false` to skip loading these records.
Set `ENABLE_SAMPLE_DATA=true` to add a "Generate Sample Times" button on the Admin page.

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

## Troubleshooting and Gotchas

- When the frontend cannot connect to the API, verify that `VITE_API_URL` is set
  correctly and that the backend port matches the `PORT` variable.
- Sample lap times are loaded only once when the database is empty. Set
  `SEED_SAMPLE_LAPTIMES=false` to skip this step.
- The GamePack scanner expects a `game.json` file under each game directory and
  `layout.json` files under track layouts. Incorrect paths will prevent metadata
  from importing.
- If the GamePack scan fails after upgrading, run the latest migrations
  (`2025-06-add-layout-metadata.sql` and `2025-08-add-track-metadata.sql`) to
  create any missing columns. You can run them manually or execute
  `npm run migrate --prefix backend` to apply them automatically.
- Uploaded images are stored inside `frontend/public/images`. Ensure this
  directory exists and is writable by the backend.
- Use `npm run dev` for automatic reload during development; `npm start` runs the
  compiled server for production.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.
