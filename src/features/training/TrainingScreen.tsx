import { useMemo, useState } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle } from '../../components/Panel';
import { ScheduleItem } from '../../components/ScheduleItem';
import { ProgressBar } from '../../components/ProgressBar';
import { DataTable, type Column } from '../../components/DataTable';
import { HorseAvatar } from '../horses/HorseAvatar';
import { Icon } from '../../components/Icon';
import { Pill, TrainingBadge } from '../../components/StatusBadge';
import { useRtms } from '../../app/RtmsContext';
import { TODAY_SESSIONS, type TrainingSession } from './trainingData';
import { TrainingPlanScreen } from './TrainingPlanScreen';
import { TrainingPlansList } from './TrainingPlansList';
import { TrainingSessionDetail } from './TrainingSessionDetail';
import { TrainingScheduleScreen } from './TrainingScheduleScreen';
import { CreateTrainingPlanModal } from './CreateTrainingPlanModal';
import { CourseCatalogDrawer } from './CourseCatalogDrawer';

const statusTone: Record<TrainingSession['status'], 'success' | 'warning' | 'primary' | 'neutral'> = {
  Completed: 'success',
  'In progress': 'primary',
  Scheduled: 'neutral',
  Cancelled: 'warning',
};

export function TrainingScreen() {
  const { route } = useRtms();
  if (route.view === 'plan') return <TrainingPlanScreen />;
  if (route.view === 'plans') return <TrainingPlansList />;
  if (route.view === 'session') return <TrainingSessionDetail />;
  if (route.view === 'schedule') return <TrainingScheduleScreen />;
  return <TrainingDashboard />;
}

