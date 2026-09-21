import { useMemo, useState } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Select } from '../../components/Select';
import { Pill } from '../../components/StatusBadge';
import { Drawer } from '../../components/Drawer';
import { Icon } from '../../components/Icon';
import { useRtms } from '../../app/RtmsContext';
import { STABLES } from '../horses/horseData';
import {
  CARE_TASKS,
  CARE_TASK_ICON,
  CARE_TASK_TYPES,
  CARE_STAFF,
  CARE_CHECKLIST,
  ISSUE_CATEGORIES,
  type CareTask,
  type CareTaskStatus,
} from './careData';
import { CareChecklistScreen } from './CareChecklistScreen';
import { IssueReportScreen } from './IssueReportScreen';

const statusTone: Record<CareTaskStatus, 'success' | 'primary' | 'neutral' | 'danger'> = {
  Completed: 'success',
  'In progress': 'primary',
  Pending: 'neutral',
  'Issue reported': 'danger',
};

export function StableCareScreen() {
  const { route, navigate, reportIssue, toast, can } = useRtms();

  if (route.view === 'checklist') return <CareChecklistScreen />;
  if (route.view === 'report') return <IssueReportScreen />;

  return <StableCareDashboard navigate={navigate} reportIssue={reportIssue} toast={toast} can={can} />;
}

