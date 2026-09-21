import { Icon } from './Icon';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label: string;
  placeholder?: string;
}

export function Select({ value, onChange, options, label, placeholder }: SelectProps) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={
          'h-9 appearance-none rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] ' +
          'bg-[var(--color-surface)] pl-2.5 pr-7 text-[13px] text-[var(--color-text-primary)] ' +
          'outline-none transition-colors hover:border-[var(--color-text-muted)] ' +
          'focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30 ' +
          (value ? '' : 'text-[var(--color-text-muted)]')
        }
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevron-down"
        size={14}
        className="pointer-events-none absolute right-2 text-[var(--color-text-muted)]"
      />
    </label>
  );
}
