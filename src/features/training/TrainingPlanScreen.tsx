import { useMemo, useState } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { ProgressBar } from '../../components/ProgressBar';
import { DataTable, type Column } from '../../components/DataTable';
import { Pill } from '../../components/StatusBadge';
import { HorseAvatar } from '../horses/HorseAvatar';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/states';
import { TrainingLockBanner } from '../../components/TrainingLockBanner';
import { MetricCard } from '../../components/MetricCard';
import { useRtms } from '../../app/RtmsContext';
import { DETAILED_PLANS, type TrainingSession, type TrainingResult } from './trainingData';

import { CreateTrainingPlanModal } from './CreateTrainingPlanModal';

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

export function TrainingPlanScreen() {
  const { route, navigate, getHorse, isLocked, getLock, can, detailedPlans } = useRtms();
  const [createOpen, setCreateOpen] = useState(false);
  const horse = getHorse(route.horseId);
  const plan = horse ? detailedPlans[horse.id] ?? DETAILED_PLANS[horse.id] : undefined;

  const allSessions = useMemo(
    () => (plan ? plan.phases.flatMap((p) => p.sessions) : []),
    [plan],
  );
  const [selectedResultId, setSelectedResultId] = useState<string | undefined>(
    () => allSessions.find((s) => s.result)?.id,
  );

  if (!horse || !plan) {
    return (
      <Screen title="Training plan">
        <Panel className="p-0">
          <EmptyState
            icon="clipboard"
            title="No detailed plan for this horse yet"
            description="This horse does not have a structured, workout-level training plan. Select a course template to generate a new workout schedule."
            action={
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" icon="arrow-left" onClick={() => navigate('training')}>
                  Back to training
                </Button>
                {horse && can('training.manage') && !isLocked(horse.id) && (
                  <Button variant="primary" size="sm" icon="plus" onClick={() => setCreateOpen(true)}>
                    Assign course plan
                  </Button>
                )}
              </div>
            }
          />
        </Panel>
        {horse && <CreateTrainingPlanModal open={createOpen} onClose={() => setCreateOpen(false)} preselectedHorseId={horse.id} />}
      </Screen>
    );
  }

  const locked = isLocked(horse.id);
  const lock = getLock(horse.id);
  const selectedResult = allSessions.find((s) => s.id === selectedResultId && s.result);

  const columns: Column<TrainingSession>[] = [
    { key: 'date', header: 'Date', width: '72px', render: (s) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{s.date}</span>, sortValue: (s) => s.date },
    { key: 'session', header: 'Workout', render: (s) => <span className="text-[13px] font-medium">{s.session}</span> },
    { key: 'distance', header: 'Distance', render: (s) => <span className="font-metric text-[12px]">{s.distance}</span> },
    { key: 'surface', header: 'Surface', render: (s) => <span className="text-[12px] text-[var(--color-text-secondary)]">{s.surface}</span> },
    { key: 'load', header: 'Load', render: (s) => <Pill tone={loadTone[s.load]} size="sm">{s.load}</Pill> },
    { key: 'intensity', header: 'Intensity', width: '120px', render: (s) => <ProgressBar value={s.intensity} size="sm" tone={s.intensity >= 80 ? 'danger' : s.intensity >= 60 ? 'warning' : 'primary'} />, sortValue: (s) => s.intensity },
    { key: 'status', header: 'Status', render: (s) => <Pill tone={statusTone[s.status]} size="sm">{s.status}</Pill> },
    {
      key: 'result',
      header: 'Result',
      align: 'right',
      render: (s) =>
        s.result ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedResultId(s.id);
            }}
            className={
              'inline-flex items-center gap-1 rounded-[var(--radius-xs)] px-1.5 py-0.5 text-[12px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' +
              (selectedResultId === s.id ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'text-[var(--color-primary)] hover:underline')
            }
          >
            View <Icon name="chevron-right" size={12} />
          </button>
        ) : (
          <span className="text-[12px] text-[var(--color-text-muted)]">—</span>
        ),
    },
  ];

  return (
    <Screen
      title="Training plan"
      context={
        <button onClick={() => navigate('training')} className="inline-flex items-center gap-1 hover:underline">
          <Icon name="arrow-left" size={13} /> Back to training dashboard
        </button>
      }
    >
      {/* Plan header */}
      <Panel padded>
        <div className="flex flex-wrap items-start gap-4">
          <HorseAvatar name={horse.name} image={horse.image} size={56} rounded="md" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)]">{plan.title}</h2>
              <Pill tone={plan.status === 'Active' ? 'primary' : plan.status === 'Completed' ? 'success' : 'neutral'}>
                {plan.status}
              </Pill>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--color-text-secondary)]">
              <Icon name="target" size={14} className="text-[var(--color-text-muted)]" />
              {plan.goal}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
              <Field label="Horse" value={horse.name} />
              <Field label="Trainer" value={plan.trainer} />
              <Field label="Start" value={plan.start} />
              <Field label="Target" value={plan.target} />
            </div>
          </div>
          <div className="w-full sm:w-56">
            <FieldLabel>Plan progress</FieldLabel>
            <div className="mt-1.5">
              <ProgressBar value={plan.progress} tone={locked ? 'danger' : 'primary'} showLabel />
            </div>
          </div>
        </div>
        {locked && lock && (
          <div className="mt-3">
            <TrainingLockBanner
              reason={lock.reason}
              reviewDate={lock.reviewDate}
              veterinarian={lock.veterinarian}
              onView={() => navigate('veterinary', { horseId: horse.id })}
            />
          </div>
        )}
      </Panel>

      {/* Phases + workouts */}
      <div className="mt-4 space-y-4">
        {plan.phases.map((phase) => (
          <Panel key={phase.id} padded>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={
                    'flex h-6 w-6 items-center justify-center rounded-full text-[11px] ' +
                    (phase.status === 'Completed'
                      ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                      : phase.status === 'Active'
                        ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                        : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]')
                  }
                >
                  {phase.status === 'Completed' ? <Icon name="check" size={13} /> : <Icon name="git-branch" size={13} />}
                </span>
                <div>
                  <SectionTitle>{phase.name}</SectionTitle>
                  <div className="text-[11px] text-[var(--color-text-muted)]">{phase.focus}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Pill tone={phase.status === 'Completed' ? 'success' : phase.status === 'Active' ? 'primary' : 'neutral'} size="sm">
                  {phase.status}
                </Pill>
                <span className="font-metric text-[11px] text-[var(--color-text-muted)]">{phase.window}</span>
              </div>
            </div>
            <DataTable
              columns={columns}
              rows={phase.sessions}
              rowKey={(s) => s.id}
              selectedKey={selectedResultId}
              onRowClick={(s) => navigate('training', { view: 'session', refId: s.id })}
            />
          </Panel>
        ))}
      </div>

      {/* Result detail */}
      <Panel padded className="mt-4">
        <SectionTitle>Training result</SectionTitle>
        {selectedResult?.result ? (
          <div className="mt-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[13px] font-medium text-[var(--color-text-primary)]">
                {selectedResult.session} · {selectedResult.distance} · {selectedResult.date}
              </span>
              <Pill tone={assessmentTone[selectedResult.result.assessment]}>{selectedResult.result.assessment}</Pill>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <MetricCard label="Avg speed" value={selectedResult.result.avgSpeed} unit="km/h" icon="gauge" />
              <MetricCard label="Max speed" value={selectedResult.result.maxSpeed} unit="km/h" icon="trending-up" />
              <MetricCard label="Avg HR" value={selectedResult.result.avgHr} unit="bpm" icon="heart-pulse" />
              <MetricCard label="Max HR" value={selectedResult.result.maxHr} unit="bpm" icon="heart-pulse" tone="warning" />
              <MetricCard label="Recovery" value={selectedResult.result.recoveryMin} unit="min" icon="clock" />
            </div>
            <div className="mt-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] p-3">
              <FieldLabel>Trainer notes</FieldLabel>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">{selectedResult.result.notes}</p>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-[13px] text-[var(--color-text-muted)]">
            Select a completed workout's result to view telemetry and assessment.
          </p>
        )}
      </Panel>
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
