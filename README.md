# Star Wars Character App

Production-ready React + TypeScript + Vite app for browsing Star Wars characters from the public SWAPI API.

## Features

- Character roster with pagination
- Search by character name
- Filters for homeworld, species, and film
- Character details modal
- Loading, refetching, error, and empty states
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

## Setup

```bash
npm install
cp .env.example .env
```

## Environment Variables

The app uses the following environment variable:

- `VITE_API_BASE_URL` - SWAPI base URL

Example:

```env
VITE_API_BASE_URL=https://swapi.dev/api
```

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

## Verification

Before submitting, run:

```bash
npm test
npm run build
```

Both commands should complete successfully without errors.
