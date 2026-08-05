import { useQuery } from '@tanstack/react-query';
import { fetchCharacterCatalog } from '../../../api/characterCatalog';
import type { CharacterCatalog } from '../../../types/swapi';

export function useCharacterCatalogQuery() {
  return useQuery<CharacterCatalog, Error>({
    queryKey: ['character-catalog'],
    queryFn: fetchCharacterCatalog,
    staleTime: 60_000,
    retry: 1,
  });
}
