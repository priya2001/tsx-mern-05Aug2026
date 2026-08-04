import type { PropsWithChildren, ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

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
      return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>;
    },
  });
}
