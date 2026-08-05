import type { PropsWithChildren, ReactElement } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { AppProviders } from '../app/providers/AppProviders';
import { AUTH_STORAGE_KEY } from '../features/auth/constants/auth';
import { createMockAuthSession } from '../features/auth/utils/authSession';
import type { AuthSession } from '../features/auth/types/auth';

type RenderWithProvidersOptions = {
  authSession?: AuthSession | null;
};

export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
) {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 0,
      },
    },
  });

  window.localStorage.removeItem(AUTH_STORAGE_KEY);

  const session =
    options.authSession === undefined ? createMockAuthSession('test.user') : options.authSession;

  if (session) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }

  return render(ui, {
    wrapper: function Wrapper({ children }: PropsWithChildren): JSX.Element {
      return <AppProviders client={testQueryClient}>{children}</AppProviders>;
    },
  });
}
