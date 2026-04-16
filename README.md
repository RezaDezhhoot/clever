# Clever Quest 2

This workspace rewrites the original Laravel-based Clever Quest admin area with the following stack:

- Backend: Node.js, Express.js, Sequelize, JWT, Multer, PostgreSQL
- Admin panel: Vue 3 in a dedicated `admin` service
- UI baseline: Demo10 / Metronic visual assets in English and left-to-right mode

## Project structure

```text
services/
  backend/   Express API, Sequelize models, migration and seed scripts
  admin/     Vue 3 admin panel
  db/data/   PostgreSQL volume
  storage/   Uploaded files volume
```

## Database scope migrated from Laravel

The backend recreates the schema defined by the original Laravel migrations:

- `users`
- `password_reset_tokens`
- `sessions`
- `cache`
- `cache_locks`
- `jobs`
- `job_batches`
- `failed_jobs`
- `children`
- `settings`
- `versions`

Business APIs and the Vue admin currently cover the operational tables used by the original admin area:

- `users` and `children`
- `settings`
- `versions`

## Default admin user

The seed script creates this account:

- Email: `admin@cleverquest.local`
- Password: `1234`

## Local development

1. Copy `.env.example` to `.env`.
2. Start the stack with `docker compose -f docker-compose-local.yml up --build`.
3. Open the admin panel at `http://localhost:5173`.
4. API runs at `http://localhost:3000/api/v1`.

## Production-like container run

Use `docker compose up --build` to run the built admin preview server and backend service.

## Notes

- The admin panel is intentionally English and left-to-right.
- Demo10 assets are expected under `services/admin/public/assets`.
- Uploads are served by the backend from `/uploads/*` and persisted in `services/storage/data/uploads`.