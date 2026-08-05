import { useAuthContext } from '../context/AuthContext';

export const useAuth = (): ReturnType<typeof useAuthContext> => useAuthContext();

