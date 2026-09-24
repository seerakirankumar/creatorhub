# CreatorHub

CreatorHub is a full-stack marketplace for discovering, publishing, and booking creator services. Creators can publish gigs and manage incoming booking requests. Clients can search services, submit booking requests, and track their bookings.

## Features

- Browse, search, filter, and sort creator gigs
- View gig details, pricing, deliverables, creator information, and availability
- Publish new gigs with client-side and server-side validation
- Submit booking requests with project requirements and target dates
- Creator dashboard with booking actions and gig availability
- Client booking history with status filters
- Demo role and persona switching without authentication
- Local fallback storage when the API is unavailable
- Automatic rejection of competing pending requests when a booking is accepted

## Tech Stack

- React 19 and TypeScript
- Vite with a unified Express development server
- Express and Zod for the REST API and request validation
- JSON file persistence in `data/store.json`
- Prisma schema and seed files for future database integration
- Lucide React and Motion for the interface

## Getting Started

### Requirements

- Node.js 18 or newer
- npm

### Install

```bash
npm install --legacy-peer-deps
```

The compatibility flag is currently required because the project has a peer dependency mismatch between its Vite and esbuild versions.

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

### Other commands

```bash
npm run build   # Create a production frontend build
npm run lint    # Run the TypeScript compiler without emitting files
npm run preview # Preview the Vite build
```

## Configuration

Configuration is optional. Create a `.env` file when a different port or API base URL is needed:

```env
PORT=3000
NODE_ENV=development
VITE_API_BASE_URL=
```

When `VITE_API_BASE_URL` is empty, the frontend uses the API served by the same Express application at `/api`.

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/marketplace` | Browse and search gigs |
| `/gigs/:id` | View gig details |
| `/book/:gigId` | Submit a booking request |
| `/post-gig` | Publish a gig |
| `/creator-dashboard` | Manage creator gigs and booking requests |
| `/my-bookings` | View client bookings |

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check API health |
| `GET` | `/api/gigs` | List gigs with search and filter parameters |
| `GET` | `/api/gigs/:id` | Get one gig |
| `POST` | `/api/gigs` | Create a gig |
| `GET` | `/api/bookings` | List bookings |
| `GET` | `/api/bookings/:id` | Get one booking |
| `POST` | `/api/bookings` | Create a booking request |
| `PATCH` | `/api/bookings/:id/accept` | Accept a booking and close competing requests |
| `PATCH` | `/api/bookings/:id/decline` | Decline a booking with an optional reason |
| `GET` | `/api/creator/dashboard` | Get creator dashboard data |
| `GET` | `/api/creators` | List creator personas |
| `POST` | `/api/reset` | Restore the demo data |

## Data and Persistence

The development server uses `data/store.json` as its persistent demo data store. The frontend also contains a local fallback service for basic operation when API requests fail. The Prisma files in `prisma/` describe an optional database-backed direction but are not required to run the application locally.

## Project Structure

```text
creatorhub/
├── data/store.json          # Demo data store
├── prisma/                  # Optional Prisma schema and seed
├── server/                  # Express app, routes, controllers, and validation
├── src/                     # React application, pages, components, and services
├── server.ts                # Unified development/production entry point
├── package.json             # Scripts and dependencies
└── vite.config.ts           # Vite configuration
```
