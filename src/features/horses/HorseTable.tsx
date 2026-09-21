import { DataTable, type Column } from '../../components/DataTable';
import { EmptyState } from '../../components/states';
import { HealthBadge, TrainingBadge } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { HorseAvatar } from './HorseAvatar';
import type { Horse } from './horseData';

interface HorseTableProps {
  horses: Horse[];
  selectedId?: string;
  onSelect: (id: string) => void;
  loading?: boolean;
}

export function HorseTable({ horses, selectedId, onSelect, loading }: HorseTableProps) {
  const columns: Column<Horse>[] = [
    {
      key: 'name',
      header: 'Horse',
      width: '22%',
      sortValue: (h) => h.name.toLowerCase(),
      render: (h) => (
        <div className="flex items-center gap-2.5">
          <HorseAvatar name={h.name} image={h.image} size={32} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-medium text-[var(--color-text-primary)]">{h.name}</span>
              {h.lock && (
                <Icon name="lock" size={12} className="text-[var(--color-danger)]" aria-label="Training locked" />
              )}
            </div>
            <div className="truncate text-[11px] text-[var(--color-text-muted)]">
              {h.sex} · {h.breed} · {h.ageYears} yrs
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'health',
      header: 'Health',
      sortValue: (h) => h.health,
      render: (h) => <HealthBadge status={h.health} />,
    },
    {
      key: 'training',
      header: 'Training',
      sortValue: (h) => h.training,
      render: (h) => <TrainingBadge status={h.training} />,
    },
    {
      key: 'plan',
      header: 'Active plan',
      sortValue: (h) => h.activePlan.toLowerCase(),
      render: (h) => (
        <div>
          <div className="text-[13px] text-[var(--color-text-primary)]">{h.activePlan}</div>
          <div className="text-[11px] text-[var(--color-text-muted)]">{h.phase}</div>
        </div>
      ),
    },
    {
      key: 'stable',
      header: 'Stable',
      sortValue: (h) => `${h.stable}${h.stall}`,
      render: (h) => (
        <span className="text-[13px] text-[var(--color-text-secondary)]">
          {h.stable} · {h.stall}
        </span>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      sortValue: (h) => h.owner.toLowerCase(),
      render: (h) => <span className="text-[13px] text-[var(--color-text-secondary)]">{h.owner}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={horses}
      rowKey={(h) => h.id}
      selectedKey={selectedId}
      onRowClick={(h) => onSelect(h.id)}
      loading={loading}
      empty={
        <EmptyState
          icon="search"
          title="No horses match"
        />
      }
    />
  );
}
