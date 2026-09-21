import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export type Severity = 'info' | 'warning' | 'critical';

const styles: Record<Severity, { fg: string; bg: string; icon: IconName; label: string }> = {
  info: {
    fg: 'text-[var(--color-info)]',
    bg: 'bg-[var(--color-info-soft)]',
    icon: 'activity',
    label: 'Info',
  },
  warning: {
    fg: 'text-[var(--color-warning)]',
    bg: 'bg-[var(--color-warning-soft)]',
    icon: 'alert-triangle',
    label: 'Warning',
  },
  critical: {
    fg: 'text-[var(--color-danger)]',
    bg: 'bg-[var(--color-danger-soft)]',
    icon: 'alert-triangle',
    label: 'Critical',
  },
};

/** Inline alert token: icon + text + color (never color alone). */
export function AlertIndicator({
  severity,
  children,
  size = 'md',
}: {
  severity: Severity;
  children: ReactNode;
  size?: 'sm' | 'md';
}) {
  const s = styles[severity];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[var(--radius-xs)] font-medium ${s.bg} ${s.fg} ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-[12px]'
      }`}
      title={s.label}
    >
      <Icon name={s.icon} size={size === 'sm' ? 11 : 13} />
      {children}
    </span>
  );
}

/** Small standalone severity dot with accessible label, for tight table cells. */
export function AlertDot({ severity, label }: { severity: Severity; label: string }) {
  const color =
    severity === 'critical'
      ? 'bg-[var(--color-danger)]'
      : severity === 'warning'
        ? 'bg-[var(--color-warning)]'
        : 'bg-[var(--color-info)]';
  return <span className={`inline-block h-2 w-2 rounded-full ${color}`} title={label} aria-label={label} />;
}
