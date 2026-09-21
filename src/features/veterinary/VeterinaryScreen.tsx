import { useState } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Drawer } from '../../components/Drawer';
import { HealthBadge, Pill } from '../../components/StatusBadge';
import { HorseAvatar } from '../horses/HorseAvatar';
import { Icon } from '../../components/Icon';
import { AlertIndicator } from '../../components/AlertIndicator';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useRtms } from '../../app/RtmsContext';
import { STABLES } from '../horses/horseData';
import { MedicalRecordScreen } from './MedicalRecordScreen';
import { RestrictionReviewScreen } from './RestrictionReviewScreen';
import { ExaminationScreen } from './ExaminationScreen';
import { TreatmentPlanScreen } from './TreatmentPlanScreen';
import { TreatmentScheduleScreen } from './TreatmentScheduleScreen';

export function VeterinaryScreen() {
  const { route, can, navigate } = useRtms();
  const isPrivateView = typeof route.view === 'string' && ['record', 'restrictions', 'examine', 'treatment', 'treatment-schedule'].includes(route.view);
  if (isPrivateView && !can('medical.private.view')) {
    return (
      <Screen
        title="Medical details restricted"
        primary={<Button variant="primary" icon="heart-pulse" onClick={() => navigate('veterinary')}>Back to health map</Button>}
      >
        <Panel padded>
          <p className="text-[13px] text-[var(--color-text-secondary)]">
            Your role can view operational health status, but diagnosis, medication, examination and restriction decisions remain private to authorized medical staff.
          </p>
        </Panel>
      </Screen>
    );
  }
  if (route.view === 'record') return <MedicalRecordScreen />;
  if (route.view === 'restrictions') return <RestrictionReviewScreen />;
  if (route.view === 'examine') return <ExaminationScreen />;
  if (route.view === 'treatment') return <TreatmentPlanScreen />;
  if (route.view === 'treatment-schedule') return <TreatmentScheduleScreen />;
  return <StableHealthScreen />;
}

