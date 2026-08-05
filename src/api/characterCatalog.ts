import { fetchAllPeople } from './people';
import { fetchCharacterResources } from './characterDetails';
import type { CharacterCatalog } from '../types/swapi';
import { buildEnrichedCharacter } from '../features/characters/utils/characterDetails';

export async function fetchCharacterCatalog(): Promise<CharacterCatalog> {
  const peopleResponse = await fetchAllPeople();

  const characters = await Promise.all(
    peopleResponse.results.map(async (character) => {
      const { homeworld, species, films } = await fetchCharacterResources(character);

      return buildEnrichedCharacter(character, homeworld, species, films);
    }),
  );

  return {
    characters,
    count: peopleResponse.count,
  };
}
