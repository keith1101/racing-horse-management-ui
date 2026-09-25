import { useMemo, useState } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Select } from '../../components/Select';
import { Pill } from '../../components/StatusBadge';
import { Drawer } from '../../components/Drawer';
import { Icon } from '../../components/Icon';
import { HorseAvatar } from '../horses/HorseAvatar';
import { useRtms } from '../../app/RtmsContext';
import { STABLES } from '../horses/horseData';
import {
  CARE_TASK_TYPES,
  CARE_STAFF,
  CARE_CHECKLIST,
  ISSUE_CATEGORIES,
  INCIDENT_SEVERITY_LEVELS,
  GROOM_TASK_LABELS,
  GROOM_TASK_ICONS,
  type CareTask,
  type GroomTaskType,
} from './careData';
import { CareChecklistScreen } from './CareChecklistScreen';
import { IssueReportScreen } from './IssueReportScreen';

const taskTypeTones: Record<GroomTaskType, 'primary' | 'neutral' | 'info' | 'warning' | 'success' | 'danger'> = {
  FEEDING: 'warning',
  MUCKING_OUT: 'neutral',
  GROOMING: 'info',
  HOOF_CARE: 'primary',
  WORKOUT_ASSIST: 'success',
  VET_ASSIST: 'danger',
  SPECIAL_CARE: 'danger',
};

export function StableCareScreen() {
  const { route, navigate, reportIssue, toast, can, currentUser, careTasks, completeCareTask, horses } = useRtms();

  if (route.view === 'checklist') return <CareChecklistScreen />;
  if (route.view === 'report') return <IssueReportScreen />;

  return (
    <StableCareDashboard
      navigate={navigate}
      reportIssue={reportIssue}
      toast={toast}
      can={can}
      currentUser={currentUser}
      careTasks={careTasks}
      completeCareTask={completeCareTask}
      horses={horses}
    />
  );
}

