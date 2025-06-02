# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (Next.js)
```bash
# Development
cd frontend && npm run dev     # Start development server on port 3000
cd frontend && npm run build   # Build for production
cd frontend && npm run start   # Start production server
cd frontend && npm run lint    # Run ESLint

# Docker development
docker-compose up -d           # Start both frontend and backend containers
docker-compose logs -f         # View logs
docker-compose down           # Stop containers
```

### Backend (Go/Gin)
```bash
# Development (from backend directory)
go run main.go                # Start server on port 8080
go mod download              # Install dependencies
go build                     # Build binary
```

## Architecture Overview

### Frontend Architecture
- **Next.js 15.3.2** with App Router pattern
- **Client-side state management** using React hooks (useState)
- **Edge runtime API route** at `/api/meta` for metadata fetching
- **React Query** for API data fetching with caching
- **TypeScript** with strict type definitions in `lib/types.ts`

Key patterns:
- URL metadata fetching is handled through Next.js API route, not the Go backend
- Component structure follows container/presentation pattern
- All URL data is stored in React state (no persistence)
- Markdown conversion happens client-side

### Backend Architecture
- **Go 1.21** with **Gin** framework
- Currently minimal implementation (only ping endpoint)
- Scaffolded MVC structure ready for expansion:
  - `controllers/` - Request handlers
  - `models/` - Data structures
  - `routers/` - Route definitions
  - `views/` - Response formatting

### Data Flow
1. User inputs URL → Frontend validates → Calls `/api/meta` 
2. API route fetches HTML → Extracts title using Cheerio
3. Frontend stores URL+title in React state
4. User can export as Markdown or delete entries

### Key Features Implementation
- **Metadata extraction**: Checks og:title, twitter:title, then page title
- **Bot protection handling**: Detects "Attention Required!" responses
- **Delayed loading indicator**: Shows after 2 seconds to avoid UI flicker
- **Edge caching**: 1-hour cache on metadata responses

## Environment Configuration
- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:8080`
- Docker sets `NEXT_PUBLIC_API_URL=http://backend:8080` (not currently used)
- Vercel deployment configured with security headers

## Important Notes
- Backend is containerized but not integrated with frontend functionality
- All features currently work without the Go backend running
- No data persistence - refreshing the page clears all URLs
- The app is designed for future backend integration for data storage