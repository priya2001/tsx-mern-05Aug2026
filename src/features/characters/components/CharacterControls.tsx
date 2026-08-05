import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import type { FilterOption } from '../utils/characterFilters';

type CharacterControlsProps = {
  searchTerm: string;
  homeworld: string;
  species: string;
  film: string;
  homeworldOptions: FilterOption[];
  speciesOptions: FilterOption[];
  filmOptions: FilterOption[];
  activeFiltersCount: number;
  onSearchChange: (value: string) => void;
  onHomeworldChange: (value: string) => void;
  onSpeciesChange: (value: string) => void;
  onFilmChange: (value: string) => void;
  onReset: () => void;
};

const selectClassName =
  'w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-hyperspace-300/60 focus:ring-2 focus:ring-hyperspace-200/20';

export function CharacterControls({
  searchTerm,
  homeworld,
  species,
  film,
  homeworldOptions,
  speciesOptions,
  filmOptions,
  activeFiltersCount,
  onSearchChange,
  onHomeworldChange,
  onSpeciesChange,
  onFilmChange,
  onReset,
}: CharacterControlsProps): JSX.Element {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-hyperspace-100">
            Search and filters
          </p>
          <h2 className="text-2xl font-black text-white">Find your character</h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-300">
            Search by character name and combine the results with homeworld, species, or film filters.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={activeFiltersCount === 0}
          onClick={onReset}
        >
          <FaTimes aria-hidden="true" className="h-3.5 w-3.5" />
          Clear filters
        </button>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
        <label className="space-y-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            <FaSearch aria-hidden="true" className="h-3 w-3" />
            Search
          </span>
          <input
            aria-label="Search characters"
            className={selectClassName}
            placeholder="Type a character name"
            value={searchTerm}
            onChange={(event) => {
              onSearchChange(event.target.value);
            }}
          />
        </label>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            <FaFilter aria-hidden="true" className="h-3 w-3" />
            Homeworld
          </span>
          <select
            aria-label="Filter by homeworld"
            className={selectClassName}
            value={homeworld}
            onChange={(event) => {
              onHomeworldChange(event.target.value);
            }}
          >
            <option value="">All homeworlds</option>
            {homeworldOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            <FaFilter aria-hidden="true" className="h-3 w-3" />
            Species
          </span>
          <select
            aria-label="Filter by species"
            className={selectClassName}
            value={species}
            onChange={(event) => {
              onSpeciesChange(event.target.value);
            }}
          >
            <option value="">All species</option>
            {speciesOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            <FaFilter aria-hidden="true" className="h-3 w-3" />
            Film
          </span>
          <select
            aria-label="Filter by film"
            className={selectClassName}
            value={film}
            onChange={(event) => {
              onFilmChange(event.target.value);
            }}
          >
            <option value="">All films</option>
            {filmOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
