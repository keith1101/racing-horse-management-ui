import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  label: string;
  size?: number;
  active?: boolean;
}

export function IconButton({
  icon,
  label,
  size = 18,
  active = false,
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={
        'inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] ' +
        'outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' +
        (active
          ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] '
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] ') +
        className
      }
      {...props}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}
