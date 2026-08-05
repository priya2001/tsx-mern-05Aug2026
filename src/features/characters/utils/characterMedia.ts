import type { Character } from '../../../types/swapi';

const PICSUM_IMAGE_IDS: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 237,300, 100, 1011, 1025, 1033, 1043, 1050, 1062, 1074, 1084, 1090, 1100, 1112, 1124, 1132, 1141, 1150, 1160, 1170, 1180, 1190];

const hashString = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

const buildPicsumImageId = (value: string, variant: number): number => {
  const hash = hashString(`${value}:${variant}`);

  return PICSUM_IMAGE_IDS[hash % PICSUM_IMAGE_IDS.length] ?? PICSUM_IMAGE_IDS[0];
};

export const createCharacterImageSeed = (
  character: Character,
  page: number,
  index: number,
  refreshToken = 0,
): string => `${character.url}|${page}|${index}|${refreshToken}`;

export const buildCharacterImageUrl = (seed: string, variant = 0): string => {
  const [characterUrl = '', page = '0', index = '0', refreshToken = '0'] = seed.split('|');
  const baseSeed = `${characterUrl}|${page}|${index}`;
  const refreshOffset = Number(refreshToken) || 0;
  const baseIndex = buildPicsumImageId(baseSeed, 0);
  const basePosition = PICSUM_IMAGE_IDS.indexOf(baseIndex);
  const refreshPosition = (basePosition + refreshOffset + variant) % PICSUM_IMAGE_IDS.length;
  const imageId = PICSUM_IMAGE_IDS[refreshPosition] ?? PICSUM_IMAGE_IDS[0];

  return `/picsum/${imageId}.jpg`;
};

export const buildCharacterFallbackImageUrl = (character: Character, seed: string): string =>
  buildCharacterImageUrl(`${character.url}|${seed}`, 1);
