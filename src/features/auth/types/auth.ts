export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  issuedAt: number;
  expiresAt: number;
  refreshExpiresAt: number;
}

export type AuthStatus = 'loading' | 'anonymous' | 'authenticated' | 'refreshing' | 'error';

export interface AuthState {
  session: AuthSession | null;
  status: AuthStatus;
  errorMessage: string | null;
}

