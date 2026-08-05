import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import App from './App';
import { buildPeopleUrl } from './api/swapi';
import { renderWithProviders } from './test/render';
import { server } from './mocks/server';

describe('App', () => {
  it('renders the first page of characters', async () => {
    renderWithProviders(<App />);

    expect(screen.getByRole('status', { name: /loading star wars characters/i })).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: /luke skywalker/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /leia organa/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /han solo/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /search characters/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /filter by homeworld/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /filter by species/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /filter by film/i })).toBeInTheDocument();
    expect(screen.getByText((_content, element) => element?.textContent === 'Page 1 of 2')).toBeInTheDocument();
  });

  it('refreshes character artwork when the roster is reloaded', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    await screen.findByRole('heading', { name: /luke skywalker/i });
    const initialSrc = screen.getByRole('img', { name: /luke skywalker/i }).getAttribute('src');

    await user.click(screen.getByRole('button', { name: /refresh/i }));

    await waitFor(() => {
      expect(screen.getByRole('img', { name: /luke skywalker/i })).not.toHaveAttribute(
        'src',
        initialSrc ?? '',
      );
    }, { timeout: 10000 });
  });

  it('filters characters by search and dropdown selections', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    await screen.findByRole('heading', { name: /luke skywalker/i });
    await user.type(screen.getByRole('textbox', { name: /search characters/i }), 'Leia');
    await user.selectOptions(screen.getByRole('combobox', { name: /filter by homeworld/i }), 'Alderaan');
    await user.selectOptions(screen.getByRole('combobox', { name: /filter by species/i }), 'Human');
    await user.selectOptions(screen.getByRole('combobox', { name: /filter by film/i }), 'A New Hope');

    expect(await screen.findByRole('heading', { name: /leia organa/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /luke skywalker/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /han solo/i })).not.toBeInTheDocument();
    expect(screen.getByText((_content, element) => element?.textContent === 'Page 1 of 1')).toBeInTheDocument();
  });

  it('shows an empty state when filters match no characters', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    await screen.findByRole('heading', { name: /luke skywalker/i });
    await user.type(screen.getByRole('textbox', { name: /search characters/i }), 'ZZZ');

    expect(await screen.findByText(/no matching characters/i)).toBeInTheDocument();
    expect(screen.getByText(/clear the filters or try a wider search/i)).toBeInTheDocument();
  });

  it('opens a character details modal from a filtered result', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    await screen.findByRole('heading', { name: /luke skywalker/i });
    await user.type(screen.getByRole('textbox', { name: /search characters/i }), 'Luke');
    await user.click(screen.getByRole('button', { name: /view details for luke skywalker/i }));

    const dialog = await screen.findByRole('dialog', { name: /luke skywalker/i });
    const modal = within(dialog);

    expect(dialog).toBeInTheDocument();
    expect(modal.getByText(/tatooine/i)).toBeInTheDocument();
    expect(modal.getByText(/arid/i)).toBeInTheDocument();
    expect(modal.getByText(/desert/i)).toBeInTheDocument();
    expect(modal.getByText((_content, element) => element?.textContent === '1')).toBeInTheDocument();
    expect(modal.getByText(/4 films/i)).toBeInTheDocument();
    expect(modal.getByText(/19BBY/i)).toBeInTheDocument();
  });

  it('closes the character details modal with escape and overlay click', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    await screen.findByRole('heading', { name: /luke skywalker/i });
    await user.click(screen.getByRole('button', { name: /view details for luke skywalker/i }));

    const dialog = await screen.findByRole('dialog', { name: /luke skywalker/i });
    expect(dialog).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /luke skywalker/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /view details for leia organa/i }));
    const leiaDialog = await screen.findByRole('dialog', { name: /leia organa/i });
    expect(leiaDialog).toBeInTheDocument();

    const overlay = leiaDialog.parentElement?.firstElementChild;
    expect(overlay).not.toBeNull();
    if (overlay instanceof HTMLElement) {
      await user.click(overlay);
    }

    expect(screen.queryByRole('dialog', { name: /leia organa/i })).not.toBeInTheDocument();
  });

  it('clears filters and restores the full catalog', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    await screen.findByRole('heading', { name: /luke skywalker/i });
    await user.type(screen.getByRole('textbox', { name: /search characters/i }), 'Leia');
    await user.selectOptions(screen.getByRole('combobox', { name: /filter by homeworld/i }), 'Alderaan');

    expect(await screen.findByRole('heading', { name: /leia organa/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    expect(await screen.findByRole('heading', { name: /luke skywalker/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /han solo/i })).toBeInTheDocument();
    expect(screen.getByText((_content, element) => element?.textContent === 'Page 1 of 2')).toBeInTheDocument();
  });

  it('moves to the next page of characters', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    await screen.findByRole('heading', { name: /luke skywalker/i });
    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(await screen.findByRole('heading', { name: /darth vader/i })).toBeInTheDocument();
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
    expect(screen.getByText(/could not load the character catalog/i)).toBeInTheDocument();
  });
});
