const stats = [
  { label: 'Tasks shipped', value: '128' },
  { label: 'Active users', value: '4.8k' },
  { label: 'Uptime', value: '99.98%' },
];

const highlights = [
  {
    title: 'Fast by default',
    body: 'A lean Vite + React + TypeScript setup with no extra framework weight.',
  },
  {
    title: 'Designed to feel intentional',
    body: 'Layered gradients, crisp typography, and a dashboard-style layout give the app a distinctive look.',
  },
  {
    title: 'Ready to extend',
    body: 'The structure is simple, typed, and easy to grow into a real product surface.',
  },
];

export default function App() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">React + TypeScript + Vite</span>
          <h1>Pulse Atelier</h1>
          <p className="lede">
            A calm, modern starter with a strong visual identity and a clean technical foundation.
          </p>

          <div className="actions">
            <a className="button button-primary" href="#highlights">
              Explore the build
            </a>
            <a className="button button-secondary" href="#metrics">
              View metrics
            </a>
          </div>
        </div>

        <div className="hero-panel" aria-label="Project summary">
          <div className="panel-top">
            <span className="status-dot" />
            Live system overview
          </div>
          <div className="panel-card">
            <div>
              <p className="panel-label">Session health</p>
              <strong>Stable</strong>
            </div>
            <div>
              <p className="panel-label">Deploy target</p>
              <strong>main</strong>
            </div>
          </div>
          <div className="panel-chart" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="stats" id="metrics">
        {stats.map((item) => (
          <article key={item.label} className="stat-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="highlights" id="highlights">
        {highlights.map((item) => (
          <article key={item.title} className="highlight-card">
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

