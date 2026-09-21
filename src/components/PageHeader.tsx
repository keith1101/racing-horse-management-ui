import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  context?: ReactNode;
  primary?: ReactNode;
  secondary?: ReactNode;
}

export function PageHeader({ title, context, primary, secondary }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold leading-tight tracking-[-0.01em] text-[var(--color-text-primary)]">
          {title}
        </h1>
        {context && (
          <p className="mt-0.5 text-[13px] text-[var(--color-text-secondary)]">{context}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {secondary}
        {primary}
      </div>
    </div>
  );
}
