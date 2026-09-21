import { useMemo } from 'react';
import { Screen } from '../../components/Screen';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/states';
import { HorseAvatar } from '../horses/HorseAvatar';
import { useRtms } from '../../app/RtmsContext';
import {
  TODAY_SESSIONS,
  DETAILED_PLANS,
  type TrainingSession,
  type TrainingResult,
} from './trainingData';

const loadTone: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral'> = {
  Recovery: 'info',
  Light: 'info',
  Moderate: 'primary',
  Hard: 'warning',
  Peak: 'danger',
};

const statusTone: Record<TrainingSession['status'], 'success' | 'warning' | 'primary' | 'neutral'> = {
  Completed: 'success',
  'In progress': 'primary',
  Scheduled: 'neutral',
  Cancelled: 'warning',
};

const assessmentTone: Record<TrainingResult['assessment'], 'success' | 'warning' | 'danger' | 'primary'> = {
  Excellent: 'success',
  'On target': 'primary',
  'Below target': 'warning',
  Fatigued: 'danger',
};

export function TrainingSessionDetail() {
  const { route, navigate, horses, isLocked } = useRtms();

  const session = useMemo(() => {
    const all: TrainingSession[] = [
      ...TODAY_SESSIONS,
      ...Object.values(DETAILED_PLANS).flatMap((p) => p.phases.flatMap((ph) => ph.sessions)),
    ];
    return all.find((s) => s.id === route.refId);
  }, [route.refId]);

  if (!session) {
    return (
      <Screen
        title="Training session"
        context={
          <button onClick={() => navigate('training')} className="inline-flex items-center gap-1 hover:underline">
            <Icon name="arrow-left" size={13} /> Back to training dashboard
          </button>
        }
      >
        <Panel className="p-0">
          <EmptyState
            icon="calendar"
            title="Session not found"
            description="This training session is unavailable or the link is out of date."
          />
        </Panel>
      </Screen>
    );
  }

  const horse = horses.find((h) => h.id === session.horseId);
  const locked = isLocked(session.horseId);
  const result = session.result;

  return (
    <Screen
      title="Training session"
      context={
        <button onClick={() => navigate('training')} className="inline-flex items-center gap-1 hover:underline">
          <Icon name="arrow-left" size={13} /> Back to training dashboard
        </button>
      }
    >
      {/* Session header */}
      <Panel padded>
        <div className="flex flex-wrap items-start gap-4">
          {horse && <HorseAvatar name={horse.name} image={horse.image} size={56} rounded="md" />}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('horses', { horseId: session.horseId })}
                className="text-[18px] font-semibold text-[var(--color-text-primary)] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                {session.horseName}
              </button>
              {locked && <Icon name="lock" size={14} className="text-[var(--color-danger)]" />}
              <Pill tone={statusTone[session.status]}>{session.status}</Pill>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--color-text-secondary)]">
              <Icon name="activity" size={14} className="text-[var(--color-text-muted)]" />
              {session.session} · {session.distance}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
              <Field label="Date" value={`${session.date}${session.time ? ` · ${session.time}` : ''}`} />
              <Field label="Session type" value={session.session} />
              <Field label="Distance" value={session.distance} />
              <Field label="Surface" value={session.surface} />
              <Field label="Trainer" value={session.trainer} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <FieldLabel>Load</FieldLabel>
              <div className="mt-1">
                <Pill tone={loadTone[session.load]} size="sm">{session.load}</Pill>
              </div>
            </div>
            <div>
              <FieldLabel>Planned intensity</FieldLabel>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-1.5 w-28 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                  <span className="block h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${session.intensity}%` }} />
                </span>
                <span className="font-metric text-[11px] text-[var(--color-text-secondary)]">{session.intensity}%</span>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Result */}
      {result ? (
        <>
          <Panel padded className="mt-4">
            <div className="mb-3 flex items-center justify-between">
              <SectionTitle>Session result</SectionTitle>
              <Pill tone={assessmentTone[result.assessment]}>{result.assessment}</Pill>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <MetricCard label="Avg speed" value={result.avgSpeed} unit="km/h" icon="gauge" />
              <MetricCard label="Max speed" value={result.maxSpeed} unit="km/h" icon="trending-up" />
              <MetricCard label="Avg HR" value={result.avgHr} unit="bpm" icon="heart-pulse" />
              <MetricCard label="Max HR" value={result.maxHr} unit="bpm" icon="heart-pulse" tone="warning" />
              <MetricCard label="Recovery" value={result.recoveryMin} unit="min" icon="clock" />
            </div>
          </Panel>

          <Panel padded className="mt-4">
            <SectionTitle>Trainer assessment</SectionTitle>
            <div className="mt-2 flex items-center gap-2">
              <Pill tone={assessmentTone[result.assessment]} size="sm">{result.assessment}</Pill>
            </div>
            <div className="mt-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] p-3">
              <FieldLabel>Notes</FieldLabel>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">{result.notes}</p>
            </div>
          </Panel>
        </>
      ) : (
        <Panel className="mt-4 p-0">
          <EmptyState
            icon="clock"
            title="Results pending"
            description="Telemetry and trainer assessment will appear here once this session has been completed."
          />
        </Panel>
      )}
    </Screen>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-0.5 text-[13px] text-[var(--color-text-primary)]">{value}</div>
    </div>
  );
}
