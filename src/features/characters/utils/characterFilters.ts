import type { EnrichedCharacter } from '../../../types/swapi';

export interface CharacterBrowseFilters {
  searchTerm: string;
  homeworld: string;
  species: string;
  film: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

const normalize = (value: string): string => value.trim().toLowerCase();

const addUniqueOption = (options: Map<string, FilterOption>, value: string): void => {
  const normalizedValue = value.trim();

  if (!normalizedValue || options.has(normalizedValue)) {
    return;
  }

  options.set(normalizedValue, {
    label: normalizedValue,
    value: normalizedValue,
  });
};

export const buildCharacterFilterOptions = (
  characters: EnrichedCharacter[],
): {
  homeworldOptions: FilterOption[];
  speciesOptions: FilterOption[];
  filmOptions: FilterOption[];
} => {
  const homeworldOptions = new Map<string, FilterOption>();
  const speciesOptions = new Map<string, FilterOption>();
  const filmOptions = new Map<string, FilterOption>();

  characters.forEach((character) => {
    addUniqueOption(homeworldOptions, character.homeworldName);
    character.speciesName
      .split(',')
      .map((item) => item.trim())
      .forEach((speciesName) => addUniqueOption(speciesOptions, speciesName));
    character.filmTitles.forEach((filmTitle) => addUniqueOption(filmOptions, filmTitle));
  });

  const alphabeticalSort = (left: FilterOption, right: FilterOption): number =>
    left.label.localeCompare(right.label);

  return {
    homeworldOptions: Array.from(homeworldOptions.values()).sort(alphabeticalSort),
    speciesOptions: Array.from(speciesOptions.values()).sort(alphabeticalSort),
    filmOptions: Array.from(filmOptions.values()).sort(alphabeticalSort),
  };
};

export const filterCharacters = (
  characters: EnrichedCharacter[],
  filters: CharacterBrowseFilters,
): EnrichedCharacter[] => {
  const searchValue = normalize(filters.searchTerm);
  const homeworldValue = normalize(filters.homeworld);
  const speciesValue = normalize(filters.species);
  const filmValue = normalize(filters.film);

  return characters.filter((character) => {
    const matchesSearch =
      searchValue.length === 0 || normalize(character.name).includes(searchValue);
    const matchesHomeworld =
      homeworldValue.length === 0 || normalize(character.homeworldName) === homeworldValue;
    const matchesSpecies =
      speciesValue.length === 0 ||
      character.speciesName
        .split(',')
        .map((item) => normalize(item))
        .includes(speciesValue);
    const matchesFilm =
      filmValue.length === 0 ||
      character.filmTitles.map((filmTitle) => normalize(filmTitle)).includes(filmValue);

    return matchesSearch && matchesHomeworld && matchesSpecies && matchesFilm;
  });
};

export const paginateCharacters = (
  characters: EnrichedCharacter[],
  page: number,
  pageSize: number,
): EnrichedCharacter[] => {
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * pageSize;

  return characters.slice(startIndex, startIndex + pageSize);
};

export const getCharacterTotalPages = (count: number, pageSize: number): number =>
  Math.max(1, Math.ceil(count / pageSize));
