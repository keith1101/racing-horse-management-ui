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
  const { horses, issues, navigate, isLocked, can, currentUser, candidates, raceProposals } = useRtms();
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

  return (
    <Screen
      title={persona.title}
      context={persona.context}
      primary={can('horse.create') ? (
        <Button variant="primary" icon="plus" onClick={() => navigate('horses', { view: 'register' })}>
          Register horse
        </Button>
      ) : undefined}
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Horses in care" value={horses.length} unit="total" icon="list" onClick={() => navigate('horses')} />
        <MetricCard label="Fit" value={count((h) => h.health === 'FIT')} unit="horses" icon="check" tone="success" />
        <MetricCard label="Monitor" value={count((h) => h.health === 'MONITOR')} unit="horses" icon="activity" tone="warning" />
        <MetricCard label="Injured" value={count((h) => h.health === 'INJURED')} unit="horses" icon="alert-triangle" tone="danger" />
        <MetricCard label="Isolated" value={count((h) => h.health === 'ISOLATED')} unit="horses" icon="shield" tone="info" />
        <MetricCard label="Training restricted" value={restricted.length} unit="locked" icon="lock" tone={restricted.length ? 'danger' : 'default'} onClick={() => navigate(canViewVetModule ? 'veterinary' : 'horses')} />
      </div>

      {currentUser.role === 'CLUB_MANAGER' && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard label="Final admission review" value={candidates.filter((candidate) => candidate.evaluation === 'MANAGER_REVIEW').length} unit="applications" icon="users" tone="warning" onClick={() => navigate('management')} />
          <MetricCard label="Race approvals" value={raceProposals.filter((proposal) => proposal.status === 'PENDING').length} unit="proposals" icon="flag" tone="info" onClick={() => navigate('racing')} />
          <MetricCard label="Open observations" value={openIssues.length} unit="reported" icon="alert-triangle" tone={openIssues.length ? 'warning' : 'default'} />
          <MetricCard label="Active restrictions" value={restricted.length} unit="horses" icon="lock" tone={restricted.length ? 'danger' : 'default'} />
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        {/* Left: schedule + races */}
        <div className="space-y-4">
          {canViewTrainingModule && <Panel padded>
            <div className="mb-3 flex items-center justify-between">
              <SectionTitle>Today's training schedule</SectionTitle>
              {canViewTrainingModule && <button onClick={() => navigate('training')} className="text-[12px] font-medium text-[var(--color-primary)] hover:underline">View all</button>}
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
