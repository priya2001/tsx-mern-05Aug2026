import { useEffect, useId, useRef } from 'react';
import {
  FaExclamationTriangle,
  FaFilm,
  FaGlobe,
  FaSpinner,
  FaTimes,
  FaUserAstronaut,
} from 'react-icons/fa';
import type { Character } from '../../../types/swapi';
import { InfoCard } from '../../../components/ui/InfoCard';
import {
  formatCharacterCreatedDate,
  formatCharacterHeightInMeters,
  formatCharacterMass,
} from '../utils/characterDetails';
import { useCharacterDetailsQuery } from '../hooks/useCharacterDetailsQuery';
import { CharacterImage } from './CharacterImage';

type CharacterDetailsModalProps = {
  character: Character;
  onClose: () => void;
};

export function CharacterDetailsModal({
  character,
  onClose,
}: CharacterDetailsModalProps): JSX.Element {
  const headingId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { data, error, isError, isPending, isFetching, refetch } = useCharacterDetailsQuery(character);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [character.url]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        aria-labelledby={headingId}
        aria-modal="true"
        role="dialog"
        className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950 text-slate-100 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.24em] text-hyperspace-100">Character details</p>
              <h2 id={headingId} className="text-2xl font-black text-white sm:text-3xl">
                {character.name}
              </h2>
              <p className="text-sm text-slate-300">
                Birth year {character.birth_year}
                {' · '}
                Species {data?.character.speciesName ?? 'Loading...'}
              </p>
            </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close character details"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 transition hover:border-white/20 hover:bg-white/10"
            onClick={onClose}
          >
            <FaTimes aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-73px)] overflow-y-auto p-5 sm:p-6">
          {isPending ? (
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="h-[420px] animate-pulse rounded-[28px] border border-white/10 bg-slate-900/80" />
              <div className="grid gap-4">
                <div className="h-28 animate-pulse rounded-[24px] border border-white/10 bg-slate-900/80" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-28 animate-pulse rounded-[24px] border border-white/10 bg-slate-900/80" />
                  <div className="h-28 animate-pulse rounded-[24px] border border-white/10 bg-slate-900/80" />
                  <div className="h-28 animate-pulse rounded-[24px] border border-white/10 bg-slate-900/80" />
                  <div className="h-28 animate-pulse rounded-[24px] border border-white/10 bg-slate-900/80" />
                </div>
              </div>
            </div>
          ) : isError ? (
            <div
              role="alert"
              className="flex flex-col items-start gap-4 rounded-[28px] border border-rose-400/20 bg-rose-500/10 p-6 text-rose-50"
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 ring-1 ring-rose-300/20">
                  <FaExclamationTriangle aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-xl font-bold">Could not load character details</h3>
                  <p className="mt-1 text-sm leading-6 text-rose-100/90">
                    {error instanceof Error ? error.message : 'Unknown API error.'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                  onClick={() => {
                    void refetch();
                  }}
                >
                  <FaSpinner aria-hidden="true" className={isFetching ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />
                  Retry request
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          ) : data ? (
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/30">
                  <CharacterImage
                    character={character}
                    className="aspect-[3/4] w-full object-cover"
                    loading="eager"
                    seed={character.url}
                  />
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Profile</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <InfoCard
                      description={`Height is converted from centimeters into meters for display.`}
                      icon={FaUserAstronaut}
                      title="Height"
                      value={formatCharacterHeightInMeters(data.character.height)}
                    />
                    <InfoCard
                      description="Mass is shown as provided by the public API."
                      icon={FaUserAstronaut}
                      title="Mass"
                      value={formatCharacterMass(data.character.mass)}
                    />
                    <InfoCard
                      description={`Added to the API on ${formatCharacterCreatedDate(data.character.created)}.`}
                      icon={FaUserAstronaut}
                      title="Added"
                      value={formatCharacterCreatedDate(data.character.created)}
                    />
                    <InfoCard
                      description="Total films linked to this person in SWAPI."
                      icon={FaFilm}
                      title="Films"
                      value={`${data.character.filmTitles.length}`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-5">
                <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-hyperspace-400/15 text-hyperspace-100 ring-1 ring-hyperspace-300/20">
                      <FaGlobe aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Homeworld</p>
                      <h3 className="text-xl font-bold text-white">{data.character.homeworldName}</h3>
                    </div>
                  </div>
                  <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Terrain</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-50">
                        {data.homeworld.terrain || 'Unknown'}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Climate</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-50">
                        {data.homeworld.climate || 'Unknown'}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Residents</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-50">
                        {data.homeworld.population}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Species</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-50">
                        {data.character.speciesName}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-100 ring-1 ring-amber-300/20">
                      <FaFilm aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Filmography</p>
                      <h3 className="text-xl font-bold text-white">{data.character.filmTitles.length} films</h3>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {data.character.filmTitles.length > 0 ? (
                      data.character.filmTitles.map((filmTitle) => (
                        <span
                          key={filmTitle}
                          className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-sm text-slate-200"
                        >
                          {filmTitle}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-300">No films were linked to this character.</p>
                    )}
                  </div>
                </section>

                {isFetching ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    Refreshing character details...
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