function TrainingDashboard() {
  const { horses, navigate, isLocked, can, todaySessions, trainingPlanSummaries } = useRtms();
  const [selectedSession, setSelectedSession] = useState<string | undefined>('ts-3');
  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);


  const readiness = useMemo(
    () =>
      horses
        .filter((h) => h.training !== 'CANCELLED')
        .map((h) => ({
          h,
          score:
            h.readiness === 'Ready' ? 88 : h.readiness === 'Building' ? 64 : h.readiness === 'Restricted' ? 22 : 40,
        }))
        .sort((a, b) => a.score - b.score),
    [horses],
  );

  const activeTraining = horses.filter((h) => h.training === 'ACTIVE').length;
  const restricted = horses.filter((h) => isLocked(h.id)).length;
  const attention = horses.filter((h) => h.health === 'MONITOR' || h.health === 'INJURED' || isLocked(h.id)).length;
  const avgReadiness = Math.round(readiness.reduce((s, r) => s + r.score, 0) / (readiness.length || 1));

  const readinessColumns: Column<(typeof readiness)[number]>[] = [
    {
      key: 'horse',
      header: 'Horse',
      render: ({ h }) => (
        <button
          onClick={() => navigate('horses', { horseId: h.id })}
          className="flex items-center gap-2 text-left outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
        >
          <HorseAvatar name={h.name} image={h.image} size={28} />
          <span className="text-[13px] font-medium">{h.name}</span>
          {isLocked(h.id) && <Icon name="lock" size={12} className="text-[var(--color-danger)]" />}
        </button>
      ),
      sortValue: ({ h }) => h.name,
    },
    {
      key: 'readiness',
      header: 'Readiness',
      width: '180px',
      render: ({ score }) => (
        <ProgressBar value={score} showLabel tone={score >= 80 ? 'success' : score >= 50 ? 'primary' : 'danger'} size="sm" />
      ),
      sortValue: ({ score }) => score,
    },
    {
      key: 'state',
      header: 'State',
      render: ({ h }) => (
        <Pill tone={h.readiness === 'Ready' ? 'success' : h.readiness === 'Restricted' ? 'danger' : 'info'}>
          {h.readiness}
        </Pill>
      ),
    },
    { key: 'phase', header: 'Phase', render: ({ h }) => <span className="text-[13px]">{h.phase}</span> },
    {
      key: 'training',
      header: 'Training',
      align: 'right',
      render: ({ h }) => <TrainingBadge status={h.training} size="sm" />,
    },
  ];

  return (
    <Screen
      title="Training"
      secondary={
        <>
          <Button variant="secondary" icon="target" onClick={() => setCatalogOpen(true)}>
            Courses catalog
          </Button>
          <Button variant="secondary" icon="list" onClick={() => navigate('training', { view: 'plans' })}>
            All plans
          </Button>
          <Button variant="secondary" icon="calendar" onClick={() => navigate('training', { view: 'schedule' })}>
            Schedule
          </Button>
        </>
      }
      primary={
        can('training.manage') ? (
          <Button variant="primary" icon="plus" onClick={() => setCreatePlanOpen(true)}>
            Create training plan
          </Button>
        ) : undefined
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <MetricCard label="Active training" value={activeTraining} unit="horses" icon="activity" tone="info" />
        <MetricCard label="Workouts today" value={todaySessions.filter((s) => s.date === '20 Sep' || s.date === '22 Sep').length} unit="planned" icon="calendar" />
        <MetricCard label="Requires attention" value={attention} unit="horses" icon="alert-triangle" tone={attention ? 'warning' : 'default'} />
        <MetricCard label="Avg readiness" value={avgReadiness} unit="%" icon="gauge" tone={avgReadiness >= 70 ? 'success' : 'warning'} />
        <MetricCard label="Training-restricted" value={restricted} unit="horses" icon="lock" tone={restricted ? 'danger' : 'default'} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Panel padded>
          <div className="mb-3 flex items-center justify-between">
            <SectionTitle>Today's training schedule</SectionTitle>
            <span className="font-metric text-[11px] text-[var(--color-text-muted)]">20 Sep 2026</span>
          </div>
          <div className="space-y-1.5">
            {todaySessions.filter((s) => s.date === '20 Sep' || s.date === '22 Sep').map((s) => {
              const locked = isLocked(s.horseId);
              return (
                <ScheduleItem
                  key={s.id}
                  time={s.time}
                  tone="training"
                  title={
                    <span className="flex items-center gap-1.5">
                      {s.horseName}
                      {locked && <Icon name="lock" size={11} className="text-[var(--color-danger)]" />}
                    </span>
                  }
                  meta={`${s.session} · ${s.distance} · ${s.surface} · ${s.trainer}`}
                  selected={selectedSession === s.id}
                  onClick={() => setSelectedSession(s.id)}
                  right={<Pill tone={statusTone[s.status]} size="sm">{s.status}</Pill>}
                />
              );
            })}
          </div>
        </Panel>

        <Panel padded>
          <div className="mb-3 flex items-center justify-between">
            <SectionTitle>Horse readiness</SectionTitle>
            <span className="text-[11px] text-[var(--color-text-muted)]">Lowest first</span>
          </div>
          <DataTable columns={readinessColumns} rows={readiness} rowKey={(r) => r.h.id} />
        </Panel>
      </div>

      <Panel padded className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Active training plans</SectionTitle>
          <span className="text-[11px] text-[var(--color-text-muted)]">{trainingPlanSummaries.length} plans</span>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {trainingPlanSummaries.map((p) => {
            const horse = horses.find((h) => h.id === p.horseId);
            const locked = horse ? isLocked(horse.id) : false;
            return (
              <button
                key={p.id}
                onClick={() => navigate('training', { view: 'plan', horseId: p.horseId })}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left outline-none transition-colors hover:border-[var(--color-border-strong)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <div className="flex items-center gap-2">
                  {horse && <HorseAvatar name={horse.name} image={horse.image} size={28} />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 truncate text-[13px] font-medium text-[var(--color-text-primary)]">
                      {horse?.name}
                      {locked && <Icon name="lock" size={11} className="text-[var(--color-danger)]" />}
                    </div>
                    <div className="truncate text-[11px] text-[var(--color-text-muted)]">{p.title}</div>
                  </div>
                  <Icon name="chevron-right" size={14} className="text-[var(--color-text-muted)]" />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
                  <span>{p.phase}</span>
                  <span className="font-metric">{p.sessions}</span>
                </div>
                <div className="mt-1.5">
                  <ProgressBar value={p.progress} tone={locked ? 'danger' : 'primary'} size="sm" showLabel />
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      <CreateTrainingPlanModal open={createPlanOpen} onClose={() => setCreatePlanOpen(false)} />
      <CourseCatalogDrawer open={catalogOpen} onClose={() => setCatalogOpen(false)} onSelectCourse={() => setCreatePlanOpen(true)} />
    </Screen>
  );
}
