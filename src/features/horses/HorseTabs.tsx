export const HORSE_TABS = [
  'Overview',
  'Pedigree',
  'Health',
  'Training',
  'Race History',
  'Documents',
] as const;

export type HorseTab = (typeof HORSE_TABS)[number];

interface HorseTabsProps {
  active: HorseTab;
  onChange: (tab: HorseTab) => void;
  tabs?: readonly HorseTab[];
}

export function HorseTabs({ active, onChange, tabs = HORSE_TABS }: HorseTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Horse sections"
      className="flex items-center gap-0.5 overflow-x-auto border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 scroll-slim"
    >
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            className={
              'relative shrink-0 px-3 py-2.5 text-[13px] font-medium outline-none transition-colors ' +
              'focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' +
              (isActive
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]')
            }
          >
            {tab}
            {isActive && (
              <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--color-primary)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
