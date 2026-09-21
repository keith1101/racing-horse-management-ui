import { Icon } from '../../components/Icon';
import { HealthBadge } from '../../components/StatusBadge';
import { HorseAvatar } from './HorseAvatar';
import type { Horse } from './horseData';

interface HorseListItemProps {
  horse: Horse;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function HorseListItem({ horse, selected, onSelect }: HorseListItemProps) {
  return (
    <button
      onClick={() => onSelect(horse.id)}
      aria-current={selected ? 'true' : undefined}
      className={
        'relative flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] py-2 pl-2.5 pr-2 text-left ' +
        'outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' +
        (selected
          ? 'bg-[var(--color-primary-subtle)]'
          : 'hover:bg-[var(--color-surface-subtle)]')
      }
    >
      {selected && (
        <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-[var(--color-primary)]" />
      )}
      <HorseAvatar name={horse.name} image={horse.image} size={38} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`truncate text-[13px] ${
              selected
                ? 'font-semibold text-[var(--color-text-primary)]'
                : 'font-medium text-[var(--color-text-primary)]'
            }`}
          >
            {horse.name}
          </span>
          {horse.lock && (
            <Icon
              name="lock"
              size={12}
              className="shrink-0 text-[var(--color-danger)]"
              aria-label="Training locked"
            />
          )}
        </div>
        <div className="truncate text-[11px] text-[var(--color-text-muted)]">
          {horse.stable} · {horse.stall} · {horse.sex}
        </div>
      </div>
      <HealthBadge status={horse.health} size="sm" />
    </button>
  );
}
