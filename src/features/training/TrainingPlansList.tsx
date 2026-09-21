import { useMemo, useState } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle } from '../../components/Panel';
import { DataTable, type Column } from '../../components/DataTable';
import { Select } from '../../components/Select';
import { Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/states';
import { HorseAvatar } from '../horses/HorseAvatar';
import { useRtms } from '../../app/RtmsContext';
import { CreateTrainingPlanModal } from './CreateTrainingPlanModal';
import type { TRAINING_PLAN_SUMMARIES } from './trainingData';

type PlanSummary = (typeof TRAINING_PLAN_SUMMARIES)[number];

function statusOf(p: PlanSummary): 'Active' | 'Draft' | 'Completed' {
  if (p.progress >= 100) return 'Completed';
  if (p.progress === 0) return 'Draft';
  return 'Active';
}

const statusTone: Record<'Active' | 'Draft' | 'Completed', 'primary' | 'neutral' | 'success'> = {
  Active: 'primary',
  Draft: 'neutral',
  Completed: 'success',
};

function uniq(values: string[]): { value: string; label: string }[] {
  return Array.from(new Set(values)).map((v) => ({ value: v, label: v }));
}

export function TrainingPlansList() {
  const { horses, navigate, isLocked, can, trainingPlanSummaries } = useRtms();
  const [horseId, setHorseId] = useState('');
  const [trainer, setTrainer] = useState('');
  const [phase, setPhase] = useState('');
  const [status, setStatus] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const trainerOptions = useMemo(() => uniq(trainingPlanSummaries.map((p) => p.trainer)), [trainingPlanSummaries]);
  const phaseOptions = useMemo(() => uniq(trainingPlanSummaries.map((p) => p.phase)), [trainingPlanSummaries]);
  const horseOptions = useMemo(
    () =>
      trainingPlanSummaries.map((p) => ({
        value: p.horseId,
        label: horses.find((h) => h.id === p.horseId)?.name ?? p.horseId,
      })),
    [horses, trainingPlanSummaries],
  );

  const filtered = useMemo(
    () =>
      trainingPlanSummaries.filter((p) => {
        if (horseId && p.horseId !== horseId) return false;
        if (trainer && p.trainer !== trainer) return false;
        if (phase && p.phase !== phase) return false;
        if (status && statusOf(p) !== status) return false;
        return true;
      }),
    [horseId, trainer, phase, status, trainingPlanSummaries],
  );

  const activeCount = trainingPlanSummaries.filter((p) => statusOf(p) === 'Active').length;
  const avgProgress = Math.round(
    trainingPlanSummaries.reduce((s, p) => s + p.progress, 0) / (trainingPlanSummaries.length || 1),
  );

  const hasFilters = !!(horseId || trainer || phase || status);
  function clearFilters() {
    setHorseId('');
    setTrainer('');
    setPhase('');
    setStatus('');
  }

  const columns: Column<PlanSummary>[] = [
    {
      key: 'horse',
      header: 'Horse',
      render: (p) => {
        const horse = horses.find((h) => h.id === p.horseId);
        const locked = isLocked(p.horseId);
        return (
          <span className="flex items-center gap-2">
            {horse && <HorseAvatar name={horse.name} image={horse.image} size={28} />}
            <span className="text-[13px] font-medium">{horse?.name ?? p.horseId}</span>
            {locked && <Icon name="lock" size={12} className="text-[var(--color-danger)]" />}
          </span>
        );
      },
      sortValue: (p) => horses.find((h) => h.id === p.horseId)?.name ?? p.horseId,
    },
    { key: 'title', header: 'Plan', render: (p) => <span className="text-[13px] font-medium">{p.title}</span>, sortValue: (p) => p.title },
    { key: 'phase', header: 'Phase', render: (p) => <span className="text-[12px] text-[var(--color-text-secondary)]">{p.phase}</span>, sortValue: (p) => p.phase },
    { key: 'trainer', header: 'Trainer', render: (p) => <span className="text-[12px] text-[var(--color-text-secondary)]">{p.trainer}</span>, sortValue: (p) => p.trainer },
    {
      key: 'status',
      header: 'Status',
      render: (p) => {
        const s = statusOf(p);
        return <Pill tone={statusTone[s]} size="sm">{s}</Pill>;
      },
      sortValue: (p) => statusOf(p),
    },
    {
      key: 'progress',
      header: 'Progress',
      width: '140px',
      render: (p) => (
        <span className="flex items-center gap-2">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
            <span className="block h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${p.progress}%` }} />
          </span>
          <span className="font-metric text-[11px] text-[var(--color-text-secondary)]">{p.progress}%</span>
        </span>
      ),
      sortValue: (p) => p.progress,
    },
    { key: 'sessions', header: 'Sessions', render: (p) => <span className="font-metric text-[12px]">{p.sessions}</span> },
    { key: 'target', header: 'Target date', render: (p) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{p.target}</span>, sortValue: (p) => p.target },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (p) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('training', { view: 'plan', horseId: p.horseId });
          }}
          className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] px-1.5 py-0.5 text-[12px] font-medium text-[var(--color-primary)] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
        >
          Open <Icon name="chevron-right" size={12} />
        </button>
      ),
    },
  ];

  return (
    <Screen
      title="All training plans"
      context={
        <button onClick={() => navigate('training')} className="inline-flex items-center gap-1 hover:underline">
          <Icon name="arrow-left" size={13} /> Back to training dashboard
        </button>
      }
      primary={
        can('training.manage') ? (
          <Button variant="primary" icon="plus" onClick={() => setCreateOpen(true)}>
            Create training plan
          </Button>
        ) : undefined
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <MetricCard label="Total plans" value={trainingPlanSummaries.length} unit="plans" icon="clipboard" />
        <MetricCard label="Active" value={activeCount} unit="in progress" icon="activity" tone="info" />
        <MetricCard label="Avg progress" value={avgProgress} unit="%" icon="gauge" tone={avgProgress >= 60 ? 'success' : 'warning'} />
      </div>

      <Panel padded className="mt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>Plans</SectionTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select label="Horse" placeholder="All horses" value={horseId} onChange={setHorseId} options={horseOptions} />
            <Select label="Trainer" placeholder="All trainers" value={trainer} onChange={setTrainer} options={trainerOptions} />
            <Select label="Phase" placeholder="All phases" value={phase} onChange={setPhase} options={phaseOptions} />
            <Select
              label="Status"
              placeholder="All statuses"
              value={status}
              onChange={setStatus}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Completed', label: 'Completed' },
              ]}
            />
            {hasFilters && (
              <Button variant="tertiary" size="sm" icon="x" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(p) => p.id}
          onRowClick={(p) => navigate('training', { view: 'plan', horseId: p.horseId })}
          empty={
            <EmptyState
              icon="search"
              title="No plans match these filters"
              description="Adjust or clear the filters to see training plans."
              action={
                hasFilters ? (
                  <Button variant="secondary" size="sm" icon="x" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          }
        />
      </Panel>
      <CreateTrainingPlanModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </Screen>
  );
}
