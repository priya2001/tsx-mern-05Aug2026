import type { Character } from '../../../types/swapi';

const randomSeed = (): string => Math.random().toString(36).slice(2, 10);

export const createCharacterImageSeed = (
  character: Character,
  page: number,
  index: number,
): string => `${character.url}-${page}-${index}-${randomSeed()}`;

export const buildCharacterImageUrl = (seed: string): string =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/720/960`;
