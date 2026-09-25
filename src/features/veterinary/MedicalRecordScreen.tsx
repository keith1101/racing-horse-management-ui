import { useState } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Tabs } from '../../components/Tabs';
import { Timeline, type TimelineEntry } from '../../components/Timeline';
import { HealthBadge, Pill } from '../../components/StatusBadge';
import { HorseAvatar } from '../horses/HorseAvatar';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/states';
import { TrainingLockBanner } from '../../components/TrainingLockBanner';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useRtms } from '../../app/RtmsContext';
import type { TreatmentTask } from './medicalData';

export function MedicalRecordScreen() {
  const { route, navigate, getHorse, isLocked, getLock, lockTraining, unlockTraining, toast, can, getMedicalRecord } = useRtms();
  const horse = getHorse(route.horseId);
  const [tab, setTab] = useState('record');
  const [confirmLock, setConfirmLock] = useState<'lock' | 'unlock' | null>(null);
  const [doneTasks, setDoneTasks] = useState<Record<string, boolean>>({});

  if (!horse) {
    return (
      <Screen title="Medical record">
        <Panel className="p-0">
          <EmptyState
            icon="stethoscope"
            title="No horse selected"
            description="Open a horse from the stable health board to view its medical record."
            action={<Button variant="secondary" size="sm" icon="arrow-left" onClick={() => navigate('veterinary')}>Back to stable health</Button>}
          />
        </Panel>
      </Screen>
    );
  }

  const record = getMedicalRecord(horse.id);
  const locked = isLocked(horse.id);
  const lock = getLock(horse.id);
  const treatment = record.treatment;

  const tabs = [
    { id: 'record', label: 'Medical record', icon: 'file-text' as const },
    { id: 'exam', label: 'Examination', icon: 'stethoscope' as const, count: record.examinations.length },
    { id: 'treatment', label: 'Treatment', icon: 'pill' as const },
    { id: 'schedule', label: 'Treatment schedule', icon: 'calendar' as const },
  ];

  const timeline: TimelineEntry[] = record.examinations.map((e) => ({
    id: e.id,
    time: e.date,
    title: `${e.type} — ${e.diagnosis}`,
    detail: `${e.vet} · ${e.recommendation}`,
    icon: 'stethoscope',
    tone: e.type === 'Emergency' ? 'danger' : 'info',
  }));

  function toggleTask(t: TreatmentTask) {
    if (!can('medical.treatment.manage')) {
      toast('Only veterinary staff or club management can update treatment task completion.', 'danger');
      return;
    }
    setDoneTasks((prev) => ({ ...prev, [t.id]: !(prev[t.id] ?? t.done) }));
    toast(`${t.task} marked ${(doneTasks[t.id] ?? t.done) ? 'incomplete' : 'complete'}`);
  }

  return (
    <Screen
      title="Medical record"
      context={
        <button onClick={() => navigate('veterinary')} className="inline-flex items-center gap-1 hover:underline">
          <Icon name="arrow-left" size={13} /> Back to stable health
        </button>
      }
      secondary={can('medical.record') ? (
        <Button variant="secondary" icon="stethoscope" onClick={() => navigate('veterinary', { view: 'examine', horseId: horse.id })}>
          Record examination
        </Button>
      ) : undefined}
      primary={
        locked && can('medical.lock_training') ? (
          <Button variant="secondary" icon="refresh" onClick={() => setConfirmLock('unlock')}>
            Lift restriction
          </Button>
        ) : !locked && can('medical.lock_training') ? (
          <Button variant="destructive" icon="lock" onClick={() => setConfirmLock('lock')}>
            Apply restriction
          </Button>
        ) : undefined
      }
    >
      {/* Identity header */}
      <Panel padded>
        <div className="flex flex-wrap items-center gap-4">
          <HorseAvatar name={horse.name} image={horse.image} size={52} rounded="md" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-semibold text-[var(--color-text-primary)]">{horse.name}</h2>
              <HealthBadge status={horse.health} />
            </div>
            <p className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">
              {horse.breed} · {horse.sex} · {horse.ageYears} yrs · {horse.stable} · Stall {horse.stall}
            </p>
          </div>
          <button
            onClick={() => navigate('horses', { horseId: horse.id })}
            className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
          >
            Open horse profile
          </button>
        </div>
        {locked && lock && (
          <div className="mt-3">
            <TrainingLockBanner reason={lock.reason} reviewDate={lock.reviewDate} veterinarian={lock.veterinarian} />
          </div>
        )}
      </Panel>

      <div className="mt-4">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>

      <div className="mt-4">
        {tab === 'record' && (
          <Panel padded>
            <SectionTitle>Medical history</SectionTitle>
            <div className="mt-3">
              {timeline.length ? <Timeline entries={timeline} /> : <p className="text-[13px] text-[var(--color-text-muted)]">No history on record.</p>}
            </div>
          </Panel>
        )}

        {tab === 'exam' && (
          <div className="space-y-3">
            {record.examinations.map((e) => (
              <Panel key={e.id} padded>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Pill tone={e.type === 'Emergency' ? 'danger' : 'info'} size="sm">{e.type}</Pill>
                    <span className="text-[13px] font-medium text-[var(--color-text-primary)]">{e.diagnosis}</span>
                  </div>
                  <span className="font-metric text-[11px] text-[var(--color-text-muted)]">{e.date} · {e.vet}</span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Symptoms (reported)</FieldLabel>
                    {e.symptoms.length ? (
                      <ul className="mt-1 space-y-1">
                        {e.symptoms.map((s) => (
                          <li key={s} className="flex items-start gap-1.5 text-[12px] text-[var(--color-text-secondary)]">
                            <Icon name="user" size={12} className="mt-0.5 shrink-0 text-[var(--color-text-muted)]" />{s}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-0.5 text-[12px] text-[var(--color-text-muted)]">None reported</p>
                    )}
                  </div>
                  <div>
                    <FieldLabel>Clinical findings</FieldLabel>
                    <ul className="mt-1 space-y-1">
                      {e.findings.map((f) => (
                        <li key={f} className="flex items-start gap-1.5 text-[12px] text-[var(--color-text-secondary)]">
                          <Icon name="stethoscope" size={12} className="mt-0.5 shrink-0 text-[var(--color-text-muted)]" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] p-2.5">
                  <FieldLabel>Recommendation</FieldLabel>
                  <p className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">{e.recommendation}</p>
                </div>
              </Panel>
            ))}
          </div>
        )}

        {tab === 'treatment' && (
          <Panel padded>
            {treatment ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <SectionTitle>{treatment.title}</SectionTitle>
                  <div className="flex items-center gap-2">
                    <Pill tone={treatment.status === 'Active' ? 'primary' : treatment.status === 'Completed' ? 'success' : 'neutral'}>
                      {treatment.status}
                    </Pill>
                    <Button variant="tertiary" size="sm" iconRight="chevron-right" onClick={() => navigate('veterinary', { view: 'treatment', horseId: horse.id })}>
                      Open plan
                    </Button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                  <Meta label="Started" value={treatment.started} />
                  <Meta label="Expected end" value={treatment.expectedEnd} />
                  <Meta label="Veterinarian" value={treatment.vet} />
                  <Meta label="Medications" value={`${treatment.medications.length}`} />
                </div>
                <div className="mt-4">
                  <FieldLabel>Medications</FieldLabel>
                  {treatment.medications.length ? (
                    <div className="mt-2 space-y-1.5">
                      {treatment.medications.map((m) => (
                        <div key={m.name} className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2.5 py-2">
                          <Icon name="pill" size={14} className="text-[var(--color-text-muted)]" />
                          <span className="text-[13px] font-medium text-[var(--color-text-primary)]">{m.name}</span>
                          <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{m.dose} · {m.route}</span>
                          <span className="ml-auto text-[12px] text-[var(--color-text-muted)]">{m.frequency}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">No medications — monitoring only.</p>
                  )}
                </div>
              </>
            ) : (
              <EmptyState
                icon="pill"
                title="No active treatment"
                description="This horse has no treatment plan on record."
                action={can('medical.treatment.manage') ? (
                  <Button variant="primary" size="sm" icon="plus" onClick={() => navigate('veterinary', { view: 'treatment', horseId: horse.id })}>
                    Create treatment plan
                  </Button>
                ) : undefined}
              />
            )}
          </Panel>
        )}

        {tab === 'schedule' && (
          <Panel padded>
            <div className="flex items-center justify-between">
              <SectionTitle>Treatment schedule</SectionTitle>
              <Button variant="tertiary" size="sm" icon="calendar" onClick={() => navigate('veterinary', { view: 'treatment-schedule' })}>
                All schedules
              </Button>
            </div>
            {treatment && treatment.schedule.length ? (
              <ul className="mt-3 divide-y divide-[var(--color-border)]">
                {treatment.schedule.map((t) => {
                  const done = doneTasks[t.id] ?? t.done;
                  return (
                    <li key={t.id} className="flex items-center gap-3 py-2.5">
                      <button
                        onClick={() => toggleTask(t)}
                        aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                        className={
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' +
                          (done
                            ? 'border-[var(--color-success)] bg-[var(--color-success)] text-[var(--color-text-inverse)]'
                            : 'border-[var(--color-border-strong)] text-transparent hover:border-[var(--color-text-muted)]')
                        }
                      >
                        <Icon name="check" size={12} />
                      </button>
                      <span className="font-metric w-24 shrink-0 text-[12px] text-[var(--color-text-secondary)]">{t.date} {t.time}</span>
                      <span className={'flex-1 text-[13px] ' + (done ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]')}>
                        {t.task}
                      </span>
                      <span className="text-[12px] text-[var(--color-text-muted)]">{t.by}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-2 text-[13px] text-[var(--color-text-muted)]">No scheduled treatment tasks.</p>
            )}
          </Panel>
        )}
      </div>

      <ConfirmDialog
        open={confirmLock === 'lock'}
        tone="danger"
        title={`Apply training restriction to ${horse.name}?`}
        description="Training will be locked across the horse profile, training dashboard and plan until a vet lifts the restriction."
        confirmLabel="Apply restriction"
        onCancel={() => setConfirmLock(null)}
        onConfirm={() => {
          lockTraining(horse.id, {
            reason: record.examinations[0]?.diagnosis ?? 'Veterinary restriction',
            reviewDate: '27 Sep 2026',
            veterinarian: 'Dr. Haines',
          });
          setConfirmLock(null);
          toast(`Training restriction applied to ${horse.name}`, 'warning');
        }}
      />
      <ConfirmDialog
        open={confirmLock === 'unlock'}
        title={`Lift training restriction for ${horse.name}?`}
        description="Scheduling will resume immediately and the change propagates to every module."
        confirmLabel="Lift restriction"
        onCancel={() => setConfirmLock(null)}
        onConfirm={() => {
          unlockTraining(horse.id);
          setConfirmLock(null);
          toast(`Training restriction lifted for ${horse.name}`, 'success');
        }}
      />
    </Screen>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-0.5 text-[13px] text-[var(--color-text-primary)]">{value}</div>
    </div>
  );
}
