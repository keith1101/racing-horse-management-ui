import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../components/AppShell';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Select } from '../../components/Select';
import { SearchInput } from '../../components/SearchInput';
import { EmptyState } from '../../components/states';
import type { HealthStatus } from '../../components/StatusBadge';
import { useRtms, type ModuleId } from '../../app/RtmsContext';
import { HorseMasterList } from './HorseMasterList';
import { HorseDetailPanel } from './HorseDetailPanel';
import { HorseTable } from './HorseTable';
import { RegisterHorseScreen } from './RegisterHorseScreen';
import { STABLES, TRAINERS, OWNERS, type Horse } from './horseData';

type ViewMode = 'split' | 'table';

export function HorseManagementScreen() {
  const { route } = useRtms();
  if (route.view === 'register') return <RegisterHorseScreen />;
  return <HorseManagementListScreen />;
}

function HorseManagementListScreen() {
  const { route, navigate, horses: HORSES, can } = useRtms();

  // Filters
  const [search, setSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState<HealthStatus | 'ALL'>('ALL');
  const [stable, setStable] = useState('');
  const [trainer, setTrainer] = useState('');
  const [owner, setOwner] = useState('');

  // View + selection
  const [view, setView] = useState<ViewMode>('split');
  const [selectedId, setSelectedId] = useState<string | undefined>(
    route.horseId ?? HORSES[0]?.id,
  );
  const [mobileDetail, setMobileDetail] = useState(!!route.horseId);

  // Async states
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (route.horseId) {
      setSelectedId(route.horseId);
      setMobileDetail(true);
    }
  }, [route.horseId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return HORSES.filter((h) => {
      if (healthFilter !== 'ALL' && h.health !== healthFilter) return false;
      if (stable && h.stable !== stable) return false;
      if (trainer && h.trainer !== trainer) return false;
      if (owner && h.owner !== owner) return false;
      if (q) {
        const hay = `${h.name} ${h.owner} ${h.microchip} ${h.sire} ${h.dam}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [HORSES, search, healthFilter, stable, trainer, owner]);

  const selectedHorse: Horse | undefined = useMemo(
    () => filtered.find((h) => h.id === selectedId) ?? filtered[0],
    [filtered, selectedId],
  );

  const hasActiveFilters =
    !!search || healthFilter !== 'ALL' || !!stable || !!trainer || !!owner;

  function clearFilters() {
    setSearch('');
    setHealthFilter('ALL');
    setStable('');
    setTrainer('');
    setOwner('');
  }

  function handleSelect(id: string) {
    setSelectedId(id);
    setMobileDetail(true);
  }

  return (
    <AppShell activeModule={route.module} onNavigate={(id) => navigate(id as ModuleId)}>
      <PageHeader
        title="Horses"
        context={
          <>
            {HORSES.length} active horses · Riverside Training Club ·{' '}
            <span className="text-[var(--color-text-muted)]">Updated 20 Sep 2026, 08:12</span>
          </>
        }
        secondary={
          <div className="flex items-center gap-2">
            <div className="hidden items-center rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] p-0.5 sm:flex">
              <IconButton
                icon="list"
                label="Master / detail view"
                size={16}
                active={view === 'split'}
                onClick={() => setView('split')}
              />
              <IconButton
                icon="grid"
                label="Table view"
                size={16}
                active={view === 'table'}
                onClick={() => setView('table')}
              />
            </div>
          </div>
        }
        primary={
          can('horse.create') ? (
            <Button variant="primary" icon="plus" onClick={() => navigate('horses', { view: 'register' })}>
              Register horse
            </Button>
          ) : undefined
        }
      />

      {/* Content */}
      <div className="min-h-0 flex-1 p-4">
        {view === 'split' ? (
          <div className="flex h-[calc(100vh-9.5rem)] min-h-[520px] gap-4">
            {/* Master */}
            <aside
              className={
                'w-full shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] ' +
                'lg:w-[320px] ' +
                (mobileDetail ? 'hidden lg:block' : 'block')
              }
            >
              <HorseMasterList
                horses={filtered}
                totalCount={HORSES.length}
                search={search}
                onSearch={setSearch}
                healthFilter={healthFilter}
                onHealthFilter={setHealthFilter}
                selectedId={selectedHorse?.id}
                onSelect={handleSelect}
                loading={loading}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </aside>

            {/* Detail */}
            <section
              className={
                'min-w-0 flex-1 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] ' +
                (mobileDetail ? 'block' : 'hidden lg:block')
              }
            >
              <HorseDetailPanel
                horse={selectedHorse}
                loading={loading}
                onBack={() => setMobileDetail(false)}
              />
            </section>
          </div>
        ) : (
          <div className="space-y-3">
            <TableFilterBar
              search={search}
              onSearch={setSearch}
              stable={stable}
              onStable={setStable}
              trainer={trainer}
              onTrainer={setTrainer}
              owner={owner}
              onOwner={setOwner}
              hasActiveFilters={hasActiveFilters}
              onClear={clearFilters}
              count={filtered.length}
              total={HORSES.length}
            />
            <HorseTable
              horses={filtered}
              selectedId={selectedHorse?.id}
              onSelect={handleSelect}
              loading={loading}
            />
            {!loading && filtered.length === 0 && (
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
                <EmptyState
                  icon="search"
                  title="No horses match"
                  description="Adjust your search or filters to see results."
                  action={
                    hasActiveFilters ? (
                      <Button variant="secondary" size="sm" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function TableFilterBar({
  search,
  onSearch,
  stable,
  onStable,
  trainer,
  onTrainer,
  owner,
  onOwner,
  hasActiveFilters,
  onClear,
  count,
  total,
}: {
  search: string;
  onSearch: (v: string) => void;
  stable: string;
  onStable: (v: string) => void;
  trainer: string;
  onTrainer: (v: string) => void;
  owner: string;
  onOwner: (v: string) => void;
  hasActiveFilters: boolean;
  onClear: () => void;
  count: number;
  total: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-full max-w-xs">
        <SearchWrap value={search} onChange={onSearch} />
      </div>
      <Select
        label="Filter by stable"
        placeholder="All stables"
        value={stable}
        onChange={onStable}
        options={STABLES.map((s) => ({ value: s, label: s }))}
      />
      <Select
        label="Filter by trainer"
        placeholder="All trainers"
        value={trainer}
        onChange={onTrainer}
        options={TRAINERS.map((s) => ({ value: s, label: s }))}
      />
      <Select
        label="Filter by owner"
        placeholder="All owners"
        value={owner}
        onChange={onOwner}
        options={OWNERS.map((s) => ({ value: s, label: s }))}
      />
      {hasActiveFilters && (
        <Button variant="tertiary" size="md" icon="x" onClick={onClear}>
          Clear
        </Button>
      )}
      <span className="ml-auto text-[12px] text-[var(--color-text-muted)]">
        {count} of {total} horses
      </span>
    </div>
  );
}

// Local wrapper to reuse the debounced SearchInput within the table filter bar.
function SearchWrap({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      label="Search horses"
      placeholder="Search name, owner, microchip…"
    />
  );
}