function StableHealthScreen() {
  const { horses, navigate, isLocked, getLock, unlockTraining, issues, updateIssueStatus, toast, can, getMedicalRecord, currentUser } = useRtms();
  const isGroom = currentUser.role === 'GROOM';
  const canViewPrivateMedical = can('medical.private.view');
  const [openId, setOpenId] = useState<string | undefined>();
  const [confirmUnlock, setConfirmUnlock] = useState<string | undefined>();

  const counts = {
    FIT: horses.filter((h) => h.health === 'FIT').length,
    MONITOR: horses.filter((h) => h.health === 'MONITOR').length,
    INJURED: horses.filter((h) => h.health === 'INJURED').length,
    ISOLATED: horses.filter((h) => h.health === 'ISOLATED').length,
    restricted: horses.filter((h) => isLocked(h.id)).length,
  };

  const openHorse = horses.find((h) => h.id === openId);
  const record = openHorse ? getMedicalRecord(openHorse.id) : undefined;
  const latestExam = record?.examinations[0];
  
  // Incidents list: for groom, highlight their reported incidents
  const incidentList = isGroom
    ? issues.filter((i) => i.reportedBy === currentUser.name || i.reportedBy === 'D. Okafor')
    : issues;

  // Horses assigned to current groom
  const myAssignedHorses = useMemo(() => {
    return horses.filter((h) => h.assignedGroom === currentUser.name);
  }, [horses, currentUser.name]);

  // Order stables so Barn containing groom's stalls comes first
  const orderedStables = useMemo(() => {
    if (!isGroom || myAssignedHorses.length === 0) return STABLES;
    const groomBarn = myAssignedHorses[0]?.stable || 'Barn A';
    return [groomBarn, ...STABLES.filter((b) => b !== groomBarn)];
  }, [isGroom, myAssignedHorses]);

  return (
    <Screen
      title="Stable Health"
      context={
        isGroom ? (
          <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-secondary)]">
            <Icon name="shield" size={13} className="text-[var(--color-primary)]" />
            Stable health map with your assigned stalls highlighted · Updated 20 Sep 2026
          </span>
        ) : (
          'Health status board across all stables — updated 20 Sep 2026, 08:20.'
        )
      }
      secondary={
        <>
          {canViewPrivateMedical && <Button variant="tertiary" icon="lock" onClick={() => navigate('veterinary', { view: 'restrictions' })}>Restriction review</Button>}
          {canViewPrivateMedical && <Button variant="tertiary" icon="calendar" onClick={() => navigate('veterinary', { view: 'treatment-schedule' })}>Treatment schedule</Button>}
          {canViewPrivateMedical && can('medical.treatment.manage') && <Button variant="secondary" icon="pill" onClick={() => navigate('veterinary', { view: 'treatment' })}>Start treatment</Button>}
        </>
      }
      primary={
        can('medical.record') ? <Button variant="primary" icon="stethoscope" onClick={() => navigate('veterinary', { view: 'examine' })}>Record examination</Button> : undefined
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <MetricCard label="Fit" value={counts.FIT} unit="horses" icon="check" tone="success" />
        <MetricCard label="Monitor" value={counts.MONITOR} unit="horses" icon="activity" tone="warning" />
        <MetricCard label="Injured" value={counts.INJURED} unit="horses" icon="alert-triangle" tone="danger" />
        <MetricCard label="Isolated" value={counts.ISOLATED} unit="horses" icon="shield" tone="info" />
        <MetricCard label="Training-restricted" value={counts.restricted} unit="horses" icon="lock" tone={counts.restricted ? 'danger' : 'default'} />
      </div>

      {/* Groom Assigned Stalls Spotlight Panel */}
      {isGroom && myAssignedHorses.length > 0 && (
        <Panel padded className="mt-4 border-2 border-[var(--color-primary)] bg-[var(--color-primary-soft)]/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                <Icon name="building" size={14} />
              </span>
              <div>
                <SectionTitle>My Assigned Stalls (Barn A)</SectionTitle>
                <p className="text-[11px] text-[var(--color-text-secondary)]">
                  Stalls in your direct care: {myAssignedHorses.map((h) => `Stall ${h.stall} (${h.name})`).join(' · ')}
                </p>
              </div>
            </div>
            <Pill tone="primary" size="sm">
              {myAssignedHorses.length} Stalls Assigned
            </Pill>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {myAssignedHorses.map((h) => {
              const locked = isLocked(h.id);
              return (
                <button
                  key={h.id}
                  onClick={() => setOpenId(h.id)}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-primary)]/40 bg-[var(--color-surface)] p-3 text-left outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                >
                  <div className="flex h-9 w-10 shrink-0 flex-col items-center justify-center rounded bg-[var(--color-primary-soft)] text-center">
                    <span className="font-metric text-[12px] font-bold text-[var(--color-primary)]">
                      {h.stall}
                    </span>
                    <span className="text-[9px] text-[var(--color-primary)]">Barn A</span>
                  </div>

                  <HorseAvatar name={h.name} image={h.image} size={36} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 truncate text-[13px] font-semibold text-[var(--color-text-primary)]">
                      {h.name}
                      {locked && <Icon name="lock" size={11} className="text-[var(--color-danger)]" />}
                    </div>
                    <div className="truncate text-[11px] text-[var(--color-text-muted)]">
                      {h.healthNote}
                    </div>
                  </div>

                  <HealthBadge status={h.health} size="sm" />
                </button>
              );
            })}
          </div>
        </Panel>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Stable board */}
        <div className="space-y-4">
          {orderedStables.map((barn) => {
            const inBarn = horses.filter((h) => h.stable === barn);
            if (inBarn.length === 0) return null;
            const hasMyHorses = inBarn.some((h) => h.assignedGroom === currentUser.name);

            return (
              <Panel key={barn} padded className={hasMyHorses && isGroom ? 'border-l-4 border-l-[var(--color-primary)]' : undefined}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="building" size={15} className="text-[var(--color-text-muted)]" />
                    <SectionTitle>{barn}</SectionTitle>
                    <span className="text-[11px] text-[var(--color-text-muted)]">{inBarn.length} horses</span>
                  </div>
                  {hasMyHorses && isGroom && (
                    <Pill tone="primary" size="sm">
                      Your Barn
                    </Pill>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {inBarn.map((h) => {
                    const locked = isLocked(h.id);
                    const isMine = isGroom && h.assignedGroom === currentUser.name;
                    return (
                      <button
                        key={h.id}
                        onClick={() => setOpenId(h.id)}
                        className={
                          'flex items-center gap-2.5 rounded-[var(--radius-md)] border p-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' +
                          (isMine
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]/15 hover:border-[var(--color-primary)] shadow-xs'
                            : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]')
                        }
                      >
                        <HorseAvatar name={h.name} image={h.image} size={36} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 truncate text-[13px] font-medium text-[var(--color-text-primary)]">
                            {h.name}
                            {locked && <Icon name="lock" size={11} className="text-[var(--color-danger)]" />}
                          </div>
                          <div className="truncate text-[11px] text-[var(--color-text-muted)]">
                            Stall {h.stall} · {h.healthNote}
                          </div>
                        </div>
                        <HealthBadge status={h.health} size="sm" />
                      </button>
                    );
                  })}
                </div>
              </Panel>
            );
          })}
        </div>

        {/* Right column: Incident Reports */}
        <Panel padded className="self-start">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <SectionTitle>{isGroom ? 'My Reported Incidents' : 'Recent Incident Reports'}</SectionTitle>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                {isGroom ? 'Reports submitted by you and their current vet status' : 'Issues reported by stable grooms'}
              </p>
            </div>
            <Pill tone={incidentList.length ? 'warning' : 'neutral'} size="sm">
              {incidentList.length} total
            </Pill>
          </div>

          {incidentList.length === 0 ? (
            <p className="py-6 text-center text-[12px] text-[var(--color-text-muted)]">
              No recent incident reports.
            </p>
          ) : (
            <div className="space-y-2.5">
              {incidentList.map((i) => {
                const statusToneMap: Record<string, 'warning' | 'primary' | 'success' | 'neutral'> = {
                  'Pending Vet check': 'warning',
                  'New': 'warning',
                  'Under review': 'primary',
                  'Under treatment': 'primary',
                  'Resolved': 'success',
                };
                const tone = statusToneMap[i.status] || 'neutral';
                const sev = i.severity.toUpperCase();

                return (
                  <div
                    key={i.id}
                    className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <button
                          onClick={() => canViewPrivateMedical ? navigate('veterinary', { view: 'record', horseId: i.horseId }) : setOpenId(i.horseId)}
                          className="text-[13px] font-semibold text-[var(--color-text-primary)] hover:underline text-left block"
                        >
                          {i.horseName}
                        </button>
                        {i.title && (
                          <span className="block text-[12px] font-medium text-[var(--color-text-secondary)]">
                            {i.title}
                          </span>
                        )}
                      </div>

                      <AlertIndicator
                        severity={sev === 'CRITICAL' || sev === 'HIGH' ? 'critical' : sev === 'MEDIUM' || sev === 'MODERATE' ? 'warning' : 'info'}
                        size="sm"
                      >
                        {sev}
                      </AlertIndicator>
                    </div>

                    <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                      {i.observation}
                    </p>

                    {i.imageUrl && (
                      <div className="mt-2 overflow-hidden rounded-[var(--radius-xs)] border border-[var(--color-border)]">
                        <img src={i.imageUrl} alt="Incident attachment" className="h-24 w-full object-cover" />
                      </div>
                    )}

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-2 text-[11px] text-[var(--color-text-muted)]">
                      <span>
                        {i.category} · {i.time}
                      </span>
                      <Pill tone={tone} size="sm">
                        {i.status}
                      </Pill>
                    </div>

                    {can('medical.record') && i.status !== 'Resolved' && (
                      <div className="mt-2 text-right">
                        <button
                          onClick={() => { updateIssueStatus(i.id, 'Resolved'); toast(`${i.horseName} incident resolved`, 'success'); }}
                          className="text-[11px] font-medium text-[var(--color-primary)] hover:underline"
                        >
                          Mark resolved
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      {/* Medical side panel */}
      <Drawer
        open={!!openHorse}
        onClose={() => setOpenId(undefined)}
        title={openHorse?.name ?? ''}
        subtitle={openHorse ? `${openHorse.stable} · Stall ${openHorse.stall} · ${openHorse.breed}` : undefined}
        footer={
          openHorse && canViewPrivateMedical && (
            <>
              {isLocked(openHorse.id) && (
                <Button variant="secondary" size="sm" icon="refresh" onClick={() => setConfirmUnlock(openHorse.id)}>
                  Update restriction
                </Button>
              )}
              <Button variant="primary" size="sm" icon="file-text" onClick={() => navigate('veterinary', { view: 'record', horseId: openHorse.id })}>
                View medical record
              </Button>
            </>
          )
        }
      >
        {openHorse && record && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <HorseAvatar name={openHorse.name} image={openHorse.image} size={48} rounded="md" />
              <div>
                <HealthBadge status={openHorse.health} />
                <p className="mt-1 text-[12px] text-[var(--color-text-secondary)]">{openHorse.healthNote}</p>
              </div>
            </div>

            {!canViewPrivateMedical && (
              <Panel padded>
                <div className="flex items-center gap-3">
                  <HealthBadge status={openHorse.health} />
                  <p className="text-[12px] text-[var(--color-text-secondary)]">Operational health summary only. Clinical details are restricted.</p>
                </div>
              </Panel>
            )}

            {canViewPrivateMedical && record.restriction && (
              <div className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-[var(--color-danger-soft)] p-2.5 text-[var(--color-danger)]">
                <Icon name="lock" size={14} className="mt-0.5 shrink-0" />
                <span className="text-[12px] font-medium">{record.restriction}</span>
              </div>
            )}

            {canViewPrivateMedical && latestExam && (
              <section>
                <FieldLabel>Latest examination</FieldLabel>
                <div className="mt-1 text-[12px] text-[var(--color-text-muted)]">{latestExam.date} · {latestExam.vet} · {latestExam.type}</div>
                <div className="mt-2 space-y-2">
                  <ExamBlock label="Symptoms (reported)" items={latestExam.symptoms} tone="reported" empty="None reported" />
                  <ExamBlock label="Clinical findings" items={latestExam.findings} tone="clinical" empty="No findings" />
                  <div>
                    <FieldLabel>Diagnosis</FieldLabel>
                    <p className="mt-0.5 text-[13px] font-medium text-[var(--color-text-primary)]">{latestExam.diagnosis}</p>
                  </div>
                </div>
              </section>
            )}

            {canViewPrivateMedical && record.treatment && (
              <section>
                <div className="flex items-center justify-between">
                  <FieldLabel>Treatment</FieldLabel>
                  <Pill tone={record.treatment.status === 'Active' ? 'primary' : record.treatment.status === 'Completed' ? 'success' : 'neutral'} size="sm">
                    {record.treatment.status}
                  </Pill>
                </div>
                <p className="mt-1 text-[13px] font-medium text-[var(--color-text-primary)]">{record.treatment.title}</p>
                {record.treatment.medications.length > 0 && (
                  <ul className="mt-1.5 space-y-1">
                    {record.treatment.medications.map((m) => (
                      <li key={m.name} className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-secondary)]">
                        <Icon name="pill" size={12} className="text-[var(--color-text-muted)]" />
                        {m.name} · {m.dose} · {m.frequency}
                      </li>
                    ))}
                  </ul>
                )}
                {record.treatment.schedule.find((t) => !t.done) && (
                  <div className="mt-2 text-[12px]">
                    <span className="text-[var(--color-text-muted)]">Next: </span>
                    {(() => {
                      const next = record.treatment!.schedule.find((t) => !t.done)!;
                      return <span className="text-[var(--color-text-primary)]">{next.task} · {next.date} {next.time} · {next.by}</span>;
                    })()}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!confirmUnlock}
        title="Lift training restriction?"
        description={
          <>
            This will remove the training lock and allow scheduling to resume. The change propagates to the horse
            profile, training dashboard and plan immediately.
          </>
        }
        confirmLabel="Lift restriction"
        onCancel={() => setConfirmUnlock(undefined)}
        onConfirm={() => {
          const id = confirmUnlock!;
          const name = horses.find((h) => h.id === id)?.name ?? 'Horse';
          unlockTraining(id);
          setConfirmUnlock(undefined);
          toast(`Training restriction lifted for ${name}`, 'success');
        }}
      />
    </Screen>
  );
}

function ExamBlock({
  label,
  items,
  tone,
  empty,
}: {
  label: string;
  items: string[];
  tone: 'reported' | 'clinical';
  empty: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {items.length === 0 ? (
        <p className="mt-0.5 text-[12px] text-[var(--color-text-muted)]">{empty}</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {items.map((it) => (
            <li key={it} className="flex items-start gap-1.5 text-[12px] text-[var(--color-text-secondary)]">
              <Icon
                name={tone === 'reported' ? 'user' : 'stethoscope'}
                size={12}
                className="mt-0.5 shrink-0 text-[var(--color-text-muted)]"
              />
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
