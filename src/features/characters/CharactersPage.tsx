import { useState } from 'react';
import { format } from 'date-fns';
import { FaRocket, FaSyncAlt } from 'react-icons/fa';
import { PEOPLE_PAGE_SIZE } from '../../api/people';
import { env } from '../../config/env';
import { PageShell } from '../../components/layout/PageShell';
import type { Character } from '../../types/swapi';
import { usePeopleQuery } from './hooks/usePeopleQuery';
import { CharacterGrid } from './components/CharacterGrid';
import { Pagination } from './components/Pagination';
import {
  PeopleEmptyState,
  PeopleErrorState,
  PeopleLoadingState,
} from './components/PeopleState';
import { CharacterDetailsModal } from './components/CharacterDetailsModal';

export function CharactersPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const { data, dataUpdatedAt, error, isError, isFetching, isPending, refetch } =
    usePeopleQuery(page);

  const characters = data?.results ?? [];
  const totalPages = data ? Math.max(1, Math.ceil(data.count / PEOPLE_PAGE_SIZE)) : 1;
  const hasPrevious = Boolean(data?.previous);
  const hasNext = Boolean(data?.next);
  const showBlockingError = isError && !data;
  const showInlineError = isError && Boolean(data);
  const refreshedAt = dataUpdatedAt > 0 ? format(new Date(dataUpdatedAt), 'HH:mm') : null;

  return (
    <PageShell className="gap-8">
      <header className="flex flex-col gap-6 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-hyperspace-300/20 bg-hyperspace-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-hyperspace-100">
            <FaRocket aria-hidden="true" className="h-3.5 w-3.5" />
            Star Wars characters
          </span>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              {env.appName}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Browse characters from the public SWAPI `/people` endpoint with pagination, loading
              states, retry handling, and resilient query caching.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current page</p>
            <p className="mt-1 text-2xl font-bold text-white">{page}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Characters</p>
            <p className="mt-1 text-2xl font-bold text-white">{data?.count ?? '—'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Refreshed</p>
            <p className="mt-1 text-2xl font-bold text-white">{refreshedAt ?? '—'}</p>
          </div>
        </div>
      </header>

      {isPending ? (
        <PeopleLoadingState />
      ) : showBlockingError ? (
        <PeopleErrorState
          title="Could not load the character list"
          message={error instanceof Error ? error.message : 'Unknown API error.'}
          onRetry={() => {
            void refetch();
          }}
        />
      ) : (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
                Character roster
              </p>
              <p className="text-sm text-slate-300">
                Showing <span className="font-semibold text-white">{characters.length}</span> of{' '}
                <span className="font-semibold text-white">{data?.count ?? 0}</span> records
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isFetching}
              onClick={() => {
                void refetch();
              }}
            >
              <FaSyncAlt aria-hidden="true" className={isFetching ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />
              {isFetching ? 'Refreshing' : 'Refresh'}
            </button>
          </div>

          {showInlineError ? (
            <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-4 text-amber-50">
              <p className="text-sm font-semibold">The latest page request failed.</p>
              <p className="mt-1 text-sm text-amber-100/90">
                {error instanceof Error ? error.message : 'Unknown API error.'}
              </p>
            </div>
          ) : null}

          {data && characters.length > 0 ? (
            <CharacterGrid
              characters={characters}
              onSelect={(character) => {
                setSelectedCharacter(character);
              }}
              page={page}
            />
          ) : (
            <PeopleEmptyState
              onRetry={() => {
                void refetch();
              }}
            />
          )}

          <div className="flex flex-col gap-3">
            {isFetching && data ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                Refreshing characters from the API...
              </div>
            ) : null}
            <Pagination
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              onNext={() => {
                setSelectedCharacter(null);
                setPage((currentPage) => currentPage + 1);
              }}
              onPrevious={() => {
                setSelectedCharacter(null);
                setPage((currentPage) => Math.max(1, currentPage - 1));
              }}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </section>
      )}

      {selectedCharacter ? (
        <CharacterDetailsModal
          character={selectedCharacter}
          onClose={() => {
            setSelectedCharacter(null);
          }}
        />
      ) : null}
    </PageShell>
  );
}
