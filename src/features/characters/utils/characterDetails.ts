import { format } from 'date-fns';
import type { Character, EnrichedCharacter, Film, Planet, Species } from '../../../types/swapi';
import { buildCharacterImageUrl } from './characterMedia';

const trimTrailingZeroes = (value: string): string =>
  value.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');

export const formatCharacterHeightInMeters = (height: string): string => {
  const parsedHeight = Number(height);

  if (!Number.isFinite(parsedHeight)) {
    return 'Unknown';
  }

  return `${trimTrailingZeroes((parsedHeight / 100).toFixed(2))} m`;
};

export const formatCharacterMass = (mass: string): string => {
  const parsedMass = Number(mass);

  if (!Number.isFinite(parsedMass)) {
    return 'Unknown';
  }

  return `${trimTrailingZeroes(parsedMass.toFixed(2))} kg`;
};

export const formatCharacterCreatedDate = (created: string): string =>
  format(new Date(created), 'dd-MM-yyyy');

export const getCharacterSpeciesName = (character: Character, species: Species[]): string => {
  if (species.length > 0) {
    return species.map((item) => item.name).join(', ');
  }

  if (character.gender === 'n/a' || character.gender === 'none') {
    return 'Droid';
  }

  return 'Human';
};

export const buildEnrichedCharacter = (
  character: Character,
  homeworld: Planet,
  species: Species[],
  films: Film[],
): EnrichedCharacter => ({
  ...character,
  speciesName: getCharacterSpeciesName(character, species),
  homeworldName: homeworld.name,
  filmTitles: films.map((film) => film.title),
  imageUrl: buildCharacterImageUrl(character.url),
});
