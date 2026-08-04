import { useState } from 'react';
import { format } from 'date-fns';
import type { Character } from '../../../types/swapi';
import { buildCharacterImageUrl, createCharacterImageSeed } from '../utils/characterMedia';
import { getCharacterSpeciesLabel, getCharacterTheme } from '../utils/characterTheme';

type CharacterCardProps = {
  character: Character;
  page: number;
  index: number;
};

export function CharacterCard({ character, page, index }: CharacterCardProps): JSX.Element {
  const [imageSeed] = useState(() => createCharacterImageSeed(character, page, index));
  const [imageFailed, setImageFailed] = useState(false);
  const theme = getCharacterTheme(character);
  const addedDate = format(new Date(character.created), 'dd-MM-yyyy');

  return (
    <article
      className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br ${theme.shell} p-4 shadow-2xl transition duration-300 hover:-translate-y-1 hover:scale-[1.01] ${theme.glow}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%)] opacity-70 transition duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <span
              className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] ${theme.badge}`}
            >
              {getCharacterSpeciesLabel(character)}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-slate-300">
            #{index + 1}
          </span>
        </div>

        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-slate-950/50">
          {imageFailed ? (
            <div className="flex aspect-[3/4] items-center justify-center bg-slate-900/80 text-sm text-slate-300">
              Image unavailable
            </div>
          ) : (
            <img
              alt={character.name}
              className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
              src={buildCharacterImageUrl(imageSeed)}
              onError={() => setImageFailed(true)}
            />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black leading-tight text-white">{character.name}</h3>
          <p className="text-sm leading-6 text-slate-200/90">
            Birth year {character.birth_year}
            {' · '}
            Added {addedDate}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Height</dt>
            <dd className="mt-1 font-semibold text-slate-50">{character.height} cm</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Mass</dt>
            <dd className="mt-1 font-semibold text-slate-50">{character.mass} kg</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Films</dt>
            <dd className="mt-1 font-semibold text-slate-50">{character.films.length}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Species</dt>
            <dd className="mt-1 font-semibold text-slate-50">{getCharacterSpeciesLabel(character)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
