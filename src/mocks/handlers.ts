import { http, HttpResponse } from 'msw';
import { buildPeopleUrl, buildSwapiUrl } from '../api/swapi';
import type { Character, PeopleApiResponse } from '../types/swapi';

const createCharacter = (character: Partial<Character>): Character =>
  ({
    name: '',
    height: '',
    mass: '',
    hair_color: '',
    skin_color: '',
    eye_color: '',
    birth_year: '',
    gender: '',
    homeworld: '',
    films: [],
    species: [],
    vehicles: [],
    starships: [],
    created: '',
    edited: '',
    url: '',
    ...character,
  }) as Character;

const pageOneCharacters: Character[] = [
  createCharacter({
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    gender: 'male',
    birth_year: '19BBY',
    homeworld: 'https://swapi.dev/api/planets/1/',
    films: [
      'https://swapi.dev/api/films/1/',
      'https://swapi.dev/api/films/2/',
      'https://swapi.dev/api/films/3/',
      'https://swapi.dev/api/films/6/',
    ],
    species: [],
    vehicles: ['https://swapi.dev/api/vehicles/14/', 'https://swapi.dev/api/vehicles/30/'],
    starships: ['https://swapi.dev/api/starships/12/', 'https://swapi.dev/api/starships/22/'],
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-20T21:17:56.891000Z',
    url: 'https://swapi.dev/api/people/1/',
  }),
  createCharacter({
    name: 'Leia Organa',
    height: '150',
    mass: '49',
    hair_color: 'brown',
    skin_color: 'light',
    eye_color: 'brown',
    gender: 'female',
    birth_year: '19BBY',
    homeworld: 'https://swapi.dev/api/planets/2/',
    films: [
      'https://swapi.dev/api/films/1/',
      'https://swapi.dev/api/films/2/',
      'https://swapi.dev/api/films/3/',
      'https://swapi.dev/api/films/6/',
    ],
    species: [],
    vehicles: ['https://swapi.dev/api/vehicles/30/'],
    starships: [],
    created: '2014-12-10T15:20:09.791000Z',
    edited: '2014-12-20T21:17:50.315000Z',
    url: 'https://swapi.dev/api/people/5/',
  }),
  createCharacter({
    name: 'Han Solo',
    height: '180',
    mass: '80',
    hair_color: 'brown',
    skin_color: 'fair',
    eye_color: 'brown',
    gender: 'male',
    birth_year: '29BBY',
    homeworld: 'https://swapi.dev/api/planets/22/',
    films: [
      'https://swapi.dev/api/films/1/',
      'https://swapi.dev/api/films/2/',
      'https://swapi.dev/api/films/3/',
      'https://swapi.dev/api/films/4/',
      'https://swapi.dev/api/films/5/',
      'https://swapi.dev/api/films/6/',
    ],
    species: [],
    vehicles: [],
    starships: ['https://swapi.dev/api/starships/10/', 'https://swapi.dev/api/starships/22/'],
    created: '2014-12-10T16:49:14.640000Z',
    edited: '2014-12-20T21:17:50.326000Z',
    url: 'https://swapi.dev/api/people/14/',
  }),
];

const pageTwoCharacters: Character[] = [
  createCharacter({
    name: 'Darth Vader',
    height: '202',
    mass: '136',
    hair_color: 'none',
    skin_color: 'white',
    eye_color: 'yellow',
    gender: 'male',
    birth_year: '41.9BBY',
    homeworld: 'https://swapi.dev/api/planets/1/',
    films: [
      'https://swapi.dev/api/films/1/',
      'https://swapi.dev/api/films/2/',
      'https://swapi.dev/api/films/3/',
      'https://swapi.dev/api/films/6/',
    ],
    species: [],
    vehicles: [],
    starships: ['https://swapi.dev/api/starships/13/'],
    created: '2014-12-10T15:18:20.704000Z',
    edited: '2014-12-20T21:17:50.313000Z',
    url: 'https://swapi.dev/api/people/4/',
  }),
  createCharacter({
    name: 'Chewbacca',
    height: '228',
    mass: '112',
    hair_color: 'brown',
    skin_color: 'unknown',
    eye_color: 'blue',
    gender: 'male',
    birth_year: '200BBY',
    homeworld: 'https://swapi.dev/api/planets/14/',
    films: [
      'https://swapi.dev/api/films/1/',
      'https://swapi.dev/api/films/2/',
      'https://swapi.dev/api/films/3/',
      'https://swapi.dev/api/films/6/',
    ],
    species: ['https://swapi.dev/api/species/3/'],
    vehicles: ['https://swapi.dev/api/vehicles/19/'],
    starships: ['https://swapi.dev/api/starships/10/', 'https://swapi.dev/api/starships/22/'],
    created: '2014-12-10T16:42:45.066000Z',
    edited: '2014-12-20T21:17:50.332000Z',
    url: 'https://swapi.dev/api/people/13/',
  }),
  createCharacter({
    name: 'R2-D2',
    height: '96',
    mass: '32',
    hair_color: 'none',
    skin_color: 'white, blue',
    eye_color: 'red',
    gender: 'n/a',
    birth_year: '33BBY',
    homeworld: 'https://swapi.dev/api/planets/8/',
    films: [
      'https://swapi.dev/api/films/1/',
      'https://swapi.dev/api/films/2/',
      'https://swapi.dev/api/films/3/',
      'https://swapi.dev/api/films/4/',
      'https://swapi.dev/api/films/5/',
      'https://swapi.dev/api/films/6/',
    ],
    species: ['https://swapi.dev/api/species/2/'],
    vehicles: [],
    starships: [],
    created: '2014-12-10T15:11:50.376000Z',
    edited: '2014-12-20T21:17:50.311000Z',
    url: 'https://swapi.dev/api/people/8/',
  }),
];

const responseForPage = (page: number): PeopleApiResponse => {
  if (page === 1) {
    return {
      count: 12,
      next: buildPeopleUrl(2),
      previous: null,
      results: pageOneCharacters,
    };
  }

  if (page === 2) {
    return {
      count: 12,
      next: null,
      previous: buildPeopleUrl(1),
      results: pageTwoCharacters,
    };
  }

  return {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
};

export const handlers = [
  http.get(buildSwapiUrl('/people/'), ({ request }) => {
    const page = Number(new URL(request.url).searchParams.get('page') ?? '1');
    return HttpResponse.json(responseForPage(page));
  }),
];
