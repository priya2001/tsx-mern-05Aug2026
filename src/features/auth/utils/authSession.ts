import { AUTH_ACCESS_TOKEN_TTL_MS, AUTH_REFRESH_TOKEN_TTL_MS } from '../constants/auth';
import type { AuthCredentials, AuthSession, AuthUser } from '../types/auth';

const randomSuffix = (): string =>
  globalThis.crypto?.randomUUID?.().replace(/-/g, '').slice(0, 12) ??
  Math.random().toString(36).slice(2, 14);

const createDisplayName = (username: string): string =>
  username
    .split(/[._-]+/u)
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(' ');

export const isAuthCredentials = (value: unknown): value is AuthCredentials => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.username === 'string' && typeof candidate.password === 'string';
};

export const isAuthUser = (value: unknown): value is AuthUser => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.username === 'string' &&
    typeof candidate.displayName === 'string'
  );
};

export const isAuthSession = (value: unknown): value is AuthSession => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    isAuthUser(candidate.user) &&
    typeof candidate.accessToken === 'string' &&
    typeof candidate.refreshToken === 'string' &&
    typeof candidate.issuedAt === 'number' &&
    typeof candidate.expiresAt === 'number' &&
    typeof candidate.refreshExpiresAt === 'number'
  );
};

export const createAuthUser = (username: string): AuthUser => ({
  id: `user-${username.toLowerCase().replace(/[^a-z0-9]+/gu, '-') || 'guest'}`,
  username,
  displayName: createDisplayName(username),
});

export const createMockAuthSession = (username: string, issuedAt = Date.now()): AuthSession => {
  const user = createAuthUser(username);
  const uniquePart = `${user.username}-${issuedAt}-${randomSuffix()}`;

  return {
    user,
    accessToken: `access.${uniquePart}`,
    refreshToken: `refresh.${uniquePart}`,
    issuedAt,
    expiresAt: issuedAt + AUTH_ACCESS_TOKEN_TTL_MS,
    refreshExpiresAt: issuedAt + AUTH_REFRESH_TOKEN_TTL_MS,
  };
};

export const isSessionExpired = (session: AuthSession, now = Date.now()): boolean =>
  session.expiresAt <= now;

export const canRefreshSession = (session: AuthSession, now = Date.now()): boolean =>
  session.refreshExpiresAt > now;

