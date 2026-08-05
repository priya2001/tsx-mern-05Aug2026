import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { AUTH_REFRESH_BUFFER_MS } from '../constants/auth';
import type { AuthSession, AuthState } from '../types/auth';
import { canRefreshSession, isSessionExpired } from '../utils/authSession';
import {
  clearStoredAuthSession,
  readStoredAuthSession,
  writeStoredAuthSession,
} from '../utils/authStorage';
import { loginWithCredentials, logoutSession, refreshAuthSession } from '../api/auth';

type AuthContextValue = {
  session: AuthSession | null;
  status: AuthState['status'];
  errorMessage: string | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;
  login: (username: string, password: string) => Promise<AuthSession>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthSession | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const initialState: AuthState = {
  session: null,
  status: 'loading',
  errorMessage: null,
};

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [state, setState] = useState<AuthState>(initialState);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const commitSession = useCallback((session: AuthSession | null, status: AuthState['status']) => {
    if (session) {
      writeStoredAuthSession(session);
    } else {
      clearStoredAuthSession();
    }

    setState({
      session,
      status,
      errorMessage: null,
    });
  }, []);

  const refresh = useCallback(async (): Promise<AuthSession | null> => {
    const currentSession = readStoredAuthSession();

    if (!currentSession) {
      commitSession(null, 'anonymous');

      return null;
    }

    if (!canRefreshSession(currentSession)) {
      commitSession(null, 'anonymous');

      return null;
    }

    setState((currentState) => ({
      ...currentState,
      status: 'refreshing',
      errorMessage: null,
    }));

    try {
      const nextSession = await refreshAuthSession(currentSession);
      commitSession(nextSession, 'authenticated');

      return nextSession;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to refresh session.';

      setState({
        session: null,
        status: 'error',
        errorMessage,
      });
      clearStoredAuthSession();

      return null;
    }
  }, [commitSession]);

  const scheduleRefresh = useCallback(
    (session: AuthSession) => {
      clearRefreshTimer();

      const refreshDelay = Math.max(session.expiresAt - Date.now() - AUTH_REFRESH_BUFFER_MS, 0);

      refreshTimerRef.current = setTimeout(() => {
        void refresh();
      }, refreshDelay);
    },
    [clearRefreshTimer, refresh],
  );

  const applySession = useCallback(
    (session: AuthSession | null, status: AuthState['status']) => {
      commitSession(session, status);

      if (session) {
        scheduleRefresh(session);
      } else {
        clearRefreshTimer();
      }
    },
    [clearRefreshTimer, commitSession, scheduleRefresh],
  );

  useEffect(() => {
    const storedSession = readStoredAuthSession();

    if (!storedSession) {
      setState({
        session: null,
        status: 'anonymous',
        errorMessage: null,
      });

      return;
    }

    if (isSessionExpired(storedSession)) {
      void refresh();

      return;
    }

    setState({
      session: storedSession,
      status: 'authenticated',
      errorMessage: null,
    });
    scheduleRefresh(storedSession);
  }, [refresh, scheduleRefresh]);

  useEffect(() => clearRefreshTimer, [clearRefreshTimer]);

  const login = useCallback(
    async (username: string, password: string): Promise<AuthSession> => {
      const session = await loginWithCredentials({ username, password });
      applySession(session, 'authenticated');

      return session;
    },
    [applySession],
  );

  const logout = useCallback(async (): Promise<void> => {
    clearRefreshTimer();
    clearStoredAuthSession();

    try {
      await logoutSession();
    } finally {
      setState({
        session: null,
        status: 'anonymous',
        errorMessage: null,
      });
    }
  }, [clearRefreshTimer]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session: state.session,
      status: state.status,
      errorMessage: state.errorMessage,
      isAuthenticated: state.status === 'authenticated',
      isRefreshing: state.status === 'refreshing',
      login,
      logout,
      refresh,
    }),
    [login, logout, refresh, state.errorMessage, state.session, state.status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider.');
  }

  return context;
};
