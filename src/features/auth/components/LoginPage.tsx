import { useState, type FormEvent } from 'react';
import { FaKey, FaLock, FaRocket, FaSignInAlt, FaUser } from 'react-icons/fa';
import { PageShell } from '../../../components/layout/PageShell';
import { AUTH_FAKE_CREDENTIALS } from '../constants/auth';
import { useAuth } from '../hooks/useAuth';

const fieldBaseClasses =
  'w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-hyperspace-200 focus:ring-2 focus:ring-hyperspace-200/30';

export function LoginPage(): JSX.Element {
  const { login, status } = useAuth();
  const [username, setUsername] = useState(AUTH_FAKE_CREDENTIALS.username);
  const [password, setPassword] = useState(AUTH_FAKE_CREDENTIALS.password);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login(username.trim(), password);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to log in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting || status === 'refreshing';

  return (
    <PageShell className="justify-center">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel relative overflow-hidden rounded-[36px] p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.14),transparent_32%)]" />
          <div className="relative space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
              <FaRocket aria-hidden="true" className="h-3.5 w-3.5" />
              Authenticated access
            </span>
            <div className="space-y-3">
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Sign in to explore the galaxy
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                This demo uses a mocked JWT flow so you can log in, keep a session alive with
                silent refresh, and then browse the Star Wars character catalog.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-hyperspace-400/15 text-hyperspace-200">
                  <FaUser aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-white">Fake user account</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">Username and password are mocked.</p>
              </article>
              <article className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-hyperspace-400/15 text-hyperspace-200">
                  <FaLock aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-white">Session storage</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">Login persists across refreshes.</p>
              </article>
              <article className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-hyperspace-400/15 text-hyperspace-200">
                  <FaKey aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-white">Silent refresh ready</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">Tokens can renew automatically.</p>
              </article>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[36px] p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Welcome back
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white">Login</h2>
              <p className="text-sm leading-6 text-slate-300">
                Use the mocked credentials to enter the character catalog.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Username</span>
                <input
                  autoComplete="username"
                  className={fieldBaseClasses}
                  name="username"
                  placeholder="luke.skywalker"
                  type="text"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Password</span>
                <input
                  autoComplete="current-password"
                  className={fieldBaseClasses}
                  name="password"
                  placeholder="Enter password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </label>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Demo credentials</p>
              <p className="mt-1">
                Username: <span className="font-semibold text-hyperspace-100">luke.skywalker</span>
              </p>
              <p>
                Password: <span className="font-semibold text-hyperspace-100">force123</span>
              </p>
            </div>

            {errorMessage ? (
              <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-hyperspace-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-hyperspace-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isBusy}
            >
              <FaSignInAlt aria-hidden="true" className={isBusy ? 'h-4 w-4 animate-pulse' : 'h-4 w-4'} />
              {isBusy ? 'Signing in...' : 'Sign in to the app'}
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

