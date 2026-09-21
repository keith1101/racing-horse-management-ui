import type { ReactNode } from 'react';
import { HorseAvatar } from '../features/horses/HorseAvatar';
import { Icon } from './Icon';

interface HorseMiniCardProps {
  name: string;
  image: string;
  meta?: ReactNode;
  right?: ReactNode;
  locked?: boolean;
  selected?: boolean;
  onClick?: () => void;
  size?: number;
}

/** Compact horse identity row used across dashboards, boards and panels. */
export function HorseMiniCard({
  name,
  image,
  meta,
  right,
  locked,
  selected,
  onClick,
  size = 34,
}: HorseMiniCardProps) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={
        'flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-1.5 text-left outline-none transition-colors ' +
        (onClick ? 'focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' : '') +
        (selected
          ? 'bg-[var(--color-primary-soft)]'
          : onClick
            ? 'hover:bg-[var(--color-surface-muted)]'
            : '')
      }
    >
      <HorseAvatar name={name} image={image} size={size} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span
            className={
              'truncate text-[13px] font-medium ' +
              (selected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]')
            }
          >
            {name}
          </span>
          {locked && (
            <Icon name="lock" size={12} className="shrink-0 text-[var(--color-danger)]" />
          )}
        </div>
        {meta && <div className="truncate text-[11px] text-[var(--color-text-muted)]">{meta}</div>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </Wrapper>
  );
}
