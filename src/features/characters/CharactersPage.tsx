import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FaRocket, FaSignOutAlt, FaSyncAlt } from 'react-icons/fa';
import { PEOPLE_PAGE_SIZE } from '../../api/people';
import { env } from '../../config/env';
import { PageShell } from '../../components/layout/PageShell';
import type { Character } from '../../types/swapi';
import { useCharacterCatalogQuery } from './hooks/useCharacterCatalogQuery';
import { CharacterGrid } from './components/CharacterGrid';
import { Pagination } from './components/Pagination';
import {
  PeopleEmptyState,
  PeopleErrorState,
  PeopleLoadingState,
} from './components/PeopleState';
import { CharacterDetailsModal } from './components/CharacterDetailsModal';
import { CharacterControls } from './components/CharacterControls';
import {
  buildCharacterFilterOptions,
  filterCharacters,
  getCharacterTotalPages,
  paginateCharacters,
} from './utils/characterFilters';
import { useAuth } from '../auth/hooks/useAuth';

export function CharactersPage(): JSX.Element {
  const { logout, session, isRefreshing: isAuthRefreshing } = useAuth();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [homeworld, setHomeworld] = useState('');
  const [species, setSpecies] = useState('');
  const [film, setFilm] = useState('');
  const [imageRefreshToken, setImageRefreshToken] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const { data, dataUpdatedAt, error, isError, isFetching, isPending, refetch } =
    useCharacterCatalogQuery();

  const allCharacters = data?.characters ?? [];
  const totalCharacterCount = data?.count ?? 0;
  const filterOptions = buildCharacterFilterOptions(allCharacters);
  const filteredCharacters = filterCharacters(allCharacters, {
    searchTerm,
    homeworld,
    species,
    film,
  });
  const totalPages = getCharacterTotalPages(filteredCharacters.length, PEOPLE_PAGE_SIZE);
  const safePage = Math.min(page, totalPages);
  const pageCharacters = paginateCharacters(filteredCharacters, safePage, PEOPLE_PAGE_SIZE);
  const hasPrevious = safePage > 1;
  const hasNext = safePage < totalPages;
  const showBlockingError = isError && !data;
  const showInlineError = isError && Boolean(data);
  const refreshedAt = dataUpdatedAt > 0 ? format(new Date(dataUpdatedAt), 'HH:mm') : null;
  const activeFiltersCount =
    Number(searchTerm.trim().length > 0) +
    Number(homeworld.length > 0) +
    Number(species.length > 0) +
    Number(film.length > 0);

  useEffect(() => {
    setPage(1);
    setSelectedCharacter(null);
  }, [searchTerm, homeworld, species, film]);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

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
              Browse, search, and filter characters from the public SWAPI `/people` endpoint with
              pagination, loading states, retry handling, and resilient query caching.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current page</p>
            <p className="mt-1 text-2xl font-bold text-white">{safePage}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Catalog</p>
            <p className="mt-1 text-2xl font-bold text-white">{totalCharacterCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signed in</p>
            <p className="mt-1 whitespace-normal break-words text-lg font-bold leading-snug text-white">
              {session?.user.displayName ?? session?.user.username ?? 'Guest'}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
              {refreshedAt ? `Refreshed ${refreshedAt}` : 'Session active'}
            </p>
          </div>
        </div>
      </header>

      {isPending ? (
        <PeopleLoadingState />
      ) : showBlockingError ? (
        <PeopleErrorState
          title="Could not load the character catalog"
          message={error instanceof Error ? error.message : 'Unknown API error.'}
          onRetry={() => {
            void refetch();
          }}
        />
      ) : (
        <section className="space-y-5">
          <CharacterControls
            activeFiltersCount={activeFiltersCount}
            film={film}
            filmOptions={filterOptions.filmOptions}
            homeworld={homeworld}
            homeworldOptions={filterOptions.homeworldOptions}
            onFilmChange={(value) => {
              setFilm(value);
            }}
            onHomeworldChange={(value) => {
              setHomeworld(value);
            }}
            onReset={() => {
              setSearchTerm('');
              setHomeworld('');
              setSpecies('');
              setFilm('');
              setPage(1);
            }}
            onSearchChange={(value) => {
              setSearchTerm(value);
            }}
            onSpeciesChange={(value) => {
              setSpecies(value);
            }}
            searchTerm={searchTerm}
            species={species}
            speciesOptions={filterOptions.speciesOptions}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
                Character roster
              </p>
              <p className="text-sm text-slate-300">
                Showing <span className="font-semibold text-white">{pageCharacters.length}</span> of{' '}
                <span className="font-semibold text-white">{filteredCharacters.length}</span> matching
                records
                {activeFiltersCount > 0 ? (
                  <span className="ml-2 text-hyperspace-100">
                    ({activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''})
                  </span>
                ) : null}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isFetching}
              onClick={() => {
                setImageRefreshToken((currentValue) => currentValue + 1);
                void refetch();
              }}
            >
              <FaSyncAlt
                aria-hidden="true"
                className={isFetching ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'}
              />
              {isFetching ? 'Refreshing' : 'Refresh'}
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:border-rose-300/30 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isAuthRefreshing}
              onClick={() => {
                void logout();
              }}
            >
              <FaSignOutAlt
                aria-hidden="true"
                className={isAuthRefreshing ? 'h-3.5 w-3.5 animate-pulse' : 'h-3.5 w-3.5'}
              />
              {isAuthRefreshing ? 'Signing out' : 'Logout'}
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

          {filteredCharacters.length > 0 ? (
            <CharacterGrid
              characters={pageCharacters}
              onSelect={(character) => {
                setSelectedCharacter(character);
              }}
              page={safePage}
              refreshToken={imageRefreshToken}
            />
          ) : (
            <PeopleEmptyState
              message={
                activeFiltersCount > 0
                  ? 'No characters matched your current search and filters. Clear the filters or try a wider search.'
                  : 'The catalog is empty right now. Try refreshing the request.'
              }
              title={activeFiltersCount > 0 ? 'No matching characters' : 'No characters found'}
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
                setPage((currentPage) => Math.min(totalPages, currentPage + 1));
              }}
              onPrevious={() => {
                setSelectedCharacter(null);
                setPage((currentPage) => Math.max(1, currentPage - 1));
              }}
              page={safePage}
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
