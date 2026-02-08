# PragenX AI Platform

A comprehensive AI-powered dashboard for managing daily life, health, finance, and professional commitments.

## Features

- **AI Chat Interface**: Advanced chat capabilities with context awareness.
- **Dashboard Overview**: "Today" view for a quick summary of tasks and schedules.
- **Health Tracking**: Monitor health metrics and habits.
- **Meetings Management**: Teams-style scheduling with advanced fields and integrations.
- **Finance Management**: Track bills and payments, featuring voice-integrated bill addition.
- **Travel Planning**: Organize trips and itineraries.
- **Unified History**: Centralized history across all modules.
- **Premium Aesthetic**: Modern "cyber-executive" maroon/dark theme.

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The server will start on **port 5001** (e.g., `http://localhost:5001`).

3.  **Database Setup (Optional)**
    To enable persistent storage, create an `.env` file and set `DATABASE_URL`.
    If not set, the application will fallback to in-memory storage.

3.  **Build for Production**
    ```bash
    npm run build
    ```