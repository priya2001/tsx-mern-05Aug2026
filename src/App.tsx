import { AuthLoadingState } from './features/auth/components/AuthLoadingState';
import { LoginPage } from './features/auth/components/LoginPage';
import { useAuth } from './features/auth/hooks/useAuth';
import { CharactersPage } from './features/characters/CharactersPage';

export default function App(): JSX.Element {
  const { session, status } = useAuth();

  if (status === 'loading') {
    return <AuthLoadingState />;
  }

  if (session) {
    return <CharactersPage />;
  }

  return <LoginPage />;
}
