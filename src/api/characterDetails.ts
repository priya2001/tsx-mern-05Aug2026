import type { Character, Film, Planet, Species } from '../types/swapi';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString);

const isNullableString = (value: unknown): value is string | null =>
  value === null || isString(value);

const speciesRequestCache = new Map<string, Promise<Species>>();
const planetRequestCache = new Map<string, Promise<Planet>>();
const filmRequestCache = new Map<string, Promise<Film>>();

const fetchValidatedJson = async <T>(
  url: string,
  isValue: (value: unknown) => value is T,
  errorMessage: string,
): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${errorMessage} Server responded with ${response.status}.`);
  }

  const data: unknown = await response.json();

  if (!isValue(data)) {
    throw new Error(errorMessage);
  }

  return data;
};

const fetchCachedJson = <T>(
  cache: Map<string, Promise<T>>,
  url: string,
  loader: () => Promise<T>,
): Promise<T> => {
  const cachedValue = cache.get(url);

  if (cachedValue) {
    return cachedValue;
  }

  const request = loader().catch((error: unknown) => {
    cache.delete(url);
    throw error;
  });

  cache.set(url, request);

  return request;
};

const isSpecies = (value: unknown): value is Species => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.name) &&
    isString(value.classification) &&
    isString(value.designation) &&
    isString(value.average_height) &&
    isString(value.skin_colors) &&
    isString(value.hair_colors) &&
    isString(value.eye_colors) &&
    isString(value.average_lifespan) &&
    isNullableString(value.homeworld) &&
    isString(value.language) &&
    isStringArray(value.people) &&
    isStringArray(value.films) &&
    isString(value.created) &&
    isString(value.edited) &&
    isString(value.url)
  );
};

const isPlanet = (value: unknown): value is Planet => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.name) &&
    isString(value.rotation_period) &&
    isString(value.orbital_period) &&
    isString(value.diameter) &&
    isString(value.climate) &&
    isString(value.gravity) &&
    isString(value.terrain) &&
    isString(value.surface_water) &&
    isString(value.population) &&
    isStringArray(value.residents) &&
    isStringArray(value.films) &&
    isString(value.created) &&
    isString(value.edited) &&
    isString(value.url)
  );
};

const isFilm = (value: unknown): value is Film => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.title) &&
    typeof value.episode_id === 'number' &&
    isString(value.opening_crawl) &&
    isString(value.director) &&
    isString(value.producer) &&
    isString(value.release_date) &&
    isStringArray(value.characters) &&
    isStringArray(value.planets) &&
    isStringArray(value.starships) &&
    isStringArray(value.vehicles) &&
    isStringArray(value.species) &&
    isString(value.created) &&
    isString(value.edited) &&
    isString(value.url)
  );
};

export async function fetchSpeciesByUrl(url: string): Promise<Species> {
  return fetchCachedJson(speciesRequestCache, url, () =>
    fetchValidatedJson(url, isSpecies, 'Received an invalid species response from the API.'),
  );
}

export async function fetchPlanetByUrl(url: string): Promise<Planet> {
  return fetchCachedJson(planetRequestCache, url, () =>
    fetchValidatedJson(url, isPlanet, 'Received an invalid homeworld response from the API.'),
  );
}

export async function fetchFilmByUrl(url: string): Promise<Film> {
  return fetchCachedJson(filmRequestCache, url, () =>
    fetchValidatedJson(url, isFilm, 'Received an invalid film response from the API.'),
  );
}

export async function fetchCharacterResources(character: Character): Promise<{
  homeworld: Planet;
  species: Species[];
  films: Film[];
}> {
  if (!character.homeworld) {
    throw new Error('Character homeworld is missing from the API response.');
  }

  const [homeworld, species, films] = await Promise.all([
    fetchPlanetByUrl(character.homeworld),
    Promise.all(character.species.map((speciesUrl) => fetchSpeciesByUrl(speciesUrl))),
    Promise.all(character.films.map((filmUrl) => fetchFilmByUrl(filmUrl))),
  ]);

  return { homeworld, species, films };
}
