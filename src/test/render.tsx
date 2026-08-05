import type { PropsWithChildren, ReactElement } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { AppProviders } from '../app/providers/AppProviders';

export function renderWithProviders(ui: ReactElement) {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 0,
      },
    },
  });

  return render(ui, {
    wrapper: function Wrapper({ children }: PropsWithChildren): JSX.Element {
      return <AppProviders client={testQueryClient}>{children}</AppProviders>;
    },
  });
}
