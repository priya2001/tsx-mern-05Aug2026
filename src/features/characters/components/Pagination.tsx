import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type PaginationProps = {
  page: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function Pagination({
  page,
  totalPages,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: PaginationProps): JSX.Element {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl">
      <p className="text-sm text-slate-300">
        Page <span className="font-semibold text-white">{page}</span> of{' '}
        <span className="font-semibold text-white">{totalPages}</span>
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!hasPrevious}
          onClick={onPrevious}
        >
          <FaChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Previous
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-hyperspace-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-hyperspace-200 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!hasNext}
          onClick={onNext}
        >
          Next
          <FaChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
