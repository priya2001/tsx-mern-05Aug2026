import { useQuery } from '@tanstack/react-query';
import { fetchCharacterResources } from '../../../api/characterDetails';
import type { Character, CharacterDetails } from '../../../types/swapi';
import { buildEnrichedCharacter } from '../utils/characterDetails';

export function useCharacterDetailsQuery(character: Character | null) {
  return useQuery<CharacterDetails, Error>({
    queryKey: ['character-details', character?.url],
    queryFn: async () => {
      if (!character) {
        throw new Error('No character selected.');
      }

      const { homeworld, species, films } = await fetchCharacterResources(character);

      return {
        character: buildEnrichedCharacter(character, homeworld, species, films),
        homeworld,
        species,
        films,
      };
    },
    enabled: Boolean(character),
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
