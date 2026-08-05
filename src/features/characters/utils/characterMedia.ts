import type { Character } from '../../../types/swapi';

const randomSeed = (): string => Math.random().toString(36).slice(2, 10);
const PICSUM_IMAGE_POOL_SIZE = 1084;

const hashString = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

const buildPicsumImageId = (value: string, variant: number): number => {
  const hash = hashString(`${value}:${variant}`);

  return (hash % PICSUM_IMAGE_POOL_SIZE) + 1;
};

export const createCharacterImageSeed = (
  character: Character,
  page: number,
  index: number,
  refreshToken = 0,
): string => `${character.url}-${page}-${index}-${refreshToken}-${randomSeed()}`;

export const buildCharacterImageUrl = (seed: string, variant = 0): string =>
  `https://picsum.photos/id/${buildPicsumImageId(seed, variant)}/720/960`;

export const buildCharacterFallbackImageUrl = (character: Character, seed: string): string =>
  buildCharacterImageUrl(`${character.url}-${seed}`, 1);
