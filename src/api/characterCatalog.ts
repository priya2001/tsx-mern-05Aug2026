import { fetchAllPeople } from './people';
import { fetchCharacterResources } from './characterDetails';
import type { CharacterCatalog } from '../types/swapi';
import {
  buildEnrichedCharacter,
  buildFallbackEnrichedCharacter,
} from '../features/characters/utils/characterDetails';

export async function fetchCharacterCatalog(): Promise<CharacterCatalog> {
  const peopleResponse = await fetchAllPeople();

  const characterResults = await Promise.allSettled(
    peopleResponse.results.map(async (character) => {
      const { homeworld, species, films } = await fetchCharacterResources(character);

      return buildEnrichedCharacter(character, homeworld, species, films);
    }),
  );

  const characters = characterResults.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }

    return buildFallbackEnrichedCharacter(peopleResponse.results[index]!);
  });

  return {
    characters,
    count: peopleResponse.count,
  };
}
