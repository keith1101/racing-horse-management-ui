import type { ReactNode } from 'react';
import type { IconName } from './Icon';
import { Icon } from './Icon';

export type TimelineTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface TimelineEntry {
  id: string;
  time: string;
  title: ReactNode;
  detail?: ReactNode;
  icon?: IconName;
  tone?: TimelineTone;
}

const dotColor: Record<TimelineTone, string> = {
  default: 'bg-[var(--color-text-muted)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]',
  info: 'bg-[var(--color-info)]',
};

/** Vertical event/treatment timeline with a connecting rail. */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative">
      {entries.map((e, i) => (
        <li key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
          {i < entries.length - 1 && (
            <span className="absolute left-[7px] top-4 h-full w-px bg-[var(--color-border)]" aria-hidden="true" />
          )}
          <span
            className={`relative mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
              e.icon ? 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]' : dotColor[e.tone ?? 'default']
            }`}
          >
            {e.icon && <Icon name={e.icon} size={10} />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[13px] font-medium text-[var(--color-text-primary)]">{e.title}</span>
              <span className="font-metric shrink-0 text-[11px] text-[var(--color-text-muted)]">{e.time}</span>
            </div>
            {e.detail && (
              <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--color-text-secondary)]">{e.detail}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
