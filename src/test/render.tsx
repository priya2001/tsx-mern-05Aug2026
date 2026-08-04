import type { PropsWithChildren, ReactElement } from 'react';
import { render } from '@testing-library/react';
import { AppProviders } from '../app/providers/AppProviders';

export function renderWithProviders(ui: ReactElement) {
  return render(ui, {
    wrapper: function Wrapper({ children }: PropsWithChildren): JSX.Element {
      return <AppProviders>{children}</AppProviders>;
    },
  });
}
