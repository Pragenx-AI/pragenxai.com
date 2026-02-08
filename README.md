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

## Mobile Optimization

- **Adaptive Video Streaming**: Automatically serves a lightweight 720p video (`< 5MB`) on mobile devices while maintaining 4K quality on desktops.
- **Enhanced Mobile Video Playback**:
  - iOS compatibility with `playsInline` and `webkit-playsinline` attributes.
  - Android WebView support via `x5-video-player-type` and `x5-playsinline`.
  - Touch event fallback for browsers that block autoplay.
  - Automatic retry on `loadeddata` event for reliable playback.
- **Performance Enhancements**:
  - Native smooth scrolling on touch devices for butter-smooth interactions.
  - Optimized animations (parallax disabled, background complexity reduced) to save battery and GPU usage.

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