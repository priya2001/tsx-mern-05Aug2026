import { FaLock, FaSyncAlt } from 'react-icons/fa';
import { PageShell } from '../../../components/layout/PageShell';

export function AuthLoadingState(): JSX.Element {
  return (
    <PageShell className="items-center justify-center">
      <section className="glass-panel flex w-full max-w-xl flex-col gap-6 rounded-[32px] p-8 text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-hyperspace-100">
          <FaLock aria-hidden="true" className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Securing session
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Checking your authentication state
          </h1>
          <p className="mx-auto max-w-md text-sm leading-6 text-slate-300">
            We are restoring your session and preparing the Star Wars catalog.
          </p>
        </div>
        <div className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-200">
          <FaSyncAlt aria-hidden="true" className="h-4 w-4 animate-spin" />
          Loading secure workspace
        </div>
      </section>
    </PageShell>
  );
}

