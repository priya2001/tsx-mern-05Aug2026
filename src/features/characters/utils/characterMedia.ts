import type { Character } from '../../../types/swapi';

const randomSeed = (): string => Math.random().toString(36).slice(2, 10);
const escapeXml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const hashString = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

const getCharacterInitials = (name: string): string => {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part.slice(0, 1))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return initials || 'SW';
};

export const createCharacterImageSeed = (
  character: Character,
  page: number,
  index: number,
  refreshToken = 0,
): string => `${character.url}-${page}-${index}-${refreshToken}-${randomSeed()}`;

export const buildCharacterImageUrl = (seed: string): string =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/720/960`;

export const buildCharacterFallbackImageUrl = (character: Character, seed: string): string => {
  const initials = getCharacterInitials(character.name);
  const hash = hashString(`${character.url}-${seed}`);
  const hueA = hash % 360;
  const hueB = (hueA + 54 + (hash % 28)) % 360;
  const hueC = (hueA + 132 + (hash % 44)) % 360;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 960" role="img" aria-label="${escapeXml(
      character.name,
    )}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="hsl(${hueA} 72% 24%)" />
          <stop offset="55%" stop-color="hsl(${hueB} 68% 16%)" />
          <stop offset="100%" stop-color="hsl(${hueC} 74% 10%)" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.38)" />
          <stop offset="65%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="720" height="960" fill="url(#bg)" />
      <circle cx="560" cy="180" r="170" fill="url(#glow)" />
      <circle cx="150" cy="780" r="240" fill="rgba(255,255,255,0.07)" />
      <path d="M85 700 Q360 550 635 700" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="10" />
      <path d="M140 250 Q360 120 580 250" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="14" />
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="rgba(255,255,255,0.96)"
        font-size="160"
        font-weight="800"
        font-family="Inter, ui-sans-serif, system-ui, sans-serif"
        letter-spacing="10"
      >
        ${escapeXml(initials)}
      </text>
      <text
        x="50%"
        y="63%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="rgba(226,232,240,0.88)"
        font-size="30"
        font-weight="600"
        font-family="Inter, ui-sans-serif, system-ui, sans-serif"
        letter-spacing="6"
      >
        STAR WARS
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
