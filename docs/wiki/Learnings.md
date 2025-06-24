# Project Wiki

This page collects general notes and observations from working on the Racing Lap Time Tracker.

## Development Notes

- **Keep environment files out of version control.** Copy `.env.example` and adjust variables locally.
- **Frontend and backend can run separately.** If using Docker Compose, ensure the API URL matches the backend service.
- **GamePack metadata structure matters.** Every game folder requires a `game.json` file. Track layouts should contain `layout.json` files. Wrong paths lead to missing data.
- **Database migrations live under `database/migrations`.** Run them in order if
  upgrading an existing installation. New columns for track metadata were added
  in `2025-08-add-track-metadata.sql`; layouts also require
  `2025-06-add-layout-metadata.sql`.
- **When seeding data** the backend only loads sample lap times once. To repopulate, clear the table or adjust the `SEED_SAMPLE_LAPTIMES` variable.

## Testing

- Backend tests run with Jest: `npm test` inside the `backend` folder.
- Frontend tests use Vitest: `pnpm test` inside the `frontend` folder.
- Tests expect a local database and may create temporary records.

## Common Gotchas

- Double check that `VITE_API_URL` points to the correct host when the frontend fails to load data.
- Uploaded image files must be writable by the backend process.
- If Docker volumes are reused between runs, old data may persist. Remove the `db-data` volume to start fresh.

