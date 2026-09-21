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

const statusTone: Record<TrainingSession['status'], 'success' | 'warning' | 'primary' | 'neutral'> = {
  Completed: 'success',
  'In progress': 'primary',
  Scheduled: 'neutral',
  Cancelled: 'warning',
};

function uniq(values: string[]): { value: string; label: string }[] {
  return Array.from(new Set(values)).map((v) => ({ value: v, label: v }));
}

export function TrainingScheduleScreen() {
  const { horses, navigate, toast, isLocked, can } = useRtms();
  const canLog = can('training.log');
  const [trainer, setTrainer] = useState('');
  const [status, setStatus] = useState('');
  const [span, setSpan] = useState<'Day' | 'Week'>('Day');
  const [overrides, setOverrides] = useState<Record<string, TrainingSession['status']>>({});

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
          <EmptyState icon="calendar" title="No sessions scheduled" description="No training sessions match the current filters." />
        </Panel>
      ) : (
        <div className="mt-4 space-y-4">
          {groups.map((group) => (
            <Panel key={group.date} padded>
              <div className="mb-3 flex items-center justify-between">
                <SectionTitle>{group.date}</SectionTitle>
                <span className="font-metric text-[11px] text-[var(--color-text-muted)]">{group.sessions.length} sessions</span>
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
                            {s.session} · {s.distance} · {s.trainer}
                          </span>
                        </span>
                      </button>
                      <Pill tone={statusTone[st]} size="sm">{st}</Pill>
                      {canLog && <div className="flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon="check"
                          disabled={st === 'Completed'}
                          onClick={() => updateStatus(s, 'Completed', `${s.horseName} session marked complete`)}
                        >
                          Complete
                        </Button>
                        <Button
                          variant="tertiary"
                          size="sm"
                          icon="clock"
                          onClick={() => updateStatus(s, 'Scheduled', `${s.horseName} session delayed`)}
                        >
                          Delay
                        </Button>
                        <Button
                          variant="tertiary"
                          size="sm"
                          icon="x"
                          disabled={st === 'Cancelled'}
                          onClick={() => updateStatus(s, 'Cancelled', `${s.horseName} session cancelled`)}
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
    </Screen>
  );
}
