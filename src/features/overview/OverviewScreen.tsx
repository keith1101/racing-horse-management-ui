import { useMemo } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle } from '../../components/Panel';
import { HealthBadge, Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { HorseAvatar } from '../horses/HorseAvatar';
import { useRtms } from '../../app/RtmsContext';
import { TODAY_SESSIONS } from '../training/trainingData';

const ROLE_OVERVIEW: Record<ReturnType<typeof useRtms>['currentUser']['role'], { title: string; context: string }> = {
  HEAD_TRAINER: { title: 'Training command', context: 'Today’s training readiness, restrictions and race preparation.' },
  VETERINARIAN: { title: 'Clinical overview', context: 'Clinical follow-ups, restrictions and observations requiring review.' },
  GROOM: { title: 'Stable operations', context: 'Assigned daily care, stable health and intake placement work.' },
  HORSE_OWNER: { title: 'My horses', context: 'Your horses, upcoming work and ownership updates.' },
  CLUB_MANAGER: { title: 'Club overview', context: 'Admissions, racing approvals, billing and stable-wide operational status.' },
};

export function OverviewScreen() {
  const {
    horses,
    issues,
    navigate,
    isLocked,
    getLock,
    can,
    currentUser,
    candidates,
    raceProposals,
    getCandidateStatus,
    getMedicalRecord,
  } = useRtms();
  const persona = ROLE_OVERVIEW[currentUser.role];
  const horseIds = new Set(horses.map((horse) => horse.id));
  const visibleSessions = TODAY_SESSIONS.filter((session) => horseIds.has(session.horseId));
  const canViewPrivateMedical = can('medical.private.view');
  const canViewVetModule = can('module.veterinary.view');
  const canViewTrainingModule = can('module.training.view');

  const count = (fn: (h: (typeof horses)[number]) => boolean) => horses.filter(fn).length;
  const restricted = horses.filter((h) => isLocked(h.id));
  const openIssues = issues.filter((i) => i.status !== 'Resolved');
  const attention = horses.filter((h) => h.health === 'INJURED' || h.health === 'ISOLATED' || isLocked(h.id));
  const activeTreatmentsCount = horses.filter((h) => getMedicalRecord(h.id).treatment?.status === 'Active').length;
  const pendingVetCandidates = candidates.filter((c) => (getCandidateStatus ? getCandidateStatus(c) : c.evaluation) === 'VET_REVIEW').length;

  const treatmentTasks = useMemo(() => {
    const tasks: Array<{
      id: string;
      horseId: string;
      horseName: string;
      time: string;
      task: string;
      by: string;
      done: boolean;
    }> = [];
    horses.forEach((h) => {
      const record = getMedicalRecord(h.id);
      if (record.treatment && record.treatment.status === 'Active') {
        record.treatment.schedule.forEach((task) => {
          tasks.push({
            id: task.id,
            horseId: h.id,
            horseName: h.name,
            time: task.time,
            task: task.task,
            by: task.by,
            done: task.done,
          });
        });
      }
    });
    return tasks;
  }, [horses, getMedicalRecord]);

  const vetCandidates = useMemo(() => {
    return candidates.filter((c) => (getCandidateStatus ? getCandidateStatus(c) : c.evaluation) === 'VET_REVIEW');
  }, [candidates, getCandidateStatus]);

  return (
    <Screen
      title={persona.title}
      context={persona.context}
      primary={
        currentUser.role === 'VETERINARIAN' ? (
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon="clipboard" onClick={() => navigate('veterinary', { view: 'schedule' })}>
              Treatment schedule
            </Button>
            <Button variant="primary" icon="plus" onClick={() => navigate('veterinary')}>
              New examination
            </Button>
          </div>
        ) : can('horse.create') ? (
          <Button variant="primary" icon="plus" onClick={() => navigate('horses', { view: 'register' })}>
            Register horse
          </Button>
        ) : undefined
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Horses in care" value={horses.length} unit="total" icon="list" onClick={() => navigate('horses')} />
        <MetricCard label="Fit" value={count((h) => h.health === 'FIT')} unit="horses" icon="check" tone="success" />
        <MetricCard label="Monitor" value={count((h) => h.health === 'MONITOR')} unit="horses" icon="activity" tone="warning" />
        <MetricCard label="Injured" value={count((h) => h.health === 'INJURED')} unit="horses" icon="alert-triangle" tone="danger" />
        <MetricCard label="Isolated" value={count((h) => h.health === 'ISOLATED')} unit="horses" icon="shield" tone="info" />
        <MetricCard label="Training restricted" value={restricted.length} unit="locked" icon="lock" tone={restricted.length ? 'danger' : 'default'} onClick={() => navigate(canViewVetModule ? 'veterinary' : 'horses')} />
      </div>

      {currentUser.role === 'VETERINARIAN' && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            label="Candidate Vet Checks"
            value={pendingVetCandidates}
            unit="pending"
            icon="clipboard"
            tone="warning"
            hint="Awaiting clinical & soundness exam"
            onClick={() => navigate('management')}
          />
          <MetricCard
            label="Active Training Locks"
            value={restricted.length}
            unit="horses"
            icon="lock"
            tone={restricted.length ? 'danger' : 'default'}
            hint="Enforced clinical training restrictions"
            onClick={() => navigate('veterinary')}
          />
          <MetricCard
            label="Active Treatments"
            value={activeTreatmentsCount}
            unit="plans"
            icon="pill"
            tone="info"
            hint="Active medication & therapy regimens"
            onClick={() => navigate('veterinary', { view: 'schedule' })}
          />
          <MetricCard
            label="Groom Observations"
            value={openIssues.length}
            unit="reports"
            icon="alert-triangle"
            tone={openIssues.length ? 'warning' : 'default'}
            hint="Incident reports requiring clinical triage"
            onClick={() => navigate('veterinary')}
          />
        </div>
      )}

      {currentUser.role === 'CLUB_MANAGER' && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard label="Final admission review" value={candidates.filter((candidate) => candidate.evaluation === 'MANAGER_REVIEW').length} unit="applications" icon="users" tone="warning" onClick={() => navigate('management')} />
          <MetricCard label="Race approvals" value={raceProposals.filter((proposal) => proposal.status === 'PENDING').length} unit="proposals" icon="flag" tone="info" onClick={() => navigate('racing')} />
          <MetricCard label="Open observations" value={openIssues.length} unit="reported" icon="alert-triangle" tone={openIssues.length ? 'warning' : 'default'} />
          <MetricCard label="Active restrictions" value={restricted.length} unit="horses" icon="lock" tone={restricted.length ? 'danger' : 'default'} />
        </div>
      )}

      {currentUser.role === 'HORSE_OWNER' && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            label="Nominations to approve"
            value={raceProposals.filter((p) => p.status === 'PENDING' && horseIds.has(p.horseId)).length}
            unit="proposals"
            icon="clock"
            tone={raceProposals.some((p) => p.status === 'PENDING' && horseIds.has(p.horseId)) ? 'warning' : 'default'}
            hint="Race entry & budget authorization"
            onClick={() => navigate('racing')}
          />
          <MetricCard
            label="My horses in training"
            value={horses.filter((h) => h.training === 'ACTIVE').length}
            unit="horses"
            icon="activity"
            tone="info"
            onClick={() => navigate('horses')}
          />
          <MetricCard
            label="Admissions in progress"
            value={candidates.filter((c) => c.owner === currentUser.owner && c.evaluation !== 'APPROVED' && c.evaluation !== 'REJECTED').length}
            unit="applications"
            icon="clipboard"
            tone="neutral"
            onClick={() => navigate('management')}
          />
          <MetricCard
            label="Sound & race-ready"
            value={horses.filter((h) => h.health === 'FIT' && h.readiness === 'Ready').length}
            unit="horses"
            icon="check"
            tone="success"
            onClick={() => navigate('horses')}
          />
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        {/* Left column */}
        <div className="space-y-4">
          {/* Horse Owner: Race Nominations Awaiting Approval */}
          {currentUser.role === 'HORSE_OWNER' && (
            <Panel padded>
              <div className="flex items-center justify-between">
                <div>
                  <SectionTitle>Race Nominations Awaiting Approval</SectionTitle>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Head Trainer proposals for your horses requiring entry authorization
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('racing')}>
                  Open Racing
                </Button>
              </div>
              {raceProposals.filter((p) => p.status === 'PENDING' && horseIds.has(p.horseId)).length === 0 ? (
                <p className="py-4 text-center text-[13px] text-[var(--color-text-muted)]">
                  All race nominations reviewed. No pending budget approvals.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {raceProposals
                    .filter((p) => p.status === 'PENDING' && horseIds.has(p.horseId))
                    .map((prop) => (
                      <div
                        key={prop.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--color-warning)] bg-[var(--color-warning-soft)]/20 p-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-[var(--color-text-primary)]">
                              {prop.horseName}
                            </span>
                            <span className="text-[12px] text-[var(--color-text-secondary)]">
                              for {prop.raceName}
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--color-text-muted)]">
                            Nominated by {prop.proposedBy} · Entry budget: £{prop.requestedBudget.toLocaleString()}
                          </p>
                        </div>
                        <Button variant="primary" size="sm" onClick={() => navigate('racing')}>
                          Review & Authorise
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </Panel>
          )}

          {/* Head Trainer & Staff: Today's training schedule */}
          {canViewTrainingModule && <Panel padded>
            <div className="mb-3 flex items-center justify-between">
              <SectionTitle>Today's training schedule</SectionTitle>
              <button onClick={() => navigate('training')} className="text-[12px] font-medium text-[var(--color-primary)] hover:underline">View all</button>
            </div>
            <div className="space-y-1.5">
              {visibleSessions.slice(0, 5).map((s) => {
                const locked = isLocked(s.horseId);
                return (
                  <button
                    key={s.id}
                    onClick={() => navigate('horses', { horseId: s.horseId })}
                    className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2 text-left outline-none transition-colors hover:border-[var(--color-border-strong)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <span className="font-metric w-11 shrink-0 text-[12px] text-[var(--color-text-secondary)]">{s.time}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-[var(--color-text-primary)]">{s.horseName}</div>
                      <div className="truncate text-[11px] text-[var(--color-text-muted)]">{s.session} · {s.trainer}</div>
                    </div>
                    {locked ? (
                      <Pill tone="danger" icon="lock" size="sm">Restricted</Pill>
                    ) : (
                      <span className="font-metric text-[11px] text-[var(--color-text-muted)]">{s.distance}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Panel>}

          {/* Veterinarian: Today's Clinical Treatment & Medication Schedule */}
          {currentUser.role === 'VETERINARIAN' && (
            <>
              <Panel padded>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="pill" size={14} className="text-[var(--color-primary)]" />
                    <SectionTitle>Today's treatment schedule</SectionTitle>
                  </div>
                  <button
                    onClick={() => navigate('veterinary', { view: 'schedule' })}
                    className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
                  >
                    View all ({treatmentTasks.length})
                  </button>
                </div>
                {treatmentTasks.length === 0 ? (
                  <p className="py-4 text-center text-[13px] text-[var(--color-text-muted)]">
                    No clinical treatments or medications scheduled today.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {treatmentTasks.slice(0, 5).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => navigate('veterinary', { view: 'schedule' })}
                        className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2 text-left outline-none transition-colors hover:border-[var(--color-border-strong)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                      >
                        <span className="font-metric w-11 shrink-0 text-[12px] text-[var(--color-text-secondary)]">{t.time}</span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-medium text-[var(--color-text-primary)]">{t.horseName}</div>
                          <div className="truncate text-[11px] text-[var(--color-text-muted)]">{t.task} · {t.by}</div>
                        </div>
                        <Pill tone={t.done ? 'success' : 'neutral'} size="sm">
                          {t.done ? 'Done' : 'Pending'}
                        </Pill>
                      </button>
                    ))}
                  </div>
                )}
              </Panel>

              {/* Candidate Admissions Awaiting Physical Examination */}
              <Panel padded>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="clipboard" size={14} className="text-[var(--color-warning)]" />
                    <SectionTitle>Candidate physical exam queue</SectionTitle>
                  </div>
                  <span className="rounded-full bg-[var(--color-warning-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-warning)]">
                    {vetCandidates.length} pending
                  </span>
                </div>
                {vetCandidates.length === 0 ? (
                  <p className="py-4 text-center text-[13px] text-[var(--color-text-muted)]">
                    All candidate admission physical screenings cleared.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {vetCandidates.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-border)] p-2.5"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <HorseAvatar name={c.name} image={c.image} size={32} />
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-medium text-[var(--color-text-primary)]">{c.name}</div>
                            <div className="truncate text-[11px] text-[var(--color-text-muted)]">
                              {c.ageYears}yo {c.sex} · Owner: {c.owner}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('management')}
                          className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs transition-colors hover:bg-[var(--color-primary-hover)]"
                        >
                          <span>Start exam</span>
                          <Icon name="chevron-right" size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              {/* Active Clinical Training Restrictions */}
              {restricted.length > 0 && (
                <Panel padded>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="lock" size={14} className="text-[var(--color-danger)]" />
                      <SectionTitle>Active training locks enforced</SectionTitle>
                    </div>
                    <span className="rounded-full bg-[var(--color-danger-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-danger)]">
                      {restricted.length} locked
                    </span>
                  </div>
                  <div className="space-y-2">
                    {restricted.map((h) => {
                      const lock = getLock(h.id);
                      return (
                        <div
                          key={h.id}
                          className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-danger)]/25 bg-[var(--color-danger-soft)]/30 p-2.5"
                        >
                          <div className="min-w-0 flex-1 pr-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-bold text-[var(--color-text-primary)]">{h.name}</span>
                              <Pill tone="danger" size="sm" icon="lock">Restricted</Pill>
                            </div>
                            <p className="mt-0.5 text-[11px] text-[var(--color-danger)] truncate">
                              {lock?.reason || h.healthNote || 'Clinical restriction active'}
                            </p>
                            <p className="text-[10px] text-[var(--color-text-muted)]">
                              Next review: {lock?.reviewDate || 'Immediate'} · Attending: {lock?.veterinarian || 'Dr. Haines'}
                            </p>
                          </div>
                          <button
                            onClick={() => navigate('veterinary')}
                            className="shrink-0 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]"
                          >
                            Review lock
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              )}
            </>
          )}
        </div>

        {/* Right: attention + issues */}
        <div className="space-y-4">
          <Panel padded>
            <div className="mb-3 flex items-center justify-between">
              <SectionTitle>Requires attention</SectionTitle>
              <span className="text-[11px] text-[var(--color-text-muted)]">{attention.length}</span>
            </div>
            {attention.length === 0 ? (
              <p className="py-4 text-center text-[13px] text-[var(--color-text-muted)]">All horses cleared.</p>
            ) : (
              <div className="space-y-1.5">
                {attention.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => navigate('horses', { horseId: h.id })}
                    className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-1.5 text-left outline-none transition-colors hover:bg-[var(--color-surface-subtle)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <HorseAvatar name={h.name} image={h.image} size={30} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-[var(--color-text-primary)]">{h.name}</div>
                      <div className="truncate text-[11px] text-[var(--color-text-muted)]">{canViewPrivateMedical ? h.healthNote : simplifiedHealth(h.health)}</div>
                    </div>
                    {isLocked(h.id) && <Icon name="lock" size={12} className="text-[var(--color-danger)]" />}
                    <HealthBadge status={h.health} size="sm" />
                  </button>
                ))}
              </div>
            )}
          </Panel>

          {canViewPrivateMedical && <Panel padded>
            <div className="mb-3 flex items-center justify-between">
              <SectionTitle>Open observations</SectionTitle>
              <button onClick={() => navigate('veterinary')} className="text-[12px] font-medium text-[var(--color-primary)] hover:underline">Vet review</button>
            </div>
            {openIssues.length === 0 ? (
              <p className="py-4 text-center text-[13px] text-[var(--color-text-muted)]">No open reports.</p>
            ) : (
              <div className="space-y-2">
                {openIssues.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => navigate('veterinary')}
                    className="block w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2 text-left outline-none transition-colors hover:border-[var(--color-border-strong)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-[var(--color-text-primary)]">{i.horseName}</span>
                      <Pill tone={i.severity === 'High' ? 'danger' : i.severity === 'Moderate' ? 'warning' : 'neutral'} size="sm">{i.severity}</Pill>
                      <span className="ml-auto text-[10px] text-[var(--color-text-muted)]">{i.time}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] text-[var(--color-text-muted)]">{i.category} · {i.observation}</p>
                  </button>
                ))}
              </div>
            )}
          </Panel>}
        </div>
      </div>
    </Screen>
  );
}

function simplifiedHealth(status: string) {
  if (status === 'FIT') return 'Cleared for normal operations';
  if (status === 'MONITOR') return 'Health monitoring active';
  if (status === 'INJURED') return 'Veterinary follow-up required';
  return 'Isolation protocol active';
}
