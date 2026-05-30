# Servora 🚀

> Scalable Local Service Marketplace — Monorepo with Microservices

Find and book trusted local service professionals with real-time availability, instant booking, live chat, and location-based matching.

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + pnpm |
| Frontend | Next.js 15 (App Router, React 19) |
| Backend | Node.js + Express + TypeScript |
| Real-time | Socket.io + Redis Adapter |
| Database | MongoDB + Mongoose |
| Cache/Broker | Redis (pub/sub + caching) |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod (shared schemas) |

## Project Structure

```
Servora/
├── apps/
│   ├── web/                    # Next.js frontend      (port 3000)
│   ├── api-gateway/            # API Gateway            (port 4000)
│   ├── auth-service/           # Authentication         (port 4001)
│   ├── user-service/           # User profiles          (port 4002)
│   ├── booking-service/        # Booking lifecycle      (port 4003)
│   ├── chat-service/           # Chat system            (port 4004)
│   ├── notification-service/   # Notifications          (port 4005)
│   └── realtime-service/       # Socket.io gateway      (port 4006)
│
├── packages/
│   ├── shared-types/           # TypeScript interfaces
│   ├── shared-utils/           # Logger, errors, validators
│   ├── database/               # MongoDB + Redis clients
│   ├── config-typescript/      # Shared tsconfig
│   └── config-eslint/          # Shared ESLint config
│
├── docker-compose.yml          # MongoDB + Redis
├── turbo.json                  # Pipeline config
└── pnpm-workspace.yaml         # Workspace definition
```

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- Docker (for MongoDB & Redis)

### Setup

```bash
# Install dependencies
pnpm install

# Start MongoDB & Redis
docker compose up -d

# Copy environment variables
cp .env.example .env

# Start all services in dev mode
pnpm dev
```

### Run Individual Services

```bash
# Frontend only
pnpm turbo dev --filter=@servora/web

# Specific backend service
pnpm turbo dev --filter=@servora/auth-service

# Build everything
pnpm build
```

## Architecture

- **API Gateway** — single entry point, JWT validation, rate limiting, request proxying
- **Auth Service** — registration, login, JWT token lifecycle
- **User Service** — profiles, worker search with geospatial queries
- **Booking Service** — full booking state machine (pending → accepted → in_progress → completed → rated)
- **Chat Service** — conversations and message persistence
- **Notification Service** — in-app notification storage and management
- **Realtime Service** — Socket.io server bridging Redis pub/sub events to connected clients

## License

Private
