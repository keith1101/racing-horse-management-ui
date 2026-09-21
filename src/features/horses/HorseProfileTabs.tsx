import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { DataTable, type Column } from '../../components/DataTable';
import { MetricCard } from '../../components/MetricCard';
import { Pill, HealthBadge, TrainingBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/states';
import { TrainingLockBanner } from '../../components/TrainingLockBanner';
import { useRtms } from '../../app/RtmsContext';
import type { Horse } from './horseData';
import { getMedicalRecord } from '../veterinary/medicalData';
import { TRAINING_PLAN_SUMMARIES, DETAILED_PLANS, TODAY_SESSIONS, type TrainingSession } from '../training/trainingData';
import { RACE_HISTORY, type RaceResult } from '../racing/racingData';
import { getDocuments, DOC_CATEGORY_ICON, type HorseDocument, type DocStatus } from './documentsData';

/* ------------------------------------------------------------------ Health */

export function HorseHealthTab({ horse }: { horse: Horse }) {
  const { navigate, isLocked, getLock, can } = useRtms();
  const canViewPrivateMedical = can('medical.private.view');
  const record = getMedicalRecord(horse.id);
  const lock = getLock(horse.id);
  const latest = record.examinations[0];

  if (!canViewPrivateMedical) {
    return (
      <div className="space-y-4">
        {isLocked(horse.id) && lock && <TrainingLockBanner reason="Veterinary training restriction is active" reviewDate={lock.reviewDate} onView={can('module.veterinary.view') ? () => navigate('veterinary', { view: 'restrictions', horseId: horse.id }) : undefined} />}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <MetricCard label="Health status" value={horse.health === 'FIT' ? 'Fit' : horse.health === 'MONITOR' ? 'Monitor' : horse.health === 'INJURED' ? 'Injured' : 'Isolated'} icon="heart-pulse" tone={horse.health === 'FIT' ? 'success' : horse.health === 'MONITOR' ? 'warning' : 'danger'} />
          <MetricCard label="Weight" value={horse.weightKg} unit="kg" icon="activity" />
          <MetricCard label="Readiness" value={horse.readiness} icon="gauge" tone={horse.readiness === 'Ready' ? 'success' : horse.readiness === 'Restricted' ? 'danger' : 'info'} />
        </div>
        <Panel padded>
          <div className="flex items-center justify-between"><SectionTitle>Health summary</SectionTitle><HealthBadge status={horse.health} /></div>
          <p className="mt-2 text-[13px] text-[var(--color-text-secondary)]">{simplifiedHealthNote(horse.health)}</p>
          <p className="mt-3 text-[12px] text-[var(--color-text-muted)]">Clinical findings, diagnosis and medication details are restricted to veterinary staff and club management.</p>
        </Panel>
      </div>
    );
  }

  const examColumns: Column<(typeof record.examinations)[number]>[] = [
    { key: 'date', header: 'Date', width: '150px', render: (e) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{e.date}</span> },
    { key: 'type', header: 'Type', width: '110px', render: (e) => <Pill tone="neutral" size="sm">{e.type}</Pill> },
    { key: 'diagnosis', header: 'Diagnosis', render: (e) => <span className="text-[13px] text-[var(--color-text-primary)]">{e.diagnosis}</span> },
    { key: 'vet', header: 'Veterinarian', align: 'right', render: (e) => <span className="text-[12px] text-[var(--color-text-secondary)]">{e.vet}</span> },
  ];

  return (
    <div className="space-y-4">
      {isLocked(horse.id) && lock && (
        <TrainingLockBanner reason={lock.reason} reviewDate={lock.reviewDate} veterinarian={lock.veterinarian} onView={can('module.veterinary.view') ? () => navigate('veterinary', { view: 'record', horseId: horse.id }) : undefined} />
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Health status" value={horse.health === 'FIT' ? 'Fit' : horse.health === 'MONITOR' ? 'Monitor' : horse.health === 'INJURED' ? 'Injured' : 'Isolated'} icon="heart-pulse" tone={horse.health === 'FIT' ? 'success' : horse.health === 'MONITOR' ? 'warning' : 'danger'} />
        <MetricCard label="Weight" value={horse.weightKg} unit="kg" icon="activity" />
        <MetricCard label="Resting HR" value={horse.restingHrBpm} unit="bpm" icon="gauge" tone={horse.restingHrBpm > 42 ? 'warning' : 'default'} />
        <MetricCard label="Treatment" value={record.treatment ? record.treatment.status : 'None'} icon="pill" tone={record.treatment?.status === 'Active' ? 'info' : 'default'} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel padded>
          <div className="flex items-center justify-between">
            <SectionTitle>Current health summary</SectionTitle>
            <HealthBadge status={horse.health} />
          </div>
          <p className="mt-2 text-[13px] text-[var(--color-text-secondary)]">{horse.healthNote}</p>
          {record.restriction && (
            <div className="mt-3 flex items-start gap-2 rounded-[var(--radius-sm)] bg-[var(--color-danger-soft)] px-3 py-2 text-[var(--color-danger)]">
              <Icon name="alert-triangle" size={14} className="mt-0.5 shrink-0" />
              <span className="text-[12px] font-medium">{record.restriction}</span>
            </div>
          )}
        </Panel>

        <Panel padded>
          <SectionTitle>Latest examination</SectionTitle>
          {latest ? (
            <div className="mt-2 space-y-3">
              <div className="flex items-center gap-2 text-[12px] text-[var(--color-text-muted)]">
                <Pill tone="neutral" size="sm">{latest.type}</Pill>
                <span>{latest.date} · {latest.vet}</span>
              </div>
              <SymptomsFindings symptoms={latest.symptoms} findings={latest.findings} />
              <div>
                <FieldLabel>Diagnosis</FieldLabel>
                <p className="mt-0.5 text-[13px] text-[var(--color-text-primary)]">{latest.diagnosis}</p>
              </div>
              <div>
                <FieldLabel>Recommendation</FieldLabel>
                <p className="mt-0.5 text-[13px] text-[var(--color-text-secondary)]">{latest.recommendation}</p>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-[13px] text-[var(--color-text-muted)]">No examinations on record.</p>
          )}
        </Panel>
      </div>

      {record.treatment && (
        <Panel padded>
          <div className="flex items-center justify-between">
            <SectionTitle>Treatment summary</SectionTitle>
            <Pill tone={record.treatment.status === 'Active' ? 'info' : record.treatment.status === 'Completed' ? 'success' : record.treatment.status === 'Discontinued' ? 'danger' : 'neutral'}>{record.treatment.status}</Pill>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            <Meta label="Plan" value={record.treatment.title} />
            <Meta label="Started" value={record.treatment.started} />
            <Meta label="Expected end" value={record.treatment.expectedEnd} />
            <Meta label="Veterinarian" value={record.treatment.vet} />
          </div>
          {record.treatment.medications.length > 0 && (
            <ul className="mt-3 space-y-1">
              {record.treatment.medications.map((m, i) => (
                <li key={i} className="flex items-center gap-2 text-[12px]">
                  <Icon name="pill" size={12} className="text-[var(--color-text-muted)]" />
                  <span className="font-medium text-[var(--color-text-primary)]">{m.name}</span>
                  <span className="text-[var(--color-text-muted)]">{m.dose} · {m.route} · {m.frequency}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      <Panel padded>
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Health record history</SectionTitle>
          <Button variant="tertiary" size="sm" icon="file-text" onClick={() => navigate('veterinary', { view: 'record', horseId: horse.id })}>Full medical record</Button>
        </div>
        <DataTable columns={examColumns} rows={record.examinations} rowKey={(e) => e.id} onRowClick={() => navigate('veterinary', { view: 'record', horseId: horse.id })} empty={<EmptyState icon="stethoscope" title="No examinations recorded" />} />
      </Panel>
    </div>
  );
}

function SymptomsFindings({ symptoms, findings }: { symptoms: string[]; findings: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] p-2.5">
        <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]"><Icon name="user" size={12} /><FieldLabel>Symptoms (reported)</FieldLabel></div>
        {symptoms.length ? (
          <ul className="mt-1.5 space-y-1">{symptoms.map((s, i) => <li key={i} className="text-[12px] text-[var(--color-text-secondary)]">· {s}</li>)}</ul>
        ) : <p className="mt-1.5 text-[12px] text-[var(--color-text-muted)]">None reported.</p>}
      </div>
      <div className="rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] p-2.5">
        <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]"><Icon name="stethoscope" size={12} /><FieldLabel>Clinical findings</FieldLabel></div>
        {findings.length ? (
          <ul className="mt-1.5 space-y-1">{findings.map((f, i) => <li key={i} className="text-[12px] text-[var(--color-text-secondary)]">· {f}</li>)}</ul>
        ) : <p className="mt-1.5 text-[12px] text-[var(--color-text-muted)]">None.</p>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Training */

export function HorseTrainingTab({ horse }: { horse: Horse }) {
  const { navigate, isLocked, getLock, can } = useRtms();
  const canViewTrainingModule = can('module.training.view');
  const canViewVetModule = can('module.veterinary.view');
  const summary = TRAINING_PLAN_SUMMARIES.find((p) => p.horseId === horse.id);
  const detailed = DETAILED_PLANS[horse.id];
  const sessions = detailed ? detailed.phases.flatMap((ph) => ph.sessions) : TODAY_SESSIONS.filter((s) => s.horseId === horse.id);
  const completed = sessions.filter((s) => s.result);
  const upcoming = sessions.filter((s) => s.status === 'Scheduled' || s.status === 'In progress');
  const lock = getLock(horse.id);

  const avg = (fn: (s: TrainingSession) => number | undefined) => {
    const vals = completed.map(fn).filter((v): v is number => typeof v === 'number');
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : undefined;
  };
  const avgSpeed = avg((s) => s.result?.avgSpeed);
  const maxSpeed = Math.max(0, ...completed.map((s) => s.result?.maxSpeed ?? 0));

  const sessionColumns: Column<TrainingSession>[] = [
    { key: 'date', header: 'Date', width: '80px', render: (s) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{s.date}</span> },
    { key: 'session', header: 'Session', render: (s) => <span className="text-[13px] text-[var(--color-text-primary)]">{s.session}</span> },
    { key: 'distance', header: 'Distance', render: (s) => <span className="font-metric text-[12px]">{s.distance}</span> },
    { key: 'load', header: 'Load', width: '90px', render: (s) => <Pill tone="neutral" size="sm">{s.load}</Pill> },
    { key: 'status', header: 'Status', width: '110px', render: (s) => <Pill tone={s.status === 'Completed' ? 'success' : s.status === 'In progress' ? 'primary' : s.status === 'Scheduled' ? 'info' : 'neutral'} size="sm">{s.status}</Pill> },
    { key: 'result', header: 'Result', align: 'right', render: (s) => s.result ? <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{s.result.avgSpeed} km/h · {s.result.assessment}</span> : <span className="text-[11px] text-[var(--color-text-muted)]">—</span> },
  ];

  if (!summary && sessions.length === 0) {
    return <EmptyState icon="activity" title="No training plan" description="This horse has no active training plan yet." action={can('training.manage') ? <Button variant="primary" size="sm" icon="plus" onClick={() => navigate('training')}>Create training plan</Button> : undefined} />;
  }

  return (
    <div className="space-y-4">
      {isLocked(horse.id) && lock && (
        <TrainingLockBanner reason={lock.reason} reviewDate={lock.reviewDate} veterinarian={lock.veterinarian} onView={canViewVetModule ? () => navigate('veterinary', { view: 'record', horseId: horse.id }) : undefined} />
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Readiness" value={horse.readiness} icon="gauge" tone={horse.readiness === 'Ready' ? 'success' : horse.readiness === 'Restricted' ? 'danger' : 'info'} />
        <MetricCard label="Plan progress" value={summary?.progress ?? 0} unit="%" icon="trending-up" tone="info" />
        <MetricCard label="Avg speed" value={avgSpeed ? avgSpeed.toFixed(1) : '—'} unit="km/h" icon="activity" />
        <MetricCard label="Top speed" value={maxSpeed ? maxSpeed.toFixed(1) : '—'} unit="km/h" icon="target" tone="success" />
      </div>

      {summary && (
        <Panel padded>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SectionTitle>{summary.title}</SectionTitle>
              <TrainingBadge status={horse.training} />
            </div>
            {canViewTrainingModule && <Button variant="secondary" size="sm" iconRight="chevron-right" onClick={() => navigate('training', { view: 'plan', horseId: horse.id })}>Open plan</Button>}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            <Meta label="Current phase" value={summary.phase} />
            <Meta label="Trainer" value={summary.trainer} />
            <Meta label="Sessions" value={summary.sessions} />
            <Meta label="Target" value={summary.target} />
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px] text-[var(--color-text-muted)]"><span>Progress</span><span className="font-metric">{summary.progress}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
              <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${summary.progress}%` }} />
            </div>
          </div>
        </Panel>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel padded>
          <SectionTitle>Upcoming sessions</SectionTitle>
          {upcoming.length ? (
            <ul className="mt-3 space-y-1.5">
              {upcoming.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2">
                  <span className="font-metric w-16 shrink-0 text-[12px] text-[var(--color-text-secondary)]">{s.date}</span>
                  <div className="min-w-0 flex-1"><div className="truncate text-[13px] text-[var(--color-text-primary)]">{s.session}</div><div className="text-[11px] text-[var(--color-text-muted)]">{s.distance} · {s.surface}</div></div>
                  <Pill tone={s.status === 'In progress' ? 'primary' : 'info'} size="sm">{s.status}</Pill>
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-[13px] text-[var(--color-text-muted)]">No upcoming sessions scheduled.</p>}
        </Panel>

        <Panel padded>
          <SectionTitle>Recent results</SectionTitle>
          {completed.length ? (
            <ul className="mt-3 space-y-2">
              {completed.slice(-4).reverse().map((s) => (
                <li key={s.id} className="flex items-center gap-3">
                  <span className="font-metric w-16 shrink-0 text-[12px] text-[var(--color-text-secondary)]">{s.date}</span>
                  <div className="min-w-0 flex-1"><div className="truncate text-[13px] text-[var(--color-text-primary)]">{s.session}</div><div className="font-metric text-[11px] text-[var(--color-text-muted)]">{s.result?.avgSpeed} km/h avg · recovery {s.result?.recoveryMin} min</div></div>
                  <Pill tone={s.result?.assessment === 'Excellent' ? 'success' : s.result?.assessment === 'Below target' ? 'warning' : 'neutral'} size="sm">{s.result?.assessment}</Pill>
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-[13px] text-[var(--color-text-muted)]">No completed sessions with results yet.</p>}
        </Panel>
      </div>

      <Panel padded>
        <SectionTitle>Session log</SectionTitle>
        <div className="mt-3">
          <DataTable columns={sessionColumns} rows={sessions} rowKey={(s) => s.id} onRowClick={(s) => navigate('training', { view: 'session', refId: s.id })} empty={<EmptyState icon="activity" title="No sessions logged" />} />
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------- Race history */

export function HorseRaceHistoryTab({ horse }: { horse: Horse }) {
  const { navigate } = useRtms();
  const runs = RACE_HISTORY.filter((r) => r.horseId === horse.id);
  const wins = runs.filter((r) => r.finish === 1).length;
  const podiums = runs.filter((r) => r.finish <= 3).length;

  const columns: Column<RaceResult>[] = [
    { key: 'date', header: 'Date', width: '92px', render: (r) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{r.date}</span>, sortValue: (r) => r.date },
    { key: 'race', header: 'Race', render: (r) => <span className="text-[13px] text-[var(--color-text-primary)]">{r.race}</span> },
    { key: 'course', header: 'Track / dist.', render: (r) => <span className="text-[12px] text-[var(--color-text-secondary)]">{r.course} · {r.distance}</span> },
    { key: 'finish', header: 'Position', width: '96px', render: (r) => <span className={'font-metric inline-flex items-center gap-1 text-[13px] font-semibold ' + (r.finish === 1 ? 'text-[var(--color-success)]' : r.finish <= 3 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]')}>{r.finish === 1 && <Icon name="flag" size={12} />}{ordinal(r.finish)} / {r.field}</span>, sortValue: (r) => r.finish },
    { key: 'time', header: 'Time', align: 'right', render: (r) => <span className="font-metric text-[12px]">{r.time}</span> },
    { key: 'margin', header: 'Margin', align: 'right', render: (r) => <span className="text-[12px] text-[var(--color-text-secondary)]">{r.margin}</span> },
    { key: 'jockey', header: 'Jockey', align: 'right', render: (r) => <span className="text-[12px] text-[var(--color-text-secondary)]">{r.jockey}</span> },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Career runs" value={runs.length} unit="starts" icon="flag" />
        <MetricCard label="Wins" value={wins} unit="1st" icon="target" tone="success" />
        <MetricCard label="Podiums" value={podiums} unit="top-3" icon="trending-up" tone="info" />
        <MetricCard label="Strike rate" value={runs.length ? Math.round((wins / runs.length) * 100) : 0} unit="%" icon="gauge" />
      </div>
      <Panel padded>
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Race history</SectionTitle>
          <Button variant="tertiary" size="sm" icon="flag" onClick={() => navigate('racing', { view: 'history' })}>All race history</Button>
        </div>
        <DataTable columns={columns} rows={runs} rowKey={(r) => r.id} empty={<EmptyState icon="flag" title="No race history" description="This horse has not yet started in a race." />} />
      </Panel>
    </div>
  );
}

/* --------------------------------------------------------------- Documents */

const docTone: Record<DocStatus, 'success' | 'info' | 'warning' | 'neutral'> = {
  Verified: 'success',
  Pending: 'info',
  Expired: 'warning',
  Missing: 'neutral',
};

export function HorseDocumentsTab({ horse }: { horse: Horse }) {
  const docs = getDocuments(horse.id);
  const groups: HorseDocument['category'][] = ['Registration', 'Medical', 'Ownership', 'Insurance'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Documents" value={docs.length} unit="files" icon="file-text" />
        <MetricCard label="Verified" value={docs.filter((d) => d.status === 'Verified').length} icon="check" tone="success" />
        <MetricCard label="Pending" value={docs.filter((d) => d.status === 'Pending').length} icon="clock" tone="info" />
        <MetricCard label="Needs attention" value={docs.filter((d) => d.status === 'Expired' || d.status === 'Missing').length} icon="alert-triangle" tone="warning" />
      </div>

      {groups.map((cat) => {
        const items = docs.filter((d) => d.category === cat);
        if (!items.length) return null;
        return (
          <Panel key={cat} padded>
            <div className="mb-2 flex items-center gap-1.5">
              <Icon name={DOC_CATEGORY_ICON[cat]} size={14} className="text-[var(--color-text-muted)]" />
              <SectionTitle>{cat}</SectionTitle>
            </div>
            <ul className="divide-y divide-[var(--color-border)]">
              {items.map((d) => (
                <li key={d.id} className="flex items-center gap-3 py-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]"><Icon name="file-text" size={15} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-[var(--color-text-primary)]">{d.name}</div>
                    <div className="truncate text-[11px] text-[var(--color-text-muted)]">Updated {d.updated} · {d.addedBy} · {d.size}</div>
                  </div>
                  <Pill tone={docTone[d.status]} icon={d.status === 'Verified' ? 'check' : d.status === 'Expired' ? 'alert-triangle' : d.status === 'Missing' ? 'minus' : 'clock'} size="sm">{d.status}</Pill>
                </li>
              ))}
            </ul>
          </Panel>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------- utils */

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

function simplifiedHealthNote(status: Horse['health']) {
  if (status === 'FIT') return 'Cleared for normal operations.';
  if (status === 'MONITOR') return 'Health monitoring is active.';
  if (status === 'INJURED') return 'Veterinary follow-up is required.';
  return 'Isolation or quarantine protocol is active.';
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">{label}</div>
      <div className="text-[12px] text-[var(--color-text-primary)]">{value}</div>
    </div>
  );
}
