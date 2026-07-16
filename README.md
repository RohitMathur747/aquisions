# Aquisions API (Docker + Neon)

This project uses **Neon Database** with different setups for **development** vs **production**.

## Prerequisites

- Docker Desktop running
- Neon accounts / Neon credentials
- Node app expects `DATABASE_URL` in environment

The app reads `DATABASE_URL` from environment via `dotenv/config`.

---

## Development (Neon Local)

Uses **Neon Local proxy** inside Docker and creates ephemeral branches automatically.

### 1) Configure `.env.development`

Set `DATABASE_URL` to point to the `neon-local` service hostname (inside the compose network).

Example:

```env
DATABASE_URL=postgres://neon:pgp@neon-local:5432/neondb
# OR if your proxy uses a different user/password/db:
# DATABASE_URL=postgres://user:password@neon-local:5432/dbname
```

> Your Neon Local proxy defaults can be aligned via `docker-compose.dev.yml`.

### 2) Run the stack

```bash
docker compose -f docker-compose.dev.yml up --build
```

App will be available at:

- http://localhost:3000

### Stop

```bash
docker compose -f docker-compose.dev.yml down
```

---

## Production (Neon Cloud)

No Neon Local is used.

### 1) Configure `.env.production`

Set `DATABASE_URL` to the **Neon Cloud** connection string.

Example:

```env
DATABASE_URL=postgres://<user>:<password>@<host>:5432/<db>?sslmode=require
```

### 2) Run the stack

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

App will be available at:

- http://localhost:3000

### Stop

```bash
docker compose -f docker-compose.prod.yml down
```

---

## How env switching works

- `docker-compose.dev.yml` loads `.env.development` → `DATABASE_URL` points to `neon-local`.
- `docker-compose.prod.yml` loads `.env.production` → `DATABASE_URL` points to Neon Cloud.
- The app code always uses `process.env.DATABASE_URL` (no hardcoded values).
