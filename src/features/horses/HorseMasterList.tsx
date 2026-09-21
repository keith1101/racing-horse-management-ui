import type { ReactNode } from 'react';
import { SearchInput } from '../../components/SearchInput';
import { EmptyState, ListSkeleton } from '../../components/states';
import { HealthBadge, type HealthStatus } from '../../components/StatusBadge';
import { HorseListItem } from './HorseListItem';
import { HEALTH_ORDER, type Horse } from './horseData';

interface HorseMasterListProps {
  horses: Horse[];
  totalCount: number;
  search: string;
  onSearch: (v: string) => void;
  healthFilter: HealthStatus | 'ALL';
  onHealthFilter: (v: HealthStatus | 'ALL') => void;
  selectedId?: string;
  onSelect: (id: string) => void;
  loading?: boolean;
  onClear: () => void;
  hasActiveFilters: boolean;
  isGroom?: boolean;
  groomScope?: 'my' | 'all';
  onGroomScopeChange?: (v: 'my' | 'all') => void;
  myCount?: number;
}

export function HorseMasterList({
  horses,
  totalCount,
  search,
  onSearch,
  healthFilter,
  onHealthFilter,
  selectedId,
  onSelect,
  loading = false,
  onClear,
  hasActiveFilters,
  isGroom,
  groomScope = 'all',
  onGroomScopeChange,
  myCount,
}: HorseMasterListProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Sticky search + quick health filter */}
      <div className="shrink-0 space-y-2 border-b border-[var(--color-border)] p-2.5">
        {isGroom && onGroomScopeChange && (
          <div className="grid grid-cols-2 gap-1 p-0.5 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs">
            <button
              type="button"
              onClick={() => onGroomScopeChange('my')}
              className={`py-1 text-center font-medium rounded transition-colors ${
                groomScope === 'my'
                  ? 'bg-[var(--color-surface)] text-[var(--color-primary)] font-semibold shadow-xs'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              My Assigned ({myCount ?? 0})
            </button>
            <button
              type="button"
              onClick={() => onGroomScopeChange('all')}
              className={`py-1 text-center font-medium rounded transition-colors ${
                groomScope === 'all'
                  ? 'bg-[var(--color-surface)] text-[var(--color-primary)] font-semibold shadow-xs'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              All Horses ({totalCount})
            </button>
          </div>
        )}
        <SearchInput
          value={search}
          onChange={onSearch}
          label="Search horses"
          placeholder="Search horses…"
        />
        <div className="flex items-center gap-1 overflow-x-auto scroll-slim">
          <FilterChip
            active={healthFilter === 'ALL'}
            onClick={() => onHealthFilter('ALL')}
          >
            All
          </FilterChip>
          {HEALTH_ORDER.map((h) => (
            <FilterChip key={h} active={healthFilter === h} onClick={() => onHealthFilter(h)}>
              <HealthBadge status={h} size="sm" />
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Count row */}
      <div className="flex shrink-0 items-center justify-between px-3 py-1.5 text-[11px] text-[var(--color-text-muted)]">
        <span>
          {loading ? 'Loading…' : `${horses.length} of ${totalCount} horses`}
        </span>
        {hasActiveFilters && !loading && (
          <button
            onClick={onClear}
            className="font-medium text-[var(--color-primary)] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* List */}
      <div className="scroll-slim min-h-0 flex-1 overflow-y-auto px-1.5 pb-2">
        {loading ? (
          <ListSkeleton rows={8} />
        ) : horses.length === 0 ? (
          <EmptyState
            icon="search"
            title="No horses match"
          />
        ) : (
          <div className="space-y-0.5">
            {horses.map((h) => (
              <HorseListItem
                key={h.id}
                horse={h}
                selected={h.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        'shrink-0 rounded-[var(--radius-xs)] px-2 py-1 text-[12px] font-medium outline-none transition-colors ' +
        'focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' +
        (active
          ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]')
      }
    >
      {children}
    </button>
  );
}
