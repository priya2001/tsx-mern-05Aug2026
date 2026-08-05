import { fetchAllPeople } from './people';
import { fetchCharacterResources } from './characterDetails';
import type { CharacterCatalog } from '../types/swapi';
import {
  buildEnrichedCharacter,
  buildFallbackEnrichedCharacter,
} from '../features/characters/utils/characterDetails';
import { mapWithConcurrency } from '../utils/async';

const CHARACTER_RESOURCE_CONCURRENCY = 4;

export async function fetchCharacterCatalog(): Promise<CharacterCatalog> {
  const peopleResponse = await fetchAllPeople();

  const characterResults = await mapWithConcurrency(
    peopleResponse.results,
    CHARACTER_RESOURCE_CONCURRENCY,
    async (character) => {
      try {
        const { homeworld, species, films } = await fetchCharacterResources(character);

        return buildEnrichedCharacter(character, homeworld, species, films);
      } catch {
        return buildFallbackEnrichedCharacter(character);
      }
    },
  );

  return {
    characters: characterResults,
    count: peopleResponse.count,
  };
}
