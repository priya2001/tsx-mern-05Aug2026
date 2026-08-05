import { buildPeopleUrl } from './swapi';
import type { Character, PeopleApiResponse } from '../types/swapi';

export const PEOPLE_PAGE_SIZE = 10;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString);

const isNullableString = (value: unknown): value is string | null =>
  value === null || isString(value);

const isCharacter = (value: unknown): value is Character => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.name) &&
    isString(value.height) &&
    isString(value.mass) &&
    isString(value.hair_color) &&
    isString(value.skin_color) &&
    isString(value.eye_color) &&
    isString(value.birth_year) &&
    isString(value.gender) &&
    isString(value.homeworld) &&
    isStringArray(value.films) &&
    isStringArray(value.species) &&
    isStringArray(value.vehicles) &&
    isStringArray(value.starships) &&
    isString(value.created) &&
    isString(value.edited) &&
    isString(value.url)
  );
};

const isPeopleApiResponse = (value: unknown): value is PeopleApiResponse => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.count === 'number' &&
    isNullableString(value.next) &&
    isNullableString(value.previous) &&
    Array.isArray(value.results) &&
    value.results.every(isCharacter)
  );
};

export async function fetchPeople(page: number): Promise<PeopleApiResponse> {
  const response = await fetch(buildPeopleUrl(page));

  if (!response.ok) {
    throw new Error(`Unable to load Star Wars characters. Server responded with ${response.status}.`);
  }

  const data: unknown = await response.json();

  if (!isPeopleApiResponse(data)) {
    throw new Error('Received an invalid people response from the API.');
  }

  return data;
}

export async function fetchAllPeople(): Promise<PeopleApiResponse> {
  const firstPage = await fetchPeople(1);
  const results = [...firstPage.results];
  let nextPage = firstPage.next === null ? null : 2;

  while (nextPage !== null) {
    const response = await fetchPeople(nextPage);
    results.push(...response.results);
    nextPage = response.next === null ? null : nextPage + 1;
  }

  return {
    count: firstPage.count,
    next: null,
    previous: null,
    results,
  };
}
