# Vhiem - Gamified Christian Social Platform

A full-stack social media marketplace application built with React, Vite, and Convex.

## Features

- **Multi-role platform**: Shoppers, Businesses, and Delivery Drivers
- **Gamified experience**: Points, levels, badges, and daily leaderboards
- **Social features**: Posts, comments, likes, follows, and user mentions
- **Real-time updates**: Powered by Convex for instant synchronization
- **Responsive design**: Mobile-first design with Tailwind CSS

## Getting Started

1. First, set up Convex (one-time setup):
   ```bash
   npm run setup
   ```
   Follow the prompts to either login to Convex or run locally.

2. After Convex setup is complete, start the development server:
   ```bash
   npm run dev
   ```

3. In a separate terminal, run the Convex backend:
   ```bash
   npm run dev:backend
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