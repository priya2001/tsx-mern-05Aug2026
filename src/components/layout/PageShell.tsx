import type { PropsWithChildren } from 'react';

type PageShellProps = PropsWithChildren<{
  className?: string;
}>;

export function PageShell({ children, className = '' }: PageShellProps): JSX.Element {
  return (
    <main
      className={`mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </main>
  );
}
