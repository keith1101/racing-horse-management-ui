import { Icon } from './Icon';

interface TrainingLockBannerProps {
  reason: string;
  reviewDate: string;
  veterinarian?: string;
  onView?: () => void;
  compact?: boolean;
}

export function TrainingLockBanner({
  reason,
  reviewDate,
  veterinarian,
  onView,
  compact = false,
}: TrainingLockBannerProps) {
  return (
    <div
      role="status"
      className={
        'flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-danger)]/25 ' +
        'bg-[var(--color-danger-soft)] text-[var(--color-danger)] ' +
        (compact ? 'px-2.5 py-1.5' : 'px-3 py-2')
      }
    >
      <Icon name="lock" size={compact ? 14 : 16} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-semibold uppercase tracking-wide">Training locked</div>
        {!compact && (
          <div className="truncate text-[12px] text-[var(--color-danger)]/90">
            {reason} · Review {reviewDate}
            {veterinarian ? ` · ${veterinarian}` : ''}
          </div>
        )}
      </div>
      {onView && !compact && (
        <button
          onClick={onView}
          className="shrink-0 rounded-[var(--radius-xs)] px-1.5 py-1 text-[12px] font-medium underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
        >
          View restriction
        </button>
      )}
    </div>
  );
}
