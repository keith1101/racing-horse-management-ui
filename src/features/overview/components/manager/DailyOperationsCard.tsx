import { useMemo } from 'react';
import { Panel, SectionTitle } from '../../../../components/Panel';
import { Button } from '../../../../components/Button';
import { Icon } from '../../../../components/Icon';
import { Pill } from '../../../../components/StatusBadge';
import { ProgressBar } from '../../../../components/ProgressBar';
import { useRtms } from '../../../../app/RtmsContext';
import { GROOMS } from '../../../horses/horseData';

export function DailyOperationsCard() {
  const { careTasks, issues, horses, stallAssignments, navigate } = useRtms();

  const totalTasks = careTasks.length;
  const completedTasks = careTasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = careTasks.filter((t) => t.status === 'Pending' || t.status === 'In progress').length;
  const openIncidents = issues.filter((i) => i.status !== 'Resolved');

  const taskCompletionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate horses assigned per groom
  const groomWorkloads = useMemo(() => {
    return GROOMS.map((groom) => {
      // Count horses where assignedGroom matches or stall is mapped
      const assignedHorses = horses.filter((h) => {
        const stallGroom = stallAssignments[h.stall];
        return stallGroom ? stallGroom === groom : h.assignedGroom === groom;
      });
      return {
        name: groom,
        horseCount: assignedHorses.length,
      };
    });
  }, [horses, stallAssignments]);

  const latestOpenIncident = openIncidents[0];

  return (
    <Panel padded>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="check" size={15} className="text-[var(--color-primary)]" />
          <SectionTitle>Daily Operations</SectionTitle>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('stable-care')}>
          View Operations
        </Button>
      </div>

      <p className="mb-3 text-[12px] text-[var(--color-text-secondary)]">
        Real-time monitoring of daily equine care routines, feeding, and shift coverage.
      </p>

      {/* Daily Progress Gauge */}
      <div className="mb-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
        <div className="mb-1.5 flex items-center justify-between text-[12px]">
          <span className="font-medium text-[var(--color-text-primary)]">Care Tasks Progress</span>
          <span className="font-metric font-semibold text-[var(--color-text-primary)]">
            {completedTasks} / {totalTasks} completed ({taskCompletionPct}%)
          </span>
        </div>
        <ProgressBar value={taskCompletionPct} tone="success" size="sm" />

        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[var(--color-border)] pt-2.5 text-center">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Completed</div>
            <div className="font-metric text-[14px] font-bold text-[var(--color-success)]">{completedTasks}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Pending</div>
            <div className="font-metric text-[14px] font-bold text-[var(--color-text-primary)]">{pendingTasks}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Open Incidents</div>
            <div className="font-metric text-[14px] font-bold text-[var(--color-warning)]">{openIncidents.length}</div>
          </div>
        </div>
      </div>

      {/* Incident Alert if open incidents exist */}
      {latestOpenIncident && (
        <div className="mb-3 rounded-[var(--radius-sm)] border border-[var(--color-warning)] bg-[var(--color-warning-soft)]/25 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-warning)]">
              <Icon name="alert-triangle" size={13} />
              Stable Incident
            </div>
            <Pill
              tone={
                latestOpenIncident.severity === 'High' || latestOpenIncident.severity === 'CRITICAL'
                  ? 'danger'
                  : 'warning'
              }
              size="sm"
            >
              {latestOpenIncident.severity}
            </Pill>
          </div>
          <div className="mt-1 text-[13px] font-semibold text-[var(--color-text-primary)]">
            {latestOpenIncident.horseName}
          </div>
          <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
            {latestOpenIncident.observation}
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
            <span>Reported by: {latestOpenIncident.reportedBy || 'Duty Groom'}</span>
            <span>{latestOpenIncident.time}</span>
          </div>
        </div>
      )}

      {/* Groom Roster */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          Grooms on Shift ({GROOMS.length})
        </div>
        {groomWorkloads.map((g) => (
          <div
            key={g.name}
            className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2.5 py-1.5 text-[12px]"
          >
            <span className="font-medium text-[var(--color-text-primary)]">{g.name}</span>
            <span className="text-[11px] text-[var(--color-text-secondary)]">
              {g.horseCount} horses assigned
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
