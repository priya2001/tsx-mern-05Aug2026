import { FaExclamationTriangle, FaSearch, FaSpinner } from 'react-icons/fa';

type PeopleErrorStateProps = {
  title: string;
  message: string;
  onRetry: () => void;
};

type PeopleEmptyStateProps = {
  onRetry: () => void;
  title?: string;
  message?: string;
};

export function PeopleLoadingState(): JSX.Element {
  return (
    <div
      role="status"
      aria-label="Loading Star Wars characters"
      aria-live="polite"
      className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 text-slate-200">
        <FaSpinner aria-hidden="true" className="h-5 w-5 animate-spin text-hyperspace-300" />
        <p className="text-sm font-medium">Loading Star Wars characters...</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[520px] animate-pulse rounded-[28px] border border-white/10 bg-slate-900/70"
          />
        ))}
      </div>
    </div>
  );
}

export function PeopleErrorState({ title, message, onRetry }: PeopleErrorStateProps): JSX.Element {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-4 rounded-[28px] border border-rose-400/20 bg-rose-500/10 p-6 text-rose-50 backdrop-blur-xl"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 ring-1 ring-rose-300/20">
          <FaExclamationTriangle aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-rose-100/90">{message}</p>
        </div>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
        onClick={onRetry}
      >
        <FaSpinner aria-hidden="true" className="h-3.5 w-3.5" />
        Retry request
      </button>
    </div>
  );
}

export function PeopleEmptyState({
  onRetry,
  title = 'No characters found',
  message = 'The API returned an empty page. Try a different page or retry the request.',
}: PeopleEmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-start gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-hyperspace-400/15 text-hyperspace-100 ring-1 ring-hyperspace-300/20">
          <FaSearch aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-300">{message}</p>
        </div>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full bg-hyperspace-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-hyperspace-200"
        onClick={onRetry}
      >
        Retry request
      </button>
    </div>
  );
}
