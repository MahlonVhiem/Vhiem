# Vhiem - Gamified Christian Social Platform

A full-stack social media marketplace application built with React, Vite, and Convex.

## Features

- **Multi-role platform**: Shoppers, Businesses, and Delivery Drivers
- **Gamified experience**: Points, levels, badges, and daily leaderboards
- **Social features**: Posts, comments, likes, follows, and user mentions
- **Real-time updates**: Powered by Convex for instant synchronization
- **Responsive design**: Mobile-first design with Tailwind CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your Convex backend:
   ```bash
   npx convex dev
   ```
   This will prompt you to create a new Convex project and deploy your schema.

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/` - Frontend React application
- `convex/` - Backend functions and schema
- `convex/_generated/` - Auto-generated Convex files

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Convex (database, auth, real-time)
- **Authentication**: Convex Auth with email/password and anonymous options
- **Deployment**: Netlify (frontend), Convex (backend)