import { describe, expect, it, vi } from 'vitest';
import type { Character } from '../types/swapi';
import { fetchCharacterResources } from './characterDetails';

describe('fetchCharacterResources', () => {
  it('keeps loading character resources when one request fails', async () => {
    const character: Character = {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: 'https://swapi.dev/api/planets/1/',
      films: ['https://swapi.dev/api/films/1/'],
      species: ['https://swapi.dev/api/species/1/'],
      vehicles: [],
      starships: [],
      created: '2014-12-09T13:50:51.644000Z',
      edited: '2014-12-20T21:17:56.891000Z',
      url: 'https://swapi.dev/api/people/1/',
    };

    const fetchMock = vi.fn(async (url: string | URL | Request) => {
      const requestUrl = String(url);

      if (requestUrl === character.homeworld) {
        return new Response(
          JSON.stringify({
            name: 'Tatooine',
            rotation_period: '23',
            orbital_period: '304',
            diameter: '10465',
            climate: 'arid',
            gravity: '1 standard',
            terrain: 'desert',
            surface_water: '1',
            population: '200000',
            residents: [],
            films: [],
            created: '',
            edited: '',
            url: character.homeworld,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }

      if (requestUrl === character.species[0]) {
        return new Response(
          JSON.stringify({
            name: 'Human',
            classification: 'mammal',
            designation: 'sentient',
            average_height: '180',
            skin_colors: 'caucasian, black, asian, hispanic',
            hair_colors: 'blonde, brown, black, red',
            eye_colors: 'brown, blue, green, hazel, grey, amber',
            average_lifespan: '120',
            homeworld: null,
            language: 'Galactic Basic',
            people: [],
            films: [],
            created: '',
            edited: '',
            url: character.species[0],
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }

      if (requestUrl === character.films[0]) {
        return new Response(null, { status: 500 });
      }

      throw new Error(`Unexpected URL: ${requestUrl}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchCharacterResources(character);

    expect(result.homeworld.name).toBe('Tatooine');
    expect(result.species).toHaveLength(1);
    expect(result.species[0]?.name).toBe('Human');
    expect(result.films).toEqual([]);
  });
});
