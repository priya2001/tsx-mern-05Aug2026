import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/queryClient';
import { AuthProvider } from '../../features/auth/context/AuthContext';

type AppProvidersProps = PropsWithChildren<{
  client?: QueryClient;
}>;

export function AppProviders({ children, client = queryClient }: AppProvidersProps): JSX.Element {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
