import { useEffect, useState } from 'react';
import { Icon } from './Icon';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
}

/** Debounced search input (150ms). Reports up to parent while staying responsive locally. */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  label,
  className = '',
}: SearchInputProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 150);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Icon
        name="search"
        size={15}
        className="pointer-events-none absolute left-2.5 text-[var(--color-text-muted)]"
      />
      <input
        type="search"
        aria-label={label}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className={
          'h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] ' +
          'bg-[var(--color-surface)] pl-8 pr-2.5 text-[13px] text-[var(--color-text-primary)] ' +
          'outline-none transition-colors placeholder:text-[var(--color-text-muted)] ' +
          'hover:border-[var(--color-text-muted)] focus-visible:border-[var(--color-focus)] ' +
          'focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30'
        }
      />
    </div>
  );
}
