# Pragenx AI - Intelligent Personal Assistant 🚀

Pragenx AI is a premium, state-of-the-art personal assistant dashboard designed to streamline your daily tasks, financial commitments, travel plans, and wellness habits through a sophisticated, voice-first interface.

## ✨ Key Features

### 🎙️ Advanced Voice Assistant
- **Conversational Flows:** Intelligent multi-turn dialogue for adding bills, meetings, and travel plans.
- **Intelligent Extraction:** Automatically parses commands like *"Remind me tomorrow at 8am I need to travel to Ireland"* into structured data.
- **Visual Step Tracking:** Real-time checklist in the main dashboard showing data collection progress.
- **Contextual Responses:** Page-specific voice assistants for Health logging, Bill management, and Meeting scheduling.
- **Smart Voice Replies:** When you use voice input, the assistant speaks its response aloud. Text input remains silent for a seamless experience.

### 🕰️ Unified History & Chat Sessions
- **Multi-Session GPT:** Ability to maintain multiple independent chat sessions with automatic naming and history saving.
- **Sidebar Integration:** Quick access to recent conversations directly from the sidebar navigation.
- **Cross-Module Activity:** Centralized historical view for Bills, Travel, Meetings, and Health sections.
- **Recent Health Activity:** Real-time logging and display of health habits and wellness activities.
- **Meeting Records:** Archive of past meetings with quick access to previous discussions.
- **Minimalist GPT UI:** Refined, pill-shaped chat interface with right-aligned, lowercase message bubbles and a focus on clean typography.
- **Intelligent Weather Widget:** Structured real-time weather data visualization directly within chat responses.

### 🕰️ Unified Chat History
- **Dedicated Chat Sessions:** The History page now exclusively tracks your conversations with the AI, allowing you to resume or delete past sessions.
- **Context Preservation:** seamless restoration of chat context when loading a previous session.

### 🔌 Smart & Futuristic Integrations
- **Expanded Ecosystem:** Native support for Google Meet, Microsoft Teams, Zoom, Webex, Skype, Discord, GoToMeeting, and Slack.
- **Cyber-Executive UI:** Redesigned Integrations page featuring glassmorphism, neon glows, and interactive animations.
- **Status Monitoring:** Real-time visibility into connection status with active visual feedback.
- **One-Click Connectivity:** Streamlined flow for adding and configuring external services.

### 📅 Next-Gen Scheduling
- **Futuristic Modal:** Immersive, light/dark theme-aware meeting scheduler with "laser-line" accents and glowing focused states.
- **Advanced Controls:** Support for attendees, location, platform synchronization, and custom recurrence patterns.
- **Visual Clarity:** High-fidelity inputs and interactive elements designed for speed and precision.

### 🔔 Proactive Intelligence
- **Proactive Quick Actions:** Dynamic dashboard cards suggesting relevant actions based on your current context and upcoming schedule.
- **Upcoming Bill Reminders:** Automatic notifications for bills due within 7 days.
- **Schedule Awareness:** Proactive alerts for today's and tomorrow's meetings.
- **Health & Wellness:** Reminders for hydration and daily healthy habits when targets aren't met.
- **Travel Countdown:** Proactive countdowns for upcoming trips.

### 🔐 Premium Authentication
- **Secure Access:** Built-in `AuthGuard` protecting all sensitive dashboard data.
- **Stunning Login UI:** High-performance, glassmorphic login page with ambient lighting and smooth animations.
- **Session Management:** Seamless sign-in and sign-out flows with real-time feedback.

### 🎨 Cyber-Executive Aesthetic
- **Maroon Branding Transition:** A unified UI experience centered around the project's signature "Maroon Glow" (#800020). All blue and indigo accents have been transitioned to a cohesive maroon/rose palette.
- **Transparent Icon Strategy:** Interactive elements such as mood selectors and dashboard widgets now utilize transparent backgrounds and glassmorphic hover effects for a more integrated and premium feel.
- **Dynamic Animations:** Smooth transitions, hover lifts, and neon pulse effects that bring the interface to life.
- **Theme Awareness:** Fully adaptive UI that looks stunning in both Light (clean, executive) and Dark (cyber-futuristic) modes.
- **Unified Command Center:** Minimalist, pill-shaped chat bar with "+" attachment capabilities, integrated voice/history/send icons, and a focus on essential functionality.
- **Streamlined Dashboard:** Simplified home page layout with a compact "Tap to speak" Voice Assistant hub and prominent, high-impact greeting typography.
- **Quick Add Deep Links:** Quick Add buttons directly open the add forms on Bills, Meetings, and Health pages via URL parameters.
- **Persistent Sign Out:** Sign out icon remains visible in the collapsed sidebar for easy access.
- **Minimized Empty States:** Compact, space-efficient "Your agenda is clear!" section with smaller footprint.
- **Consistent Typography:** Unified font styles and sizes across Today, Meetings, and Travel pages for a cohesive reading experience.
- **Internationalization (GBP):** Fully localized for the UK with British Pounds (£) as the primary currency across all modules and AI interactions.

## 🛠️ Technical Deep Dive

### 💬 Reusable Chat Architecture
The application now utilizes a centralized `ChatMessageList` component. This allows the dedicated GPT page and the new **Home Inline Chat** to share identical rendering logic, ensuring a consistent premium experience across the platform.

### 🔇 The Silence Guarantee
We've implemented a custom `silent` flag within our `ChatMessage` interface. 
- **Auto-Detection**: The `ChatInput` automatically marks text-based submissions as silent.
- **Smart Synthesis**: The `VoiceAssistant` component monitors the chat state and intelligently bypasses the Speech Synthesis API for any message marked as silent, ensuring a quiet search environment while maintaining full vocal capabilities for mic-initiated flows.

### 📐 Layout Intelligence
The `MainLayout` now features conditional rendering logic that manages the **Active Conversation** overlay. This overlay uses glassmorphism and smooth CSS transitions to provide a "picture-in-picture" chat experience that stays accessible while you navigate your dashboard.

## ⚙️ Technology Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** CSS3 (Vanilla + Tailwind for layout), Lucide Icons
- **APIs:** Web Speech API (Recognition & Synthesis)
- **State Management:** Custom React Context API (AppContext)
- **Navigation:** React Router DOM v6

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔑 Login Credentials
For testing purposes, you can use the following default credentials:
- **Email:** `user@gmail.com`
- **Password:** (Any non-empty password)

---

Developed with ❤️ by the Pragenx AI Team.