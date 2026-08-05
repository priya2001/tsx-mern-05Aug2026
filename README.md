# Star Wars Character App

Production-ready React + TypeScript + Vite app for browsing Star Wars characters from the public SWAPI API.

## Overview

This app lets users:

- Sign in with a mocked JWT flow
- Browse Star Wars characters with pagination
- Search by character name
- Filter by homeworld, species, and film
- Open a character details modal
- View loading, refetching, error, and empty states
- Log out and return to the login screen

## Features

- Character roster with pagination
- Search by character name
- Filters for homeworld, species, and film
- Character details modal
- Loading, refetching, error, and empty states
- Mocked login, logout, and session refresh flow
- Strict TypeScript with runtime API validation
- Test coverage with Vitest, React Testing Library, and MSW

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Icons
- date-fns
- Vitest
- React Testing Library
- MSW

## Authentication Flow

The app uses a mocked JWT-style flow for the assignment:

- Login with the fake credentials shown on the login screen
- Session data is stored locally in the browser
- Logout clears the session and returns to the login page
- Silent refresh keeps the session alive before expiry

Demo credentials:

- Username: `luke.skywalker`
- Password: `force123`

## Setup

```bash
npm install
cp .env.example .env
```

## Environment Variables

The app uses the following environment variable:

- `VITE_API_BASE_URL` - SWAPI base URL, usually `/api` in development and on Netlify

Example:

```env
VITE_API_BASE_URL=/api
```

If you deploy on Netlify, the included `netlify.toml` file rewrites `/api/*` requests to SWAPI. On Vercel, the included `vercel.json` file rewrites `/api/*` requests to the serverless proxy in `api/proxy.ts`, which then forwards them to SWAPI. The same app code works locally and in production on both platforms.

## Scripts

```bash
npm run dev
npm run build
npm test
npm run test:watch
```

## Local Development

```bash
npm run dev
```

Then open the Vite local URL shown in the terminal.

## Testing

```bash
npm test
```

The test suite uses:

- MSW for API mocking
- React Testing Library for component and integration coverage
- Vitest as the test runner

## Project Structure

- `src/api` - API helpers and request validation
- `src/app` - app-level providers
- `src/components` - shared layout and UI components
- `src/config` - environment configuration
- `src/features/characters` - feature components, hooks, utilities, and UI
- `src/mocks` - MSW handlers and server setup
- `src/test` - test utilities and setup
- `src/types` - shared TypeScript models

## Notes

- `.env` files are intentionally not committed.
- The app is responsive and designed to work on desktop and mobile.
- Character cards open a modal with enriched details fetched from SWAPI resources.
- Picsum character artwork is cached locally in `public/picsum` so images remain reliable during development.

## Screenshots

Add a few screenshots of the login page, character roster, and character modal here before final submission.

## Verification

Before submitting, run:

```bash
npm test
npm run build
```

Both commands should complete successfully without errors.

## Submission Checklist

- Hosted app link added to your submission form
- Short demo video recorded
- README updated with screenshots
- Optional features reviewed
- `.env` files not committed
