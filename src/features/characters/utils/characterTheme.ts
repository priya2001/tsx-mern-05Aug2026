import type { Character } from '../../../types/swapi';

type CharacterTheme = {
  shell: string;
  badge: string;
  glow: string;
};

const themes: CharacterTheme[] = [
  {
    shell: 'from-amber-500/20 via-slate-950 to-slate-900',
    badge: 'bg-amber-400/15 text-amber-100 ring-amber-300/20',
    glow: 'shadow-amber-500/10',
  },
  {
    shell: 'from-cyan-500/20 via-slate-950 to-slate-900',
    badge: 'bg-cyan-400/15 text-cyan-100 ring-cyan-300/20',
    glow: 'shadow-cyan-500/10',
  },
  {
    shell: 'from-violet-500/20 via-slate-950 to-slate-900',
    badge: 'bg-violet-400/15 text-violet-100 ring-violet-300/20',
    glow: 'shadow-violet-500/10',
  },
  {
    shell: 'from-emerald-500/20 via-slate-950 to-slate-900',
    badge: 'bg-emerald-400/15 text-emerald-100 ring-emerald-300/20',
    glow: 'shadow-emerald-500/10',
  },
  {
    shell: 'from-rose-500/20 via-slate-950 to-slate-900',
    badge: 'bg-rose-400/15 text-rose-100 ring-rose-300/20',
    glow: 'shadow-rose-500/10',
  },
  {
    shell: 'from-sky-500/20 via-slate-950 to-slate-900',
    badge: 'bg-sky-400/15 text-sky-100 ring-sky-300/20',
    glow: 'shadow-sky-500/10',
  },
];

const extractSpeciesKey = (character: Character): string => {
  const speciesUrl = character.species[0];

  if (speciesUrl) {
    return speciesUrl;
  }

  return character.gender === 'n/a' || character.gender === 'none' ? 'droid' : 'human';
};

const hashString = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

export const getCharacterSpeciesLabel = (character: Character): string => {
  const speciesUrl = character.species[0];

  if (!speciesUrl) {
    return 'Human';
  }

  const speciesId = speciesUrl.split('/').filter(Boolean).pop();

  switch (speciesId) {
    case '1':
      return 'Human';
    case '2':
      return 'Droid';
    case '3':
      return 'Wookiee';
    default:
      return 'Species-linked';
  }
};

export const getCharacterTheme = (character: Character): CharacterTheme => {
  const speciesKey = extractSpeciesKey(character);
  const index = hashString(speciesKey) % themes.length;

  return themes[index];
};
