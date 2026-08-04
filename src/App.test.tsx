import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';
import { buildPeopleUrl } from './api/swapi';
import { renderWithProviders } from './test/render';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';

describe('App', () => {
  it('renders the first page of characters', async () => {
    renderWithProviders(<App />);

    expect(screen.getByRole('status', { name: /loading star wars characters/i })).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: /luke skywalker/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /leia organa/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /han solo/i })).toBeInTheDocument();
    expect(screen.getByText((_content, element) => element?.textContent === 'Page 1 of 2')).toBeInTheDocument();
  });

  it('moves to the next page of characters', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    await screen.findByRole('heading', { name: /luke skywalker/i });
    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(await screen.findByRole('heading', { name: /darth vader/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /chewbacca/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /r2-d2/i })).toBeInTheDocument();
    expect(screen.getByText((_content, element) => element?.textContent === 'Page 2 of 2')).toBeInTheDocument();
  });

  it('shows an error state when the API fails', async () => {
    server.use(
      http.get(buildPeopleUrl(1), () => HttpResponse.error()),
    );

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    }, { timeout: 5000 });
    expect(screen.getByText(/could not load the character list/i)).toBeInTheDocument();
  });
});
