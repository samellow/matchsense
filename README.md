# MatchSense

A fullstack monorepo application built with Vue 3, Express, and PostgreSQL.

## Tech Stack

- **Frontend:** Vue 3 + Vite + TypeScript + Pinia + Vue Router
- **Backend:** Express + TypeScript
- **Database:** PostgreSQL
- **Monorepo:** npm workspaces

## Project Structure

```
matchsense/
├── packages/
│   ├── client/          # Vue 3 + Vite frontend
│   ├── server/          # Express backend
│   └── shared/          # Shared types and utilities
├── package.json         # Root package.json with workspaces
└── README.md
```

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

Create a PostgreSQL database named `matchsense`:

```bash
createdb matchsense
```

Or using psql:

```sql
CREATE DATABASE matchsense;
```

### 3. Configure environment variables

Create a `.env` file in `packages/server/`:

```env
# Server
PORT=4000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=matchsense
DB_USER=postgres
DB_PASSWORD=postgres
```

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. (Optional) Seed the database

```bash
npm run db:seed
```

### 6. Start development servers

```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Available Scripts

### Root

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:client` | Start frontend only |
| `npm run dev:server` | Start backend only |
| `npm run build` | Build all packages |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed the database |

### Client (packages/client)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Server (packages/server)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled code |
| `npm run migrate` | Run migrations |
| `npm run seed` | Seed database |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |

## License

MIT

