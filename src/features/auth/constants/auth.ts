import type { AuthCredentials } from '../types/auth';

export const AUTH_STORAGE_KEY = 'tsx-mern-04aug2026-auth-session';
export const AUTH_REFRESH_BUFFER_MS = 30_000;
export const AUTH_ACCESS_TOKEN_TTL_MS = 5 * 60 * 1000;
export const AUTH_REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const AUTH_FAKE_CREDENTIALS: AuthCredentials = {
  username: 'luke.skywalker',
  password: 'force123',
};

