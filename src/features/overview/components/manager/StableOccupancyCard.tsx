import { useMemo } from 'react';
import { Panel, SectionTitle } from '../../../../components/Panel';
import { Icon } from '../../../../components/Icon';
import { Pill } from '../../../../components/StatusBadge';
import { ProgressBar } from '../../../../components/ProgressBar';
import { useRtms } from '../../../../app/RtmsContext';
import { STABLES } from '../../../horses/horseData';

interface BarnCapacity {
  name: string;
  subtitle: string;
  total: number;
  occupied: number;
  available: number;
  status: 'Full' | 'Nearly full' | 'Available';
  statusTone: 'danger' | 'warning' | 'success';
}

const BARN_CONFIG: Record<string, { subtitle: string; totalStalls: number }> = {
  'Barn A': { subtitle: 'Active Racing & High Performance', totalStalls: 4 },
  'Barn B': { subtitle: 'Conditioning & Maintenance', totalStalls: 4 },
  'Barn C': { subtitle: 'Recovery & Young Horses', totalStalls: 4 },
  Isolation: { subtitle: 'Medical Quarantine & Intake Stalls', totalStalls: 4 },
};

export function StableOccupancyCard() {
  const { horses, navigate } = useRtms();

  const { barnStats, totalStalls, totalOccupied, totalAvailable, overallPct } = useMemo(() => {
    let totalCap = 0;
    let totalOcc = 0;

    const stats: BarnCapacity[] = STABLES.map((barn) => {
      const config = BARN_CONFIG[barn] ?? { subtitle: 'Stabling', totalStalls: 4 };
      const occupied = horses.filter((h) => h.stable === barn).length;
      const total = config.totalStalls;
      const available = Math.max(0, total - occupied);

      totalCap += total;
      totalOcc += occupied;

      let status: BarnCapacity['status'] = 'Available';
      let statusTone: BarnCapacity['statusTone'] = 'success';

      if (occupied >= total) {
        status = 'Full';
        statusTone = 'danger';
      } else if (occupied === total - 1) {
        status = 'Nearly full';
        statusTone = 'warning';
      }

      return {
        name: barn,
        subtitle: config.subtitle,
        total,
        occupied,
        available,
        status,
        statusTone,
      };
    });

    const overall = totalCap > 0 ? Math.round((totalOcc / totalCap) * 100) : 0;

    return {
      barnStats: stats,
      totalStalls: totalCap,
      totalOccupied: totalOcc,
      totalAvailable: Math.max(0, totalCap - totalOcc),
      overallPct: overall,
    };
  }, [horses]);

  return (
    <Panel padded>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="building" size={15} className="text-[var(--color-primary)]" />
          <SectionTitle>Stable Occupancy & Capacity</SectionTitle>
        </div>
        <button
          onClick={() => navigate('horses')}
          className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
        >
          View stalls
        </button>
      </div>

      {/* Summary Stat Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Total Capacity Utilization
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="font-metric text-[20px] font-bold text-[var(--color-text-primary)]">
              {totalOccupied} / {totalStalls}
            </span>
            <span className="text-[13px] text-[var(--color-text-secondary)]">
              stalls occupied
            </span>
            <span className="font-metric text-[13px] font-semibold text-[var(--color-primary)]">
              ({overallPct}%)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Pill tone={totalAvailable > 0 ? 'success' : 'danger'} size="sm">
            {totalAvailable > 0 ? `${totalAvailable} stalls available` : 'At maximum capacity'}
          </Pill>
        </div>
      </div>

      {/* Barns Breakdown List */}
      <div className="space-y-3">
        {barnStats.map((barn) => {
          const pct = Math.min(100, Math.round((barn.occupied / barn.total) * 100));
          return (
            <div
              key={barn.name}
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div>
                  <span className="text-[13px] font-bold text-[var(--color-text-primary)]">
                    {barn.name}
                  </span>
                  <span className="ml-2 text-[11px] text-[var(--color-text-muted)]">
                    {barn.subtitle}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-metric text-[12px] font-semibold text-[var(--color-text-primary)]">
                    {barn.occupied} / {barn.total}
                  </span>
                  <Pill tone={barn.statusTone} size="sm">
                    {barn.occupied >= barn.total ? 'FULL' : `${barn.available} available`}
                  </Pill>
                </div>
              </div>

              <ProgressBar
                value={pct}
                tone={barn.statusTone === 'danger' ? 'danger' : barn.statusTone === 'warning' ? 'warning' : 'primary'}
                size="sm"
              />
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
