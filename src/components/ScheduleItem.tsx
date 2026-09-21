import type { ReactNode } from 'react';
import type { IconName } from './Icon';
import { Icon } from './Icon';

export type ScheduleTone = 'training' | 'treatment' | 'care' | 'race' | 'neutral';

const toneStyle: Record<ScheduleTone, { bar: string; icon: IconName; fg: string; bg: string }> = {
  training: { bar: 'bg-[var(--color-primary)]', icon: 'activity', fg: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary-soft)]' },
  treatment: { bar: 'bg-[var(--color-danger)]', icon: 'stethoscope', fg: 'text-[var(--color-danger)]', bg: 'bg-[var(--color-danger-soft)]' },
  care: { bar: 'bg-[var(--color-info)]', icon: 'clipboard', fg: 'text-[var(--color-info)]', bg: 'bg-[var(--color-info-soft)]' },
  race: { bar: 'bg-[var(--color-warning)]', icon: 'flag', fg: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning-soft)]' },
  neutral: { bar: 'bg-[var(--color-text-muted)]', icon: 'clock', fg: 'text-[var(--color-text-secondary)]', bg: 'bg-[var(--color-surface-muted)]' },
};

interface ScheduleItemProps {
  time: string;
  tone: ScheduleTone;
  title: ReactNode;
  meta?: ReactNode;
  right?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

/** Dense schedule row with a left tone rail — used in training schedule / day plans. */
export function ScheduleItem({ time, tone, title, meta, right, selected, onClick }: ScheduleItemProps) {
  const s = toneStyle[tone];
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={
        'flex w-full items-stretch gap-3 rounded-[var(--radius-sm)] border px-0 text-left outline-none transition-colors ' +
        (onClick ? 'focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' : '') +
        (selected
          ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] ' + (onClick ? 'hover:border-[var(--color-border-strong)]' : ''))
      }
    >
      <span className={`w-1 shrink-0 rounded-l-[var(--radius-sm)] ${s.bar}`} aria-hidden="true" />
      <span className="flex flex-1 items-center gap-3 py-2 pr-3">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] ${s.bg} ${s.fg}`}>
          <Icon name={s.icon} size={14} />
        </span>
        <span className="font-metric w-12 shrink-0 text-[12px] text-[var(--color-text-secondary)]">{time}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-[var(--color-text-primary)]">{title}</span>
          {meta && <span className="block truncate text-[11px] text-[var(--color-text-muted)]">{meta}</span>}
        </span>
        {right && <span className="shrink-0">{right}</span>}
      </span>
    </Wrapper>
  );
}