function StableCareDashboard({
  navigate,
  reportIssue,
  toast,
  can,
  currentUser,
  careTasks,
  completeCareTask,
  horses,
}: {
  navigate: ReturnType<typeof useRtms>['navigate'];
  reportIssue: ReturnType<typeof useRtms>['reportIssue'];
  toast: ReturnType<typeof useRtms>['toast'];
  can: ReturnType<typeof useRtms>['can'];
  currentUser: ReturnType<typeof useRtms>['currentUser'];
  careTasks: ReturnType<typeof useRtms>['careTasks'];
  completeCareTask: ReturnType<typeof useRtms>['completeCareTask'];
  horses: ReturnType<typeof useRtms>['horses'];
}) {
  const isGroom = currentUser.role === 'GROOM';
  const canExecute = can('stable-care.execute') || can('stable-care.manage');
  const canReport = can('stable-care.report_incident');

  // Filters
  const [scope, setScope] = useState<'my' | 'all'>(isGroom ? 'my' : 'all');
  const [stable, setStable] = useState('');
  const [staff, setStaff] = useState(isGroom ? currentUser.name : '');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [checklist, setChecklist] = useState(CARE_CHECKLIST);

  // Modal states
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [preselectedHorseId, setPreselectedHorseId] = useState<string | undefined>();

  // Filter tasks: default to logged-in groom if Groom role
  const filtered = useMemo(() => {
    return careTasks.filter((t) => {
      if (scope === 'my' && isGroom && t.assignedTo !== currentUser.name) return false;
      if (scope === 'all' && staff && t.assignedTo !== staff) return false;
      if (stable && t.stable !== stable) return false;
      if (type && t.type !== type) return false;
      if (status && t.status !== status) return false;
      return true;
    });
  }, [careTasks, scope, isGroom, currentUser.name, staff, stable, type, status]);

  const groomTasks = useMemo(() => {
    return isGroom ? careTasks.filter((t) => t.assignedTo === currentUser.name) : careTasks;
  }, [careTasks, isGroom, currentUser.name]);

  const counts = {
    pending: groomTasks.filter((t) => t.status === 'Pending').length,
    progress: groomTasks.filter((t) => t.status === 'In progress').length,
    completed: groomTasks.filter((t) => t.status === 'Completed').length,
    issues: groomTasks.filter((t) => t.status === 'Issue reported').length,
  };

  function openReportModal(horseId?: string) {
    setPreselectedHorseId(horseId);
    setReportModalOpen(true);
  }

  return (
    <Screen
      title={isGroom ? "Today's Groom Care & Tasks" : 'Stable Care'}
      context={
        isGroom ? (
          <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-secondary)]">
            <Icon name="user" size={13} className="text-[var(--color-primary)]" />
            Personal daily checklist for <strong className="text-[var(--color-text-primary)]">{currentUser.name}</strong> (Assigned: Barn A Stalls A01, A03, A11)
          </span>
        ) : (
          'Stable daily care tasks and operations'
        )
      }
      secondary={
        <>
          <Button variant="secondary" icon="clipboard" onClick={() => navigate('stable-care', { view: 'checklist' })}>
            Daily checklist
          </Button>
          {canReport && (
            <Button
              variant="primary"
              icon="alert-triangle"
              onClick={() => openReportModal()}
              className="bg-[var(--color-danger)] hover:bg-[var(--color-danger)]/90 text-white"
            >
              Report issue
            </Button>
          )}
        </>
      }
    >
      {/* Metric summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Pending" value={counts.pending} unit="tasks" icon="clock" />
        <MetricCard label="In progress" value={counts.progress} unit="tasks" icon="activity" tone="info" />
        <MetricCard label="Completed" value={counts.completed} unit="tasks" icon="check" tone="success" />
        <MetricCard
          label="Issues reported"
          value={counts.issues}
          unit="tasks"
          icon="alert-triangle"
          tone={counts.issues ? 'danger' : 'default'}
        />
      </div>

      {/* Filter and view toggles */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {isGroom && (
          <div className="inline-flex rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] p-0.5">
            <button
              onClick={() => {
                setScope('my');
                setStaff(currentUser.name);
              }}
              className={
                'rounded-[var(--radius-xs)] px-3 py-1 text-[12px] font-medium outline-none transition-colors ' +
                (scope === 'my'
                  ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]')
              }
            >
              My Checklist ({careTasks.filter((t) => t.assignedTo === currentUser.name).length})
            </button>
            <button
              onClick={() => {
                setScope('all');
                setStaff('');
              }}
              className={
                'rounded-[var(--radius-xs)] px-3 py-1 text-[12px] font-medium outline-none transition-colors ' +
                (scope === 'all'
                  ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]')
              }
            >
              All Stable Tasks ({careTasks.length})
            </button>
          </div>
        )}

        <Pill tone="neutral" size="sm">
          Date · 20 Sep 2026
        </Pill>
        <Select
          label="Stable"
          placeholder="All stables"
          value={stable}
          onChange={setStable}
          options={STABLES.map((s) => ({ value: s, label: s }))}
        />
        {(!isGroom || scope === 'all') && (
          <Select
            label="Assigned staff"
            placeholder="All staff"
            value={staff}
            onChange={setStaff}
            options={CARE_STAFF.map((s) => ({ value: s, label: s }))}
          />
        )}
        <Select
          label="Task type"
          placeholder="All types"
          value={type}
          onChange={setType}
          options={CARE_TASK_TYPES.map((s) => ({ value: s, label: GROOM_TASK_LABELS[s] || s }))}
        />
        <Select
          label="Status"
          placeholder="All statuses"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'Pending', label: 'Pending' },
            { value: 'In progress', label: 'In progress' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Issue reported', label: 'Issue reported' },
          ]}
        />
        {(stable || (staff && staff !== currentUser.name) || type || status) && (
          <Button
            variant="tertiary"
            icon="x"
            onClick={() => {
              setStable('');
              setStaff(isGroom && scope === 'my' ? currentUser.name : '');
              setType('');
              setStatus('');
            }}
          >
            Clear
          </Button>
        )}
        <span className="ml-auto text-[12px] text-[var(--color-text-muted)]">
          {filtered.length} tasks
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Task to-do list */}
        <Panel padded>
          <div className="mb-3 flex items-center justify-between">
            <SectionTitle>
              {isGroom && scope === 'my' ? "My Daily Checklist (Today's Care Tasks)" : "Today's care tasks"}
            </SectionTitle>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              Golden Routine · 05:30 to 16:30
            </span>
          </div>

          <div className="space-y-2">
            {filtered.map((t) => {
              const isDone = t.status === 'Completed';
              return (
                <div
                  key={t.id}
                  className={
                    'group flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border p-3 transition-all ' +
                    (isDone
                      ? 'border-[var(--color-success)]/30 bg-[var(--color-success-soft)]/20'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]')
                  }
                >
                  {/* Complete checkbox / single button */}
                  {canExecute ? (
                    <button
                      type="button"
                      aria-label={isDone ? `Task completed at ${t.completedAt}` : `Mark task complete`}
                      onClick={() => !isDone && completeCareTask(t.id)}
                      disabled={isDone}
                      className={
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' +
                        (isDone
                          ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white cursor-default'
                          : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-transparent hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]')
                      }
                      title={isDone ? `Completed at ${t.completedAt}` : 'Click to complete task'}
                    >
                      <Icon name="check" size={14} className={isDone ? 'text-white' : 'hover:text-[var(--color-primary)]'} />
                    </button>
                  ) : (
                    <span
                      className={
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border ' +
                        (isDone
                          ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white'
                          : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-transparent')
                      }
                    >
                      <Icon name="check" size={14} />
                    </span>
                  )}

                  {/* Time badge */}
                  <span className="font-metric w-12 shrink-0 text-[12px] font-semibold text-[var(--color-text-primary)]">
                    {t.time}
                  </span>

                  {/* Task type icon badge */}
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]"
                    title={GROOM_TASK_LABELS[t.type]}
                  >
                    <Icon name={GROOM_TASK_ICONS[t.type] || 'clipboard'} size={16} />
                  </span>

                  {/* Task details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                        {t.horseName}
                      </span>
                      <span className="rounded bg-[var(--color-surface-muted)] px-1.5 py-0.5 font-metric text-[11px] font-medium text-[var(--color-text-secondary)]">
                        Stall {t.stall} ({t.stable})
                      </span>
                      <Pill tone={taskTypeTones[t.type] || 'neutral'} size="sm">
                        {GROOM_TASK_LABELS[t.type] || t.type}
                      </Pill>
                    </div>
                    <p className={'mt-0.5 text-[12px] leading-relaxed ' + (isDone ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-secondary)]')}>
                      {t.detail}
                    </p>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <span className="flex items-center gap-1 rounded bg-[var(--color-success-soft)] px-2 py-1 text-[11px] font-medium text-[var(--color-success)]">
                        <Icon name="check" size={12} />
                        Completed {t.completedAt ? `· ${t.completedAt}` : ''}
                      </span>
                    ) : (
                      canExecute && (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon="check"
                          onClick={() => completeCareTask(t.id)}
                          className="hover:bg-[var(--color-success-soft)] hover:text-[var(--color-success)] hover:border-[var(--color-success)]"
                        >
                          Mark Complete
                        </Button>
                      )
                    )}

                    {canReport && (
                      <Button
                        variant="tertiary"
                        size="sm"
                        icon="alert-triangle"
                        onClick={() => openReportModal(t.horseId)}
                        title="Report incident observed during this task"
                      >
                        Report
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <p className="py-8 text-center text-[13px] text-[var(--color-text-muted)]">
                No care tasks found for the selected filters.
              </p>
            )}
          </div>
        </Panel>

        {/* Right side: Groom Daily Standard Checklist */}
        <div className="space-y-4">
          <Panel padded>
            <div className="flex items-center justify-between">
              <SectionTitle>Care Standard</SectionTitle>
              <button
                onClick={() => navigate('stable-care', { view: 'checklist' })}
                className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
              >
                Full view
              </button>
            </div>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              Daily welfare and hygiene standard
            </p>

            <ul className="mt-3 space-y-1">
              {checklist.map((c) => (
                <li key={c.id}>
                  {canExecute ? (
                    <button
                      type="button"
                      onClick={() =>
                        setChecklist((prev) =>
                          prev.map((x) => (x.id === c.id ? { ...x, done: !x.done } : x)),
                        )
                      }
                      className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-1.5 text-left outline-none hover:bg-[var(--color-surface-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                    >
                      <span
                        className={
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border ' +
                          (c.done
                            ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white'
                            : 'border-[var(--color-border-strong)] text-transparent')
                        }
                      >
                        <Icon name="check" size={12} />
                      </span>
                      <span
                        className={
                          'text-[12px] ' +
                          (c.done
                            ? 'text-[var(--color-text-muted)] line-through'
                            : 'text-[var(--color-text-primary)]')
                        }
                      >
                        {c.label}
                      </span>
                    </button>
                  ) : (
                    <div className="flex w-full items-center gap-2.5 px-2 py-1.5">
                      <span
                        className={
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border ' +
                          (c.done
                            ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white'
                            : 'border-[var(--color-border-strong)] text-transparent')
                        }
                      >
                        <Icon name="check" size={12} />
                      </span>
                      <span
                        className={
                          'text-[12px] ' +
                          (c.done
                            ? 'text-[var(--color-text-muted)] line-through'
                            : 'text-[var(--color-text-primary)]')
                        }
                      >
                        {c.label}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Panel>

          {/* Quick Info Box for Groom */}
          <Panel padded className="bg-[var(--color-surface-subtle)]">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--color-text-primary)]">
              <Icon name="shield" size={14} className="text-[var(--color-primary)]" />
              Groom Role Protocol
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
              Each Groom is assigned a maximum of 3 stalls/horses according to racetrack welfare standards. All high-speed training workouts take place during the Golden Hours (06:30 - 09:30 AM).
            </p>
          </Panel>
        </div>
      </div>

      {/* Comprehensive Report Incident Modal */}
      <ReportIncidentModal
        open={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setPreselectedHorseId(undefined);
        }}
        initialHorseId={preselectedHorseId}
        horses={horses}
        currentUser={currentUser}
        onSubmit={(data) => {
          reportIssue({
            horseId: data.horseId,
            horseName: data.horseName,
            title: data.title,
            category: data.category,
            observation: data.description,
            severity: data.severity as any,
            imageUrl: data.imageUrl,
            reportedBy: currentUser.name,
          });
          setReportModalOpen(false);
          setPreselectedHorseId(undefined);
          toast(`Incident reported for ${data.horseName} — submitted to Veterinary review`, 'success');
        }}
      />
    </Screen>
  );
}

interface IncidentFormData {
  horseId: string;
  horseName: string;
  title: string;
  category: string;
  severity: string;
  description: string;
  imageUrl?: string;
}

function ReportIncidentModal({
  open,
  onClose,
  initialHorseId,
  horses,
  currentUser,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  initialHorseId?: string;
  horses: ReturnType<typeof useRtms>['horses'];
  currentUser: ReturnType<typeof useRtms>['currentUser'];
  onSubmit: (data: IncidentFormData) => void;
}) {
  const isGroom = currentUser.role === 'GROOM';
  // If Groom, recommend selecting from assigned horses
  const relevantHorses = useMemo(() => {
    if (isGroom) {
      const assigned = horses.filter((h) => h.assignedGroom === currentUser.name);
      return assigned.length > 0 ? assigned : horses;
    }
    return horses;
  }, [horses, isGroom, currentUser.name]);

  const [selectedHorseId, setSelectedHorseId] = useState(initialHorseId || relevantHorses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('MEDIUM');
  const [category, setCategory] = useState(ISSUE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Sync if initialHorseId changes
  useMemo(() => {
    if (initialHorseId) setSelectedHorseId(initialHorseId);
    else if (!selectedHorseId && relevantHorses[0]) setSelectedHorseId(relevantHorses[0].id);
  }, [initialHorseId, relevantHorses, selectedHorseId]);

  const selectedHorse = horses.find((h) => h.id === selectedHorseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHorseId || !title.trim() || !description.trim()) return;

    onSubmit({
      horseId: selectedHorseId,
      horseName: selectedHorse?.name ?? 'Horse',
      title: title.trim(),
      category,
      severity,
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setImageUrl('');
    setSeverity('MEDIUM');
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Report Incident / Issue"
      subtitle="Record an urgent or routine health observation for veterinary review"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon="alert-triangle"
            disabled={!title.trim() || !description.trim() || !selectedHorseId}
            onClick={handleSubmit}
            className="bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90"
          >
            Submit Report
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Horse selection */}
        <div>
          <FieldLabel>Select Horse</FieldLabel>
          <div className="mt-1">
            <Select
              label="Select horse"
              value={selectedHorseId}
              onChange={setSelectedHorseId}
              options={relevantHorses.map((h) => ({
                value: h.id,
                label: `${h.name} (Stall ${h.stall} · ${h.stable})`,
              }))}
            />
          </div>
          {selectedHorse && (
            <div className="mt-2 flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-2">
              <HorseAvatar name={selectedHorse.name} image={selectedHorse.image} size={32} />
              <div className="text-[12px]">
                <span className="font-semibold text-[var(--color-text-primary)]">{selectedHorse.name}</span>
                <span className="ml-2 text-[var(--color-text-muted)]">
                  Stall {selectedHorse.stall} · {selectedHorse.stable} · Groom: {selectedHorse.assignedGroom ?? 'Unassigned'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <FieldLabel>Incident Title *</FieldLabel>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Swelling on the left front knee"
            className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          />
        </div>

        {/* Severity */}
        <div>
          <FieldLabel>Severity level *</FieldLabel>
          <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {INCIDENT_SEVERITY_LEVELS.map((lvl) => {
              const isSelected = severity === lvl.value;
              return (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => setSeverity(lvl.value)}
                  className={
                    'flex flex-col items-center justify-center rounded-[var(--radius-sm)] border p-2 text-center outline-none transition-all ' +
                    (isSelected
                      ? lvl.value === 'CRITICAL' || lvl.value === 'HIGH'
                        ? 'border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)] font-semibold'
                        : lvl.value === 'MEDIUM'
                          ? 'border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-warning)] font-semibold'
                          : 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]')
                  }
                >
                  <span className="text-[12px]">{lvl.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
            {INCIDENT_SEVERITY_LEVELS.find((l) => l.value === severity)?.description}
          </p>
        </div>

        {/* Category */}
        <div>
          <FieldLabel>Category</FieldLabel>
          <div className="mt-1">
            <Select
              label="Incident Category"
              value={category}
              onChange={setCategory}
              options={ISSUE_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>
        </div>

        {/* Detailed description */}
        <div>
          <FieldLabel>Detailed description *</FieldLabel>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe clinical symptoms, behavioral changes, physical observations, or feeding anomalies in detail…"
            className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 py-2 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] placeholder:text-[var(--color-text-muted)]"
          />
        </div>

        {/* Image URL */}
        <div>
          <FieldLabel>Photo URL</FieldLabel>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.example.com/injury-photo.jpg (optional)"
            className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] placeholder:text-[var(--color-text-muted)]"
          />
          {imageUrl && (
            <div className="mt-2 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]">
              <img src={imageUrl} alt="Incident preview" className="h-32 w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
        </div>

        {/* Reporter info badge */}
        <div className="rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] p-2.5 text-[11px] text-[var(--color-text-muted)]">
          Reported by: <strong className="text-[var(--color-text-primary)]">{currentUser.name}</strong> ({currentUser.roleLabel}) · Submitted to veterinary review.
        </div>
      </form>
    </Drawer>
  );
}
