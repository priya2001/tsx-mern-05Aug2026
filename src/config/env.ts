const defaultAppName = 'Star Wars Character App';
const defaultTagline = 'Explore characters across the galaxy';
const defaultApiBaseUrl = 'https://swapi.dev/api';
const devApiBaseUrl = '/api';

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

export const env = {
  appName: import.meta.env.VITE_APP_NAME?.trim() || defaultAppName,
  tagline: import.meta.env.VITE_APP_TAGLINE?.trim() || defaultTagline,
  apiBaseUrl: trimTrailingSlash(
    import.meta.env.DEV
      ? devApiBaseUrl
      : import.meta.env.VITE_API_BASE_URL?.trim() || defaultApiBaseUrl,
  ),
} as const;
