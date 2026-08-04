import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { renderWithProviders } from './test/render';

describe('App', () => {
  it('renders the Phase 1 app shell', () => {
    renderWithProviders(<App />);

    expect(screen.getByRole('heading', { name: /star wars character app/i })).toBeInTheDocument();
    expect(
      screen.getByText(/tanstack query is mounted at the app root with sensible cache defaults/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/vitest, react testing library, jest-dom, user-event, and msw/i)).toBeInTheDocument();
  });
});
