import { http, HttpResponse } from 'msw';
import { buildSwapiUrl } from '../api/swapi';
import type { ApiListResponse, SwapiCharacter } from '../types/swapi';

const sampleCharacters: SwapiCharacter[] = [
  {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    gender: 'male',
    birth_year: '19BBY',
    homeworld: 'https://swapi.dev/api/planets/1/',
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-20T21:17:56.891000Z',
    url: 'https://swapi.dev/api/people/1/',
  },
];

export const handlers = [
  http.get(buildSwapiUrl('/people/'), () => {
    return HttpResponse.json<ApiListResponse<SwapiCharacter>>({
      count: sampleCharacters.length,
      next: null,
      previous: null,
      results: sampleCharacters,
    });
  }),
];
