import { useMemo, useState } from 'react';
import { useRtms } from '../../app/RtmsContext';
import { Screen } from '../../components/Screen';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle } from '../../components/Panel';
import { Select } from '../../components/Select';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { HorseAvatar } from '../horses/HorseAvatar';
import { EmptyState } from '../../components/states';
import { type TreatmentTask } from './medicalData';

type ExtendedTask = TreatmentTask & {
  horseId: string;
  horseName: string;
};

export function TreatmentScheduleScreen() {
  const { navigate, horses, toast, getMedicalRecord, can } = useRtms();
  
  const [doneTasks, setDoneTasks] = useState<Record<string, boolean>>({});
  const [horseFilter, setHorseFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const canViewPrivate = can('medical.private.view');
  const canManageTreatment = can('medical.treatment.manage');

  // Collect all tasks and treatment info
  const allTasks = useMemo(() => {
    const tasks: ExtendedTask[] = [];
    horses.forEach((h) => {
      const record = getMedicalRecord(h.id);
      if (record.treatment && record.treatment.status === 'Active') {
        record.treatment.schedule.forEach((task) => {
          tasks.push({
            ...task,
            horseId: h.id,
            horseName: h.name,
          });
        });
      }
    });
    return tasks;
  }, [getMedicalRecord, horses]);

  // Compute actual done status considering local overrides
  const getIsDone = (task: ExtendedTask) => {
    return doneTasks[task.id] !== undefined ? doneTasks[task.id] : task.done;
  };

  const toggleDone = (taskId: string, currentDone: boolean) => {
    if (!canManageTreatment) {
      toast('Only veterinary staff or club management can update treatment task completion.', 'danger');
      return;
    }
    const next = !currentDone;
    setDoneTasks((prev) => ({ ...prev, [taskId]: next }));
    toast(`Task marked ${next ? 'complete' : 'pending'}`);
  };

  if (!canViewPrivate) {
    return (
      <Screen
        title="Treatment schedule"
        secondary={<Button variant="tertiary" icon="arrow-left" onClick={() => navigate('veterinary')}>Back</Button>}
      >
        <Panel padded>
          <EmptyState
            icon="lock"
            title="Clinical Treatment Schedule Restricted"
            description="Prescription schedules, clinical dosages and veterinary treatment administration are restricted to authorized veterinary staff and club management."
          />
        </Panel>
      </Screen>
    );
  }

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      const isDone = getIsDone(task);
      if (horseFilter && task.horseId !== horseFilter) return false;
      if (statusFilter === 'Pending' && isDone) return false;
      if (statusFilter === 'Completed' && !isDone) return false;
      return true;
    });
  }, [allTasks, horseFilter, statusFilter, doneTasks]);

  // Group tasks by date
  const groupedTasks = useMemo(() => {
    const map = new Map<string, ExtendedTask[]>();
    filteredTasks.forEach((task) => {
      const list = map.get(task.date) || [];
      list.push(task);
      map.set(task.date, list);
    });
    return map;
  }, [filteredTasks]);

  // Metrics
  const totalTasksCount = allTasks.length;
  const completedCount = allTasks.filter((t) => getIsDone(t)).length;
  const pendingCount = totalTasksCount - completedCount;
  const horsesUnderTreatment = useMemo(() => {
    const set = new Set<string>();
    allTasks.forEach((t) => set.add(t.horseId));
    return set.size;
  }, [allTasks]);

  const horseOptions = useMemo(() => {
    const set = new Set<string>();
    allTasks.forEach((t) => set.add(t.horseId));
    return Array.from(set).map((id) => {
      const h = horses.find((x) => x.id === id);
      return { value: id, label: h ? h.name : id };
    });
  }, [allTasks, horses]);

  const hasActiveFilters = horseFilter !== '' || statusFilter !== '';

  const clearFilters = () => {
    setHorseFilter('');
    setStatusFilter('');
  };

  return (
    <Screen
      title="Treatment schedule"
      context={
        <button onClick={() => navigate('veterinary')} className="inline-flex items-center gap-1 hover:underline text-[13px] text-[var(--color-text-secondary)]">
          <Icon name="arrow-left" size={13} /> Back to stable health
        </button>
      }
      secondary={
        <Button variant="secondary" icon="pill" onClick={() => navigate('veterinary', { view: 'treatment' })}>
          Treatment plans
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pb-12">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard 
            label="Total tasks" 
            value={totalTasksCount} 
            unit="items" 
            icon="clipboard" 
          />
          <MetricCard 
            label="Completed" 
            value={completedCount} 
            unit="done" 
            icon="check" 
            tone="success" 
          />
          <MetricCard 
            label="Pending" 
            value={pendingCount} 
            unit="remaining" 
            icon="clock" 
            tone={pendingCount > 0 ? 'warning' : 'default'} 
          />
          <MetricCard 
            label="Under treatment" 
            value={horsesUnderTreatment} 
            unit="horses" 
            icon="pill" 
            tone="info" 
          />
        </div>

        {/* Filter Bar */}
        <Panel padded>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Select
                label="Filter by Horse"
                placeholder="All horses"
                value={horseFilter}
                onChange={setHorseFilter}
                options={horseOptions}
              />
              <Select
                label="Filter by Status"
                placeholder="All statuses"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Completed', label: 'Completed' },
                ]}
              />
              {hasActiveFilters && (
                <Button variant="tertiary" icon="x" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
            <span className="text-[12px] text-[var(--color-text-muted)]">
              {filteredTasks.length} of {totalTasksCount} tasks
            </span>
          </div>
        </Panel>

        {/* Task List */}
        {allTasks.length === 0 ? (
          <Panel padded>
            <EmptyState 
              icon="check" 
              title="No active treatments" 
              description="Medication tasks appear here when an active treatment plan is recorded."
            />
          </Panel>
        ) : groupedTasks.size === 0 ? (
          <Panel padded>
            <EmptyState 
              icon="search" 
              title="No tasks found" 
              description="No tasks match the current filters." 
              action={
                <Button variant="secondary" size="sm" icon="x" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          </Panel>
        ) : (
          <div className="flex flex-col gap-4">
            {Array.from(groupedTasks.entries()).map(([date, tasks]) => (
              <Panel key={date}>
                <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3 bg-[var(--color-surface-subtle)]">
                  <SectionTitle>{date}</SectionTitle>
                  <span className="text-[12px] text-[var(--color-text-secondary)] font-metric">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                  {tasks.map((task) => {
                    const isDone = getIsDone(task);
                    const horse = horses.find((h) => h.id === task.horseId);
                    return (
                      <div 
                        key={task.id} 
                        className={`flex flex-wrap items-center gap-4 px-4 py-3 transition-colors ${
                          isDone ? 'bg-[var(--color-success)]/5' : 'hover:bg-[var(--color-surface-subtle)]'
                        }`}
                      >
                        <button
                          onClick={() => toggleDone(task.id, isDone)}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border transition-colors ${
                            isDone 
                              ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white' 
                              : 'border-[var(--color-border-strong)] bg-white text-transparent hover:border-[var(--color-primary)]'
                          }`}
                        >
                          <Icon name="check" size={12} className={isDone ? 'opacity-100' : 'opacity-0'} />
                        </button>

                        <div className="w-14 shrink-0 font-metric text-[12px] text-[var(--color-text-secondary)]">
                          {task.time}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`text-[13px] font-medium text-[var(--color-text-primary)] ${isDone ? 'line-through opacity-60' : ''}`}>
                            {task.task}
                          </p>
                          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                            Supervised by <span className="text-[var(--color-text-secondary)]">{task.by}</span>
                          </p>
                        </div>

                        {horse && (
                          <button 
                            onClick={() => navigate('veterinary', { view: 'record', horseId: task.horseId })}
                            className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2.5 py-1 hover:bg-[var(--color-surface-muted)] outline-none"
                          >
                            <HorseAvatar name={horse.name} image={horse.image} size={22} rounded="sm" />
                            <span className="text-[12px] font-medium text-[var(--color-text-primary)]">{task.horseName}</span>
                          </button>
                        )}

                        <div className="w-32 text-right">
                          {!isDone ? (
                            <Button variant="secondary" size="sm" onClick={() => toggleDone(task.id, isDone)}>
                              Complete
                            </Button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-success)]">
                              <Icon name="check" size={12} /> Done
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}
