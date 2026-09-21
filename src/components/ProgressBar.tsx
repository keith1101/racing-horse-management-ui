type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'info';

const toneBg: Record<Tone, string> = {
  primary: 'bg-[var(--color-primary)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]',
  info: 'bg-[var(--color-info)]',
};

interface ProgressBarProps {
  value: number; // 0-100
  tone?: Tone;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, tone = 'primary', showLabel = false, size = 'md' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2">
      <div
        className={`relative flex-1 overflow-hidden rounded-full bg-[var(--color-surface-muted)] ${
          size === 'sm' ? 'h-1.5' : 'h-2'
        }`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full ${toneBg[tone]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="font-metric w-9 shrink-0 text-right text-[11px] text-[var(--color-text-secondary)]">
          {clamped}%
        </span>
      )}
    </div>
  );
}
