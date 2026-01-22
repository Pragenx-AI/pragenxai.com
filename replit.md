# PRAGENX AI Landing Page

## Overview

PRAGENX AI is a modern, premium landing page for an AI-powered proactive personal assistant product. The application is designed to capture email waitlist signups while showcasing the product's features through an elegant, futuristic interface. The primary conversion goal is waitlist signup, with secondary goals of establishing trust and differentiating the "proactive intelligence" concept.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled via Vite
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom theme configuration (white/maroon color scheme)
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for scroll reveals and microinteractions
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js (v5) with TypeScript
- **Build System**: Custom build script using esbuild for server and Vite for client
- **API Design**: RESTful endpoints defined in shared route contracts (`shared/routes.ts`)
- **Validation**: Zod schemas shared between frontend and backend for type-safe validation

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains table definitions
- **Migrations**: Drizzle Kit manages database migrations in `./migrations`
- **Current Tables**: `waitlist` table for email signups

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/   # UI and feature components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and query client
│   │   └── pages/        # Route page components
├── server/           # Express backend
│   ├── routes.ts     # API endpoint handlers
│   ├── storage.ts    # Database access layer
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route contracts with Zod
```

### Key Design Patterns
- **Shared Schema Pattern**: Database schemas and API contracts are defined in `shared/` for type safety across the stack
- **Storage Abstraction**: `IStorage` interface in `server/storage.ts` abstracts database operations
- **Path Aliases**: TypeScript path aliases (`@/`, `@shared/`) for clean imports

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: PostgreSQL session store (available but not currently used)

### Frontend Libraries
- **@tanstack/react-query**: Async state management for API calls
- **framer-motion**: Animation library for premium UI effects
- **lucide-react**: Icon library
- **Radix UI**: Accessible component primitives (accordion, dialog, dropdown, etc.)
- **class-variance-authority**: Component variant styling
- **wouter**: Lightweight React router

### Development Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **drizzle-kit**: Database migration management
- **TypeScript**: Full-stack type safety

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development indicator