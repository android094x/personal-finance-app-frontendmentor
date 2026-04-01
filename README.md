# Personal Finance App (WIP)

> A full-stack personal finance application built as a [Frontend Mentor](https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1) Guru-level challenge.

![Design preview for the Personal finance app coding challenge](./![app preview image](preview.png).jpg)

## Status

**Work in Progress** — Core functionality is implemented. Remaining features and polish are actively being developed.

### What's done

- [x] User authentication (register/login with JWT)
- [x] Overview dashboard with aggregated financial data
- [x] Transactions with pagination, search, sort, and filter
- [x] Transaction CRUD
- [x] Budget CRUD
- [x] Savings pots with deposit/withdraw
- [x] Category management
- [x] Responsive layout (mobile, tablet, desktop)

### What's next

- [ ] Recurring bills page
- [ ] Budget detail views with spending visualization
- [ ] Pot progress UI
- [ ] Loading and error states
- [ ] Keyboard navigation improvements
- [ ] API integration tests
- [ ] Frontend component tests

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **TanStack Router** — file-based routing with type-safe loaders and search params
- **TanStack Form** — form management with Zod validation
- **Tailwind CSS v4** — utility-first styling with custom design tokens
- **Radix UI** — accessible headless component primitives
- **Recharts** — data visualization

### Backend

- **Express 5** — REST API with layered architecture (routes/controllers/services)
- **PostgreSQL** with **Drizzle ORM** — typed schema, relations, and migrations
- **JWT authentication** (jose) with bcrypt password hashing
- **Centralized error handling** — `AppError` class with Express 5 async error forwarding

### Shared

- **Zod schemas** — single source of truth for validation and TypeScript types across frontend and backend
- **pnpm workspaces** — monorepo with `apps/web`, `apps/api`, and `packages/shared`

## Architecture

```
personal-finance-app/
├── apps/
│   ├── api/          # Express REST API
│   │   ├── src/
│   │   │   ├── controllers/    # Request handling
│   │   │   ├── services/       # Business logic
│   │   │   ├── routes/         # Endpoint definitions
│   │   │   ├── middleware/     # Auth, validation, error handling
│   │   │   ├── db/            # Schema, migrations, seed
│   │   │   └── utils/         # JWT, password helpers
│   │   └── drizzle/           # Migration files
│   └── web/          # React SPA
│       └── src/
│           ├── routes/         # TanStack Router pages
│           ├── features/       # Feature-specific components
│           ├── components/     # Shared UI components
│           ├── lib/            # API client, auth, utilities
│           └── styles/         # Global styles and tokens
└── packages/
    └── shared/       # Zod schemas and types
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Docker (for PostgreSQL)

### Setup

```bash
# Install dependencies
pnpm install

# Start the database
pnpm --filter api db:up

# Run migrations and seed
pnpm db:push
pnpm db:seed

# Start both apps
pnpm api   # http://localhost:3000
pnpm web   # http://localhost:5173
```

### Demo credentials

```
Email:    demo@finance.com
Password: demo1234
```

## API Response Format

All endpoints follow a consistent envelope:

```json
// Success
{ "data": { ... }, "message": "..." }

// List with pagination
{ "data": [...], "meta": { "pagination": { "page": 1, "totalPages": 5 } } }

// Error
{ "error": "..." }
```
