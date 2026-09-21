import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Icon, type IconName } from '../../components/Icon';
import { HealthBadge } from '../../components/StatusBadge';
import type { Horse, ScheduleEntry } from './horseData';

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
            <Field label="Stable" value={horse.stable} />
            <Field label="Stall" value={horse.stall} />
          </dl>
        </Panel>

        <div className="space-y-4">
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
