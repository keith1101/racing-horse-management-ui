import { useMemo, useState } from 'react';
import { Drawer } from '../../components/Drawer';
import { Button } from '../../components/Button';
import { Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { HorseAvatar } from './HorseAvatar';
import { HealthBadge } from '../../components/StatusBadge';
import { useRtms } from '../../app/RtmsContext';
import { GROOMS, MAX_STALLS_PER_GROOM, STABLES } from './horseData';

interface StallAssignmentModalProps {
  open: boolean;
  onClose: () => void;
}

export function StallAssignmentModal({ open, onClose }: StallAssignmentModalProps) {
  const { horses, stallAssignments, assignGroomToStall } = useRtms();
  const [selectedBarn, setSelectedBarn] = useState<string>('ALL');

  // Count current assignments per groom
  const groomWorkloads = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const groom of GROOMS) {
      counts[groom] = 0;
    }
    for (const groom of Object.values(stallAssignments)) {
      if (groom && counts[groom] !== undefined) {
        counts[groom] = (counts[groom] || 0) + 1;
      }
    }
    return counts;
  }, [stallAssignments]);

  const stallsList = useMemo(() => {
    return horses.map((h) => ({
      stallCode: h.stall,
      barn: h.stable,
      horse: h,
      currentGroom: stallAssignments[h.stall] ?? h.assignedGroom ?? '',
    })).sort((a, b) => a.stallCode.localeCompare(b.stallCode));
  }, [horses, stallAssignments]);

  const filteredStalls = useMemo(() => {
    if (selectedBarn === 'ALL') return stallsList;
    return stallsList.filter((s) => s.barn === selectedBarn);
  }, [selectedBarn, stallsList]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Stall & Groom Assignment"
      subtitle="Assign grooms to horse stalls (Head Trainer oversight · Maximum 3 stalls per groom)"
      footer={
        <Button variant="primary" size="sm" onClick={onClose}>
          Done
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Groom Workload Overview */}
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[var(--color-text-primary)]">
              Groom Workload Capacity
            </span>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              Policy: Max {MAX_STALLS_PER_GROOM} stalls / groom
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {GROOMS.map((groom) => {
              const count = groomWorkloads[groom] || 0;
              const isMax = count >= MAX_STALLS_PER_GROOM;
              return (
                <div
                  key={groom}
                  className={
                    'flex items-center justify-between rounded-[var(--radius-sm)] border p-2 ' +
                    (isMax
                      ? 'border-[var(--color-warning)]/40 bg-[var(--color-warning-soft)]/20'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)]')
                  }
                >
                  <div className="min-w-0">
                    <span className="block truncate text-[12px] font-medium text-[var(--color-text-primary)]">
                      {groom}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {isMax ? 'At maximum capacity' : `${MAX_STALLS_PER_GROOM - count} stall slot available`}
                    </span>
                  </div>
                  <Pill tone={isMax ? 'warning' : 'success'} size="sm">
                    {count}/{MAX_STALLS_PER_GROOM}
                  </Pill>
                </div>
              );
            })}
          </div>
        </div>

        {/* Barn filter tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-[var(--color-border)] pb-2">
          <button
            onClick={() => setSelectedBarn('ALL')}
            className={
              'rounded-[var(--radius-xs)] px-2.5 py-1 text-[12px] font-medium outline-none transition-colors ' +
              (selectedBarn === 'ALL'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]')
            }
          >
            All Stalls ({stallsList.length})
          </button>
          {STABLES.map((barn) => (
            <button
              key={barn}
              onClick={() => setSelectedBarn(barn)}
              className={
                'rounded-[var(--radius-xs)] px-2.5 py-1 text-[12px] font-medium outline-none transition-colors ' +
                (selectedBarn === barn
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]')
              }
            >
              {barn} ({stallsList.filter((s) => s.barn === barn).length})
            </button>
          ))}
        </div>

        {/* Stalls List */}
        <div className="space-y-2.5">
          {filteredStalls.map((s) => {
            return (
              <div
                key={s.stallCode}
                className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Stall & Horse Info */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-11 shrink-0 flex-col items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] text-center">
                    <span className="font-metric text-[12px] font-bold text-[var(--color-text-primary)]">
                      {s.stallCode}
                    </span>
                    <span className="text-[9px] text-[var(--color-text-muted)] leading-tight">
                      {s.barn.replace('Barn ', '')}
                    </span>
                  </div>

                  <HorseAvatar name={s.horse.name} image={s.horse.image} size={36} />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-semibold text-[var(--color-text-primary)]">
                        {s.horse.name}
                      </span>
                      <HealthBadge status={s.horse.health} size="sm" />
                    </div>
                    <span className="block truncate text-[11px] text-[var(--color-text-muted)]">
                      {s.horse.breed} · {s.horse.owner}
                    </span>
                  </div>
                </div>

                {/* Groom Selector with 3-Stall Constraint Check */}
                <div className="flex items-center gap-2 sm:self-auto self-end">
                  <label className="sr-only" htmlFor={`groom-${s.stallCode}`}>
                    Assigned Groom for Stall {s.stallCode}
                  </label>
                  <select
                    id={`groom-${s.stallCode}`}
                    aria-label={`Assigned Groom for Stall ${s.stallCode}`}
                    value={s.currentGroom}
                    onChange={(e) => assignGroomToStall(s.stallCode, e.target.value)}
                    className="h-8.5 rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[12px] font-medium text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <option value="">Unassigned</option>
                    {GROOMS.map((g) => {
                      const count = groomWorkloads[g] || 0;
                      const isCurrent = s.currentGroom === g;
                      const isFull = count >= MAX_STALLS_PER_GROOM && !isCurrent;
                      return (
                        <option
                          key={g}
                          value={g}
                          disabled={isFull}
                        >
                          {g} ({count}/{MAX_STALLS_PER_GROOM}{isFull ? ' - Max limit' : ''})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guidance Note */}
        <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
          <Icon name="shield" size={13} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
          Under database schema <code className="font-mono text-[10px]">stable_stalls.groom_id</code>, each groom handles up to 3 stalls to ensure optimal morning workout assist and welfare coverage.
        </p>
      </div>
    </Drawer>
  );
}
