import { useMemo, useState } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Panel, SectionTitle } from '../../components/Panel';
import { Select } from '../../components/Select';
import { Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/states';
import { HorseAvatar } from '../horses/HorseAvatar';
import { useRtms } from '../../app/RtmsContext';
import { TODAY_SESSIONS, type TrainingSession } from './trainingData';
import { LogWorkoutModal } from './LogWorkoutModal';

const statusTone: Record<TrainingSession['status'], 'success' | 'warning' | 'primary' | 'neutral'> = {
  Completed: 'success',
  'In progress': 'primary',
  Scheduled: 'neutral',
  Cancelled: 'warning',
};

const WEEK_DAYS = [
  { key: '20 Sep', label: 'Sun', day: '20' },
  { key: '21 Sep', label: 'Mon', day: '21' },
  { key: '22 Sep', label: 'Tue', day: '22' },
  { key: '23 Sep', label: 'Wed', day: '23' },
  { key: '24 Sep', label: 'Thu', day: '24' },
  { key: '25 Sep', label: 'Fri', day: '25' },
  { key: '26 Sep', label: 'Sat', day: '26' },
] as const;

function uniq(values: string[]): { value: string; label: string }[] {
  return Array.from(new Set(values)).map((v) => ({ value: v, label: v }));
}

export function TrainingScheduleScreen() {
  const { horses, navigate, toast, isLocked, can } = useRtms();
  const canLog = can('training.log') || can('training.manage');
  const [trainer, setTrainer] = useState('');
  const [status, setStatus] = useState('');
  const [span, setSpan] = useState<'Day' | 'Week'>('Week');
  const [overrides, setOverrides] = useState<Record<string, TrainingSession['status']>>({});
  const [loggingSession, setLoggingSession] = useState<TrainingSession | undefined>();

  const trainerOptions = useMemo(() => uniq(TODAY_SESSIONS.map((s) => s.trainer)), []);

  function effectiveStatus(s: TrainingSession) {
    return overrides[s.id] ?? s.status;
  }

  const filtered = useMemo(
    () =>
      TODAY_SESSIONS.filter((s) => {
        if (trainer && s.trainer !== trainer) return false;
        if (status && effectiveStatus(s) !== status) return false;
        return true;
      }),
    [trainer, status, overrides],
  );

  const groups = useMemo(() => {
    const byDate = new Map<string, TrainingSession[]>();
    for (const s of filtered) {
      const list = byDate.get(s.date) ?? [];
      list.push(s);
      byDate.set(s.date, list);
    }
    return Array.from(byDate.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, sessions]) => ({
        date,
        sessions: [...sessions].sort((a, b) => a.time.localeCompare(b.time)),
      }));
  }, [filtered]);

  function updateStatus(s: TrainingSession, next: TrainingSession['status'], message: string) {
    setOverrides((o) => ({ ...o, [s.id]: next }));
    toast(message, next === 'Cancelled' ? 'warning' : 'success');
  }

  const hasFilters = !!(trainer || status);

  return (
    <Screen
      title="Training schedule"
      context={
        <button onClick={() => navigate('training')} className="inline-flex items-center gap-1 hover:underline">
          <Icon name="arrow-left" size={13} /> Back to training dashboard
        </button>
      }
    >
      <Panel padded>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] p-0.5">
            {(['Day', 'Week'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setSpan(opt)}
                className={
                  'rounded-[var(--radius-xs)] px-3 py-1 text-[12px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' +
                  (span === opt
                    ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]')
                }
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select label="Trainer" placeholder="All trainers" value={trainer} onChange={setTrainer} options={trainerOptions} />
            <Select
              label="Status"
              placeholder="All statuses"
              value={status}
              onChange={setStatus}
              options={[
                { value: 'Scheduled', label: 'Scheduled' },
                { value: 'In progress', label: 'In progress' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]}
            />
            {hasFilters && (
              <Button
                variant="tertiary"
                size="sm"
                icon="x"
                onClick={() => {
                  setTrainer('');
                  setStatus('');
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </Panel>

      {groups.length === 0 ? (
        <Panel className="mt-4 p-0">
          <EmptyState icon="calendar" title="No workouts scheduled" description="No workouts match the current filters." />
        </Panel>
      ) : span === 'Week' ? (
        <Panel padded className="mt-4 overflow-x-auto">
          <div className="mb-4 flex items-center justify-between">
            <SectionTitle>Week of 20–26 Sep 2026</SectionTitle>
            <span className="text-[11px] text-[var(--color-text-muted)]">{filtered.length} scheduled workouts</span>
          </div>
          <div className="grid min-w-[980px] grid-cols-7 border-l border-t border-[var(--color-border)]">
            {WEEK_DAYS.map((day) => {
              const sessions = filtered
                .filter((session) => session.date === day.key)
                .sort((a, b) => a.time.localeCompare(b.time));
              return (
                <div key={day.key} className="min-h-[340px] border-b border-r border-[var(--color-border)] bg-[var(--color-surface)]">
                  <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-3 py-2">
                    <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">{day.label}</span>
                    <span className="font-metric text-[13px] font-semibold text-[var(--color-text-primary)]">{day.day}</span>
                  </div>
                  <div className="space-y-2 p-2">
                    {sessions.map((session) => {
                      const locked = isLocked(session.horseId);
                      const sessionStatus = effectiveStatus(session);
                      return (
                        <button
                          key={session.id}
                          onClick={() => navigate('training', { view: 'session', refId: session.id })}
                          className="block w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-left outline-none transition-colors hover:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-metric text-[10px] font-medium text-[var(--color-text-secondary)]">{session.time}</span>
                            <Pill tone={statusTone[sessionStatus]} size="sm">{sessionStatus}</Pill>
                          </div>
                          <div className="mt-1.5 truncate text-[12px] font-semibold text-[var(--color-text-primary)]">{session.horseName}</div>
                          <div className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-[var(--color-text-muted)]">
                            {session.session} · {session.distance} · Groom: {session.assignedGroom ?? 'Damilola'}
                          </div>
                          {locked && <div className="mt-1 flex items-center gap-1 text-[10px] text-[var(--color-danger)]"><Icon name="lock" size={10} /> Restricted</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      ) : (
        <div className="mt-4 space-y-4">
          {groups.map((group) => (
            <Panel key={group.date} padded>
              <div className="mb-3 flex items-center justify-between">
                <SectionTitle>{group.date}</SectionTitle>
                <span className="font-metric text-[11px] text-[var(--color-text-muted)]">{group.sessions.length} workouts</span>
              </div>
              <div className="space-y-1.5">
                {group.sessions.map((s) => {
                  const horse = horses.find((h) => h.id === s.horseId);
                  const locked = isLocked(s.horseId);
                  const st = effectiveStatus(s);
                  return (
                    <div
                      key={s.id}
                      className="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5"
                    >
                      <span className="font-metric w-12 shrink-0 text-[13px] font-medium text-[var(--color-text-primary)]">{s.time}</span>
                      <button
                        onClick={() => navigate('training', { view: 'session', refId: s.id })}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                      >
                        {horse && <HorseAvatar name={horse.name} image={horse.image} size={28} />}
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-text-primary)]">
                            {s.horseName}
                            {locked && <Icon name="lock" size={11} className="text-[var(--color-danger)]" />}
                          </span>
                          <span className="block truncate text-[11px] text-[var(--color-text-muted)]">
                            {s.session} · {s.distance} · {s.trainer} · <strong className="text-[var(--color-primary)]">Groom: {s.assignedGroom ?? 'Damilola Okafor'}</strong>
                          </span>
                        </span>
                      </button>
                      <Pill tone={statusTone[st]} size="sm">{st}</Pill>
                      {canLog && <div className="flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon="activity"
                          onClick={() => setLoggingSession(s)}
                        >
                          Log Result
                        </Button>
                        <Button
                          variant="tertiary"
                          size="sm"
                          icon="check"
                          disabled={st === 'Completed'}
                          onClick={() => updateStatus(s, 'Completed', `${s.horseName} workout marked complete`)}
                        >
                          Complete
                        </Button>
                        <Button
                          variant="tertiary"
                          size="sm"
                          icon="clock"
                          onClick={() => updateStatus(s, 'Scheduled', `${s.horseName} workout delayed`)}
                        >
                          Delay
                        </Button>
                        <Button
                          variant="tertiary"
                          size="sm"
                          icon="x"
                          disabled={st === 'Cancelled'}
                          onClick={() => updateStatus(s, 'Cancelled', `${s.horseName} workout cancelled`)}
                        >
                          Cancel
                        </Button>
                      </div>}
                    </div>
                  );
                })}
              </div>
            </Panel>
          ))}
        </div>
      )}
      <LogWorkoutModal open={!!loggingSession} onClose={() => setLoggingSession(undefined)} session={loggingSession} />
    </Screen>
  );
}
