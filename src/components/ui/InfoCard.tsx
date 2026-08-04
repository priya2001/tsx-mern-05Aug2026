import type { IconType } from 'react-icons';

type InfoCardProps = {
  title: string;
  value: string;
  description: string;
  icon: IconType;
};

export function InfoCard({ title, value, description, icon: Icon }: InfoCardProps): JSX.Element {
  return (
    <article className="glass-panel flex h-full flex-col gap-4 rounded-3xl p-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-hyperspace-400/15 text-hyperspace-200 ring-1 ring-hyperspace-300/20">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{title}</p>
          <strong className="block text-lg text-slate-50">{value}</strong>
        </div>
      </div>
      <p className="text-sm leading-6 text-slate-300">{description}</p>
    </article>
  );
}
