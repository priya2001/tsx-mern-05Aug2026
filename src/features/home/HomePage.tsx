import { format } from 'date-fns';
import { FaDatabase, FaRocket, FaSearch, FaShieldAlt } from 'react-icons/fa';
import { buildSwapiUrl } from '../../api/swapi';
import { env } from '../../config/env';
import { PageShell } from '../../components/layout/PageShell';
import { InfoCard } from '../../components/ui/InfoCard';

const scaffoldDate = new Date('2026-08-04T00:00:00.000Z');

const foundationCards = [
  {
    title: 'Query client',
    value: 'Configured',
    description: 'TanStack Query is mounted at the app root with sensible cache defaults.',
    icon: FaRocket,
  },
  {
    title: 'API base URL',
    value: 'SWAPI',
    description: 'Environment-driven API config is ready for the character search phase.',
    icon: FaDatabase,
  },
  {
    title: 'Testing stack',
    value: 'Ready',
    description: 'Vitest, React Testing Library, jest-dom, user-event, and MSW are wired in.',
    icon: FaShieldAlt,
  },
] as const;

const roadmapCards = [
  {
    title: 'Character search',
    description: 'Phase 2 can connect the people endpoint and render live results.',
    icon: FaSearch,
  },
  {
    title: 'Detail experience',
    description: 'We can add a reusable character detail view without changing the foundation.',
    icon: FaDatabase,
  },
  {
    title: 'Production polish',
    description: 'The Tailwind tokens, layout shell, and tests are already positioned for scale.',
    icon: FaRocket,
  },
] as const;

export function HomePage(): JSX.Element {
  return (
    <PageShell className="justify-between">
      <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-hyperspace-400/15 text-hyperspace-200 ring-1 ring-hyperspace-300/20">
            <FaRocket aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Phase 1</p>
            <h1 className="text-lg font-semibold text-slate-50">{env.appName}</h1>
          </div>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Prepared</p>
          <p className="text-sm text-slate-200">{format(scaffoldDate, 'PPP')}</p>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <span className="inline-flex w-fit items-center rounded-full border border-hyperspace-300/20 bg-hyperspace-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-hyperspace-100">
            React, TypeScript, Vite, Tailwind, TanStack Query
          </span>

          <div className="space-y-4">
            <h2 className="max-w-3xl text-4xl font-black leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
              A foundation for exploring the Star Wars galaxy, one character at a time.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              {env.tagline}. The app shell is ready for live data, loading and error states, and
              future character browsing without reshaping the base architecture.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex items-center justify-center rounded-full bg-hyperspace-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-hyperspace-200"
              href="#foundation"
            >
              Inspect the foundation
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10"
              href={buildSwapiUrl('/people/')}
            >
              SWAPI people endpoint
            </a>
          </div>
        </div>

        <aside className="glass-panel rounded-3xl p-6 shadow-glow">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              System status
            </p>
            <p className="mt-2 text-2xl font-bold text-white">Phase 1 complete</p>
          </div>

          <div className="space-y-4">
            {foundationCards.map((card) => (
              <InfoCard
                key={card.title}
                title={card.title}
                value={card.value}
                description={card.description}
                icon={card.icon}
              />
            ))}
          </div>
        </aside>
      </section>

      <section id="foundation" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Architecture notes
            </p>
            <h3 className="mt-2 text-2xl font-bold text-white">Ready for Phase 2 work</h3>
          </div>
          <p className="hidden max-w-xl text-right text-sm text-slate-400 md:block">
            UI, API utilities, shared types, providers, and test setup are separated so future
            character data work can stay focused.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {roadmapCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="glass-panel rounded-3xl p-5">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-hyperspace-200 ring-1 ring-white/10">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-semibold text-white">{card.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-300">{card.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
