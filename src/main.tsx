import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProviders } from './app/providers/AppProviders';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

const renderApp = (): void => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>,
  );
};

async function bootstrap(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');

    await worker.start({
      onUnhandledRequest: 'error',
    });
  }

  renderApp();
}

void bootstrap();
