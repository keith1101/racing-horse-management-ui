import { useMemo } from 'react';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Icon, type IconName } from '../../components/Icon';
import { HealthBadge } from '../../components/StatusBadge';
import { useRtms } from '../../app/RtmsContext';
import { GROOMS, MAX_STALLS_PER_GROOM, type Horse, type ScheduleEntry } from './horseData';

function formatFoaled(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const scheduleAccent: Record<ScheduleEntry['type'], string> = {
  Training: 'bg-[var(--color-training)]',
  Treatment: 'bg-[var(--color-medical)]',
  'Preventive care': 'bg-[var(--color-medical)]',
  'Groom task': 'bg-[var(--color-grooming)]',
  Race: 'bg-[var(--color-racing)]',
};

export function HorseOverview({ horse }: { horse: Horse }) {
  const { can, stallAssignments, assignGroomToStall, toast } = useRtms();
  const canManageTraining = can('training.manage');
  const currentAssignedGroom = stallAssignments[horse.stall] ?? horse.assignedGroom ?? '';

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

  return (
    <div className="space-y-4">
      {/* Row 1: Basic info + current health */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel padded>
          <SectionTitle>Basic information</SectionTitle>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
            <Field label="Date of birth" value={`${formatFoaled(horse.foaled)} (${horse.ageYears} yrs)`} />
            <Field label="Sex" value={horse.sex} />
            <Field label="Breed" value={horse.breed} />
            <Field label="Microchip" value={horse.microchip} mono />
            <Field label="Sire" value={horse.sire} />
            <Field label="Dam" value={horse.dam} />
            <Field label="Owner" value={horse.owner} />
            <Field label="Trainer" value={horse.trainer} />
            <Field label="Stall Location" value={`${horse.stable} · Stall ${horse.stall}`} />
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
                Assigned Groom
              </dt>
              <dd className="mt-1">
                {canManageTraining ? (
                  <select
                    value={currentAssignedGroom}
                    onChange={(e) => {
                      const newGroom = e.target.value;
                      const res = assignGroomToStall(horse.stall, newGroom);
                      if (!res.success) {
                        toast(res.message, 'error');
                      } else {
                        toast(`Assigned ${newGroom || 'nobody'} to Stall ${horse.stall} (${horse.name})`, 'success');
                      }
                    }}
                    className="h-7 w-full max-w-[170px] rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2 text-[12px] font-medium text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <option value="">Unassigned</option>
                    {GROOMS.map((g) => {
                      const count = groomWorkloads[g] || 0;
                      const isCurrent = g === currentAssignedGroom;
                      const isFull = count >= MAX_STALLS_PER_GROOM && !isCurrent;
                      return (
                        <option key={g} value={g} disabled={isFull}>
                          {g} ({count}/{MAX_STALLS_PER_GROOM}{isFull ? ' - Full' : ''})
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <span className="text-[13px] font-medium text-[var(--color-text-primary)]">
                    {currentAssignedGroom || 'Unassigned'}
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </Panel>

        <div className="space-y-4">
          {/* Approved Feed Ration - Critical for Groom & Care Staff */}
          <Panel padded className="border-l-4 border-l-[var(--color-primary)]">
            <div className="flex items-center justify-between">
              <SectionTitle>Approved Feed Ration</SectionTitle>
              <span className="rounded bg-[var(--color-success-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-success)]">
                Nutrition Approved
              </span>
            </div>
            <p className="mt-2 text-[13px] font-medium leading-relaxed text-[var(--color-text-primary)]">
              {horse.approvedFeedRation || '4.0 kg/day Performance grain mix, timothy hay twice daily & electrolyte supplements'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] pt-2.5 text-[11px] text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <Icon name="clock" size={12} className="text-[var(--color-primary)]" />
                Times: 05:30 (Morning) · 11:30 (Midday) · 16:30 (Evening)
              </span>
              <span className="flex items-center gap-1">
                <Icon name="user" size={12} className="text-[var(--color-text-secondary)]" />
                Groom: <strong>{currentAssignedGroom || 'Unassigned'}</strong>
              </span>
            </div>
          </Panel>

          <Panel padded>
            <div className="flex items-center justify-between">
              <SectionTitle>Current health</SectionTitle>
              <HealthBadge status={horse.health} />
            </div>
            <p className="mt-2 text-[13px] text-[var(--color-text-secondary)]">{horse.healthNote}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Metric icon="activity" label="Weight" value={horse.weightKg} unit="kg" />
              <Metric icon="heart-pulse" label="Resting HR" value={horse.restingHrBpm} unit="bpm" />
            </div>
          </Panel>

          <Panel padded>
            <div className="flex items-center justify-between">
              <SectionTitle>Current training</SectionTitle>
              <span className="text-[11px] font-medium text-[var(--color-text-muted)]">
                Readiness: <span className="text-[var(--color-text-primary)]">{horse.readiness}</span>
              </span>
            </div>
            <dl className="mt-3 space-y-2.5">
              <Field label="Active plan" value={horse.activePlan} />
              <Field label="Phase" value={horse.phase} />
              <Field label="Next workout" value={horse.nextWorkout} />
            </dl>
          </Panel>
        </div>
      </div>

      {/* Row 2: schedule + activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel padded>
          <SectionTitle>Upcoming schedule</SectionTitle>
          {horse.schedule.length === 0 ? (
            <p className="mt-3 text-[13px] text-[var(--color-text-muted)]">
              No scheduled activity today.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {horse.schedule.map((s, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${scheduleAccent[s.type]}`}
                    aria-hidden="true"
                  />
                  <span className="font-metric w-12 shrink-0 text-[12px] text-[var(--color-text-secondary)]">
                    {s.time}
                  </span>
                  <span className="flex-1 truncate text-[13px] text-[var(--color-text-primary)]">
                    {s.title}
                  </span>
                  <span className="shrink-0 text-[11px] text-[var(--color-text-muted)]">{s.staff}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel padded>
          <SectionTitle>Recent activity</SectionTitle>
          <ul className="mt-3 space-y-3">
            {horse.activity.map((a, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-strong)]" />
                <div className="min-w-0">
                  <p className="text-[13px] text-[var(--color-text-primary)]">{a.event}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    {a.actor} · {a.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <dd className={`mt-0.5 text-[13px] text-[var(--color-text-primary)] ${mono ? 'font-metric' : ''}`}>
        {value}
      </dd>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  unit,
}: {
  icon: IconName;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] p-2.5">
      <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
        <Icon name={icon} size={13} />
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-metric text-[18px] font-semibold text-[var(--color-text-primary)]">
          {value.toLocaleString('en-GB')}
        </span>
        <span className="text-[12px] text-[var(--color-text-secondary)]">{unit}</span>
      </div>
    </div>
  );
}
