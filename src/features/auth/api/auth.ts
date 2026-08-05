import { AUTH_FAKE_CREDENTIALS } from '../constants/auth';
import type { AuthCredentials, AuthSession } from '../types/auth';
import { createMockAuthSession, isAuthCredentials, isAuthSession } from '../utils/authSession';

type AuthErrorResponse = {
  message: string;
};

const parseAuthResponse = async <T>(
  response: Response,
  isValue: (value: unknown) => value is T,
  errorMessage: string,
): Promise<T> => {
  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => null);

    if (
      typeof errorBody === 'object' &&
      errorBody !== null &&
      'message' in errorBody &&
      typeof (errorBody as AuthErrorResponse).message === 'string'
    ) {
      throw new Error((errorBody as AuthErrorResponse).message);
    }

    throw new Error(errorMessage);
  }

  const data: unknown = await response.json();

  if (!isValue(data)) {
    throw new Error(errorMessage);
  }

  return data;
};

const postJson = async (path: string, body: unknown): Promise<Response> =>
  fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

export const loginWithCredentials = async (
  credentials: AuthCredentials,
): Promise<AuthSession> => {
  if (!isAuthCredentials(credentials)) {
    throw new Error('Invalid login credentials payload.');
  }

  if (import.meta.env.PROD) {
    if (
      credentials.username !== AUTH_FAKE_CREDENTIALS.username ||
      credentials.password !== AUTH_FAKE_CREDENTIALS.password
    ) {
      throw new Error('Invalid username or password.');
    }

    return createMockAuthSession(credentials.username);
  }

  const response = await postJson('/auth/login', credentials);

  return parseAuthResponse(response, isAuthSession, 'Invalid auth session from login.');
};

export const refreshAuthSession = async (session: AuthSession): Promise<AuthSession> => {
  if (import.meta.env.PROD) {
    return createMockAuthSession(session.user.username);
  }

  const response = await postJson('/auth/refresh', {
    username: session.user.username,
    refreshToken: session.refreshToken,
  });

  return parseAuthResponse(response, isAuthSession, 'Invalid auth session from refresh.');
};

export const logoutSession = async (): Promise<void> => {
  if (import.meta.env.PROD) {
    return;
  }

  await fetch('/auth/logout', {
    method: 'POST',
  });
};

export const createLocalAuthSession = createMockAuthSession;
