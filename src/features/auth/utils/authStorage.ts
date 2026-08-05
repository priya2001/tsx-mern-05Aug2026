import { AUTH_STORAGE_KEY } from '../constants/auth';
import type { AuthSession } from '../types/auth';
import { isAuthSession } from './authSession';

const readStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

export const readStoredAuthSession = (): AuthSession | null => {
  const storage = readStorage();

  if (!storage) {
    return null;
  }

  const rawValue = storage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);

    return isAuthSession(parsed) ? parsed : null;
  } catch {
    storage.removeItem(AUTH_STORAGE_KEY);

    return null;
  }
};

export const writeStoredAuthSession = (session: AuthSession): void => {
  const storage = readStorage();

  if (!storage) {
    return;
  }

  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredAuthSession = (): void => {
  const storage = readStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(AUTH_STORAGE_KEY);
};

