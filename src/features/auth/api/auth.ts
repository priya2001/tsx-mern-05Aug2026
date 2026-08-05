import { AUTH_FAKE_CREDENTIALS } from '../constants/auth';
import type { AuthCredentials, AuthSession } from '../types/auth';
import { createMockAuthSession, isAuthCredentials } from '../utils/authSession';

const delay = async (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const loginWithCredentials = async (
  credentials: AuthCredentials,
): Promise<AuthSession> => {
  if (!isAuthCredentials(credentials)) {
    throw new Error('Invalid login credentials payload.');
  }

  await delay(250);

  if (
    credentials.username !== AUTH_FAKE_CREDENTIALS.username ||
    credentials.password !== AUTH_FAKE_CREDENTIALS.password
  ) {
    throw new Error('Invalid username or password.');
  }

  return createMockAuthSession(credentials.username);
};

export const refreshAuthSession = async (session: AuthSession): Promise<AuthSession> => {
  await delay(200);

  return createMockAuthSession(session.user.username);
};

export const logoutSession = async (): Promise<void> => {
  await delay(100);
};

export const createLocalAuthSession = createMockAuthSession;