function StableCareDashboard({
  navigate,
  reportIssue,
  toast,
  can,
}: {
  navigate: ReturnType<typeof useRtms>['navigate'];
  reportIssue: ReturnType<typeof useRtms>['reportIssue'];
  toast: ReturnType<typeof useRtms>['toast'];
  can: ReturnType<typeof useRtms>['can'];
}) {
  const canExecute = can('stable-care.execute') || can('stable-care.manage');
  const canReport = can('stable-care.report_incident');
  const [stable, setStable] = useState('');
  const [staff, setStaff] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [localStatus, setLocalStatus] = useState<Record<string, CareTaskStatus>>({});
  const [checklist, setChecklist] = useState(CARE_CHECKLIST);
  const [issueTask, setIssueTask] = useState<CareTask | undefined>();

  const taskStatus = (t: CareTask) => localStatus[t.id] ?? t.status;

  const filtered = useMemo(
    () =>
      CARE_TASKS.filter((t) => {
        if (stable && t.stable !== stable) return false;
        if (staff && t.assignedTo !== staff) return false;
        if (type && t.type !== type) return false;
        if (status && taskStatus(t) !== status) return false;
        return true;
      }),
    [stable, staff, type, status, localStatus],
  );

  const counts = {
    pending: CARE_TASKS.filter((t) => taskStatus(t) === 'Pending').length,
    progress: CARE_TASKS.filter((t) => taskStatus(t) === 'In progress').length,
    completed: CARE_TASKS.filter((t) => taskStatus(t) === 'Completed').length,
    issues: CARE_TASKS.filter((t) => taskStatus(t) === 'Issue reported').length,
  };

  function advance(t: CareTask) {
    const next: CareTaskStatus =
      taskStatus(t) === 'Pending' ? 'In progress' : taskStatus(t) === 'In progress' ? 'Completed' : 'Completed';
    setLocalStatus((p) => ({ ...p, [t.id]: next }));
    toast(`${t.horseName} · ${t.type} → ${next}`);
  }

  return (
    <Screen
      title="Stable Care"
      secondary={
        <>
          <Button variant="secondary" icon="clipboard" onClick={() => navigate('stable-care', { view: 'checklist' })}>
            Daily checklist
          </Button>
          {canReport && (
            <Button variant="secondary" icon="alert-triangle" onClick={() => navigate('stable-care', { view: 'report' })}>
              Report issue
            </Button>
          )}
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Pending" value={counts.pending} unit="tasks" icon="clock" />
        <MetricCard label="In progress" value={counts.progress} unit="tasks" icon="activity" tone="info" />
        <MetricCard label="Completed" value={counts.completed} unit="tasks" icon="check" tone="success" />
        <MetricCard label="Issues reported" value={counts.issues} unit="tasks" icon="alert-triangle" tone={counts.issues ? 'danger' : 'default'} />
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Pill tone="neutral" size="sm">Date · 20 Sep 2026</Pill>
        <Select label="Stable" placeholder="All stables" value={stable} onChange={setStable} options={STABLES.map((s) => ({ value: s, label: s }))} />
        <Select label="Assigned staff" placeholder="All staff" value={staff} onChange={setStaff} options={CARE_STAFF.map((s) => ({ value: s, label: s }))} />
        <Select label="Task type" placeholder="All types" value={type} onChange={setType} options={CARE_TASK_TYPES.map((s) => ({ value: s, label: s }))} />
        <Select label="Status" placeholder="All statuses" value={status} onChange={setStatus} options={(['Pending', 'In progress', 'Completed', 'Issue reported'] as const).map((s) => ({ value: s, label: s }))} />
        {(stable || staff || type || status) && (
          <Button variant="tertiary" icon="x" onClick={() => { setStable(''); setStaff(''); setType(''); setStatus(''); }}>Clear</Button>
        )}
        <span className="ml-auto text-[12px] text-[var(--color-text-muted)]">{filtered.length} of {CARE_TASKS.length} tasks</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Task board */}
        <Panel padded>
          <SectionTitle>Today's care tasks</SectionTitle>
          <div className="mt-3 space-y-1.5">
            {filtered.map((t) => {
              const st = taskStatus(t);
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2"
                >
                  <span className="font-metric w-11 shrink-0 text-[12px] text-[var(--color-text-secondary)]">{t.time}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]">
                    <Icon name={CARE_TASK_ICON[t.type]} size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-[var(--color-text-primary)]">
                      {t.type} · {t.horseName}
                    </div>
                    <div className="truncate text-[11px] text-[var(--color-text-muted)]">{t.detail} · {t.stable} · {t.assignedTo}</div>
                  </div>
                  <Pill tone={statusTone[st]} size="sm">{st}</Pill>
                  {canExecute && st !== 'Completed' && st !== 'Issue reported' && (
                    <Button variant="tertiary" size="sm" icon="check" onClick={() => advance(t)}>
                      {st === 'Pending' ? 'Start' : 'Done'}
                    </Button>
                  )}
                  {canReport && (
                    <Button variant="tertiary" size="sm" icon="alert-triangle" onClick={() => setIssueTask(t)}>
                      Report
                    </Button>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-6 text-center text-[13px] text-[var(--color-text-muted)]">No tasks match the current filters.</p>
            )}
          </div>
        </Panel>

        {/* Care checklist */}
        <Panel padded className="self-start">
          <div className="flex items-center justify-between">
            <SectionTitle>Horse care checklist</SectionTitle>
            <button
              onClick={() => navigate('stable-care', { view: 'checklist' })}
              className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
            >
              Full checklist
            </button>
          </div>
          <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">Per-horse daily standard</p>
          <ul className="mt-3 space-y-1">
            {checklist.map((c) => (
              <li key={c.id}>
                {canExecute ? (
                  <button
                    type="button"
                    aria-label={c.done ? `Mark ${c.label} incomplete` : `Complete ${c.label}`}
                    onClick={() => setChecklist((prev) => prev.map((x) => (x.id === c.id ? { ...x, done: !x.done } : x)))}
                    className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-1.5 py-1.5 text-left outline-none hover:bg-[var(--color-surface-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <span
                      className={
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border ' +
                        (c.done
                          ? 'border-[var(--color-success)] bg-[var(--color-success)] text-[var(--color-text-inverse)]'
                          : 'border-[var(--color-border-strong)] text-transparent')
                      }
                    >
                      <Icon name="check" size={12} />
                    </span>
                    <span className={'text-[13px] ' + (c.done ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]')}>
                      {c.label}
                    </span>
                  </button>
                ) : (
                  <div className="flex w-full items-center gap-2.5 px-1.5 py-1.5">
                    <span
                      aria-hidden="true"
                      className={
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border ' +
                        (c.done
                          ? 'border-[var(--color-success)] bg-[var(--color-success)] text-[var(--color-text-inverse)]'
                          : 'border-[var(--color-border-strong)] text-transparent')
                      }
                    >
                      <Icon name="check" size={12} />
                    </span>
                    <span className={'text-[13px] ' + (c.done ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]')}>
                      {c.label}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <ReportIssueDrawer
        task={issueTask}
        onClose={() => setIssueTask(undefined)}
        onSubmit={(category, observation, severity) => {
          if (!issueTask) return;
          reportIssue({
            horseId: issueTask.horseId,
            horseName: issueTask.horseName,
            category,
            observation,
            severity,
            reportedBy: issueTask.assignedTo,
          });
          setLocalStatus((p) => ({ ...p, [issueTask.id]: 'Issue reported' }));
          setIssueTask(undefined);
          toast(`Issue reported for ${issueTask.horseName} — sent to veterinary review`, 'warning');
        }}
      />
    </Screen>
  );
}

function ReportIssueDrawer({
  task,
  onClose,
  onSubmit,
}: {
  task?: CareTask;
  onClose: () => void;
  onSubmit: (category: string, observation: string, severity: 'Low' | 'Moderate' | 'High') => void;
}) {
  const [category, setCategory] = useState(ISSUE_CATEGORIES[0]);
  const [observation, setObservation] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Moderate' | 'High'>('Moderate');

  return (
    <Drawer
      open={!!task}
      onClose={onClose}
      title="Report issue"
      subtitle={task ? `${task.horseName} · ${task.stable}` : undefined}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            icon="alert-triangle"
            disabled={!observation.trim()}
            onClick={() => onSubmit(category, observation.trim(), severity)}
          >
            Submit to vet
          </Button>
        </>
      }
    >
      {task && (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]">
              <Icon name="heart-pulse" size={18} />
            </span>
            <div>
              <div className="text-[13px] font-medium text-[var(--color-text-primary)]">{task.horseName}</div>
              <div className="text-[11px] text-[var(--color-text-muted)]">Observed during: {task.type}</div>
            </div>
          </div>
          <div>
            <FieldLabel>Category</FieldLabel>
            <div className="mt-1">
              <Select label="Category" value={category} onChange={setCategory} options={ISSUE_CATEGORIES.map((c) => ({ value: c, label: c }))} />
            </div>
          </div>
          <div>
            <FieldLabel>Severity</FieldLabel>
            <div className="mt-1 flex gap-1.5">
              {(['Low', 'Moderate', 'High'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={
                    'flex-1 rounded-[var(--radius-sm)] border px-2 py-1.5 text-[12px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' +
                    (severity === s
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]')
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel>Observation</FieldLabel>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={4}
              placeholder="Describe what you observed…"
              className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 py-2 text-[13px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            />
          </div>
          <p className="flex items-start gap-1.5 text-[11px] text-[var(--color-text-muted)]">
            <Icon name="stethoscope" size={12} className="mt-0.5 shrink-0" />
            Reported issues appear in the veterinary review queue and the horse's activity log.
          </p>
        </div>
      )}
    </Drawer>
  );
}
