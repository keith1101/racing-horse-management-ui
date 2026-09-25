import { useMemo } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { DataTable, type Column } from '../../components/DataTable';
import { Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { HorseAvatar } from '../horses/HorseAvatar';
import { EmptyState } from '../../components/states';
import { useRtms } from '../../app/RtmsContext';
import { RACE_HISTORY, type RaceResult } from './racingData';
import { RaceRegistrationScreen } from './RaceRegistrationScreen';
import { RaceEventDetailScreen } from './RaceEventDetailScreen';
import { RaceHistoryScreen } from './RaceHistoryScreen';
import { ordinal, RaceMeta } from './racingUtils';

export function RacingScreen() {
  const { route } = useRtms();

  if (route.view === 'register') return <RaceRegistrationScreen />;
  if (route.view === 'event') return <RaceEventDetailScreen />;
  if (route.view === 'history') return <RaceHistoryScreen />;
  return <RaceOverview />;
}

function RaceOverview() {
  const {
    navigate,
    can,
    currentUser,
    raceEvents,
    raceProposals,
    approveRaceEntry,
    declineRaceEntry,
    horses,
  } = useRtms();

  const isOwner = currentUser.role === 'HORSE_OWNER';
  const canSubmitRace = can('race.propose') || (can('race.approve') && !isOwner);

  const ownerHorseIds = useMemo(() => new Set(horses.map((h) => h.id)), [horses]);

  // Scoped race history
  const historyList = useMemo(
    () => (isOwner ? RACE_HISTORY.filter((r) => ownerHorseIds.has(r.horseId)) : RACE_HISTORY),
    [isOwner, ownerHorseIds],
  );

  const wins = historyList.filter((r) => r.finish === 1).length;
  const podiums = historyList.filter((r) => r.finish <= 3).length;

  // Scoped proposals
  const relevantProposals = useMemo(
    () => (isOwner ? raceProposals.filter((p) => ownerHorseIds.has(p.horseId)) : raceProposals),
    [isOwner, raceProposals, ownerHorseIds],
  );
  const pendingProposals = useMemo(
    () => relevantProposals.filter((p) => p.status === 'PENDING'),
    [relevantProposals],
  );

  // Confirmed entries for owner's horses
  const ownerConfirmedEntries = useMemo(() => {
    return raceEvents.reduce((acc, race) => {
      return acc + race.entries.filter((e) => ownerHorseIds.has(e.horseId)).length;
    }, 0);
  }, [raceEvents, ownerHorseIds]);

  const historyColumns: Column<RaceResult>[] = [
    {
      key: 'date',
      header: 'Date',
      width: '92px',
      render: (r) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{r.date}</span>,
      sortValue: (r) => r.date,
    },
    {
      key: 'horse',
      header: 'Horse',
      render: (r) => (
        <button
          onClick={() => navigate('horses', { horseId: r.horseId })}
          className="text-[13px] font-medium hover:underline text-left"
        >
          {r.horseName}
        </button>
      ),
      sortValue: (r) => r.horseName,
    },
    { key: 'race', header: 'Race', render: (r) => <span className="text-[13px] font-semibold">{r.race}</span> },
    {
      key: 'course',
      header: 'Course / dist.',
      render: (r) => (
        <span className="text-[12px] text-[var(--color-text-secondary)]">
          {r.course} · {r.distance}
        </span>
      ),
    },
    {
      key: 'finish',
      header: 'Finish',
      render: (r) => (
        <span
          className={
            'font-metric inline-flex items-center gap-1 text-[13px] font-semibold ' +
            (r.finish === 1
              ? 'text-[var(--color-success)]'
              : r.finish <= 3
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)]')
          }
        >
          {r.finish === 1 && <Icon name="flag" size={12} />}
          {ordinal(r.finish)} / {r.field}
        </span>
      ),
      sortValue: (r) => r.finish,
    },
    { key: 'time', header: 'Time', align: 'right', render: (r) => <span className="font-metric text-[12px]">{r.time}</span> },
    { key: 'margin', header: 'Margin', align: 'right', render: (r) => <span className="text-[12px] text-[var(--color-text-secondary)]">{r.margin}</span> },
    { key: 'jockey', header: 'Jockey', align: 'right', render: (r) => <span className="text-[12px] text-[var(--color-text-secondary)]">{r.jockey}</span> },
  ];

  return (
    <Screen
      title={isOwner ? 'Race Nominations & Approvals' : 'Racing'}
      context={
        isOwner
          ? `Owner portal for ${currentUser.owner || currentUser.name} · Review trainer nominations and authorise race budgets`
          : 'Race events, runner declarations and past performance records'
      }
      secondary={
        !isOwner && (
          <Button variant="secondary" icon="list" onClick={() => navigate('racing', { view: 'history' })}>
            Race history
          </Button>
        )
      }
      primary={
        canSubmitRace ? (
          <Button variant="primary" icon="plus" onClick={() => navigate('racing', { view: 'register' })}>
            {currentUser.role === 'CLUB_MANAGER' ? 'Review entries & budget' : 'Propose entry'}
          </Button>
        ) : undefined
      }
    >
      {/* Manager Pending Proposals Alert Banner (Staff view only) */}
      {!isOwner && currentUser.role === 'CLUB_MANAGER' && pendingProposals.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-warning)] bg-[var(--color-warning-soft)] p-3 text-[var(--color-warning)]">
          <div className="flex items-center gap-2 text-[13px] font-semibold">
            <Icon name="alert-triangle" size={16} />
            <span>
              {pendingProposals.length} runner proposal(s) submitted by Head Trainer awaiting budget authorization
            </span>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('racing', { view: 'register' })}>
            Review & Authorise
          </Button>
        </div>
      )}

      {/* Metric summary */}
      {isOwner ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            label="Awaiting your approval"
            value={pendingProposals.length}
            unit="nominations"
            icon="clock"
            tone={pendingProposals.length ? 'warning' : 'default'}
          />
          <MetricCard
            label="Confirmed entries"
            value={ownerConfirmedEntries}
            unit="runners"
            icon="flag"
            tone="info"
          />
          <MetricCard
            label="Podium finishes"
            value={podiums}
            unit={`/ ${historyList.length} starts`}
            icon="trending-up"
            tone="info"
          />
          <MetricCard
            label="Season wins"
            value={wins}
            unit={`/ ${historyList.length} starts`}
            icon="flag"
            tone="success"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard label="Upcoming races" value={raceEvents.length} unit="events" icon="calendar" tone="info" />
          <MetricCard
            label="Entries declared"
            value={raceEvents.reduce((s, r) => s + r.entries.length, 0)}
            unit="runners"
            icon="flag"
          />
          <MetricCard
            label="Pending proposals"
            value={pendingProposals.length}
            unit="awaiting review"
            icon="clock"
            tone={pendingProposals.length ? 'warning' : 'default'}
          />
          <MetricCard
            label="Season wins"
            value={wins}
            unit={`/ ${RACE_HISTORY.length}`}
            icon="trending-up"
            tone="success"
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* HORSE OWNER VIEW: ONLY RACE APPROVAL & RESULTS (NO UPCOMING RACES) */}
      {/* ========================================================= */}
      {isOwner ? (
        <div className="mt-4 space-y-4">
          {/* 1. Nominations Awaiting Owner Approval Panel */}
          <Panel padded className="border-2 border-[var(--color-warning)] bg-[var(--color-warning-soft)]/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-warning)] text-white shadow-xs">
                  <Icon name="clock" size={16} />
                </span>
                <div>
                  <SectionTitle>Nominations Awaiting Your Approval</SectionTitle>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Trainer proposals for your horses requiring entry authorization and budget approval
                  </p>
                </div>
              </div>
              <Pill tone={pendingProposals.length ? 'warning' : 'neutral'} size="sm">
                {pendingProposals.length} awaiting approval
              </Pill>
            </div>

            {pendingProposals.length === 0 ? (
              <div className="mt-3 rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] p-6 text-center">
                <div className="flex justify-center text-[var(--color-success)]">
                  <Icon name="check" size={24} />
                </div>
                <p className="mt-2 text-[13px] font-semibold text-[var(--color-text-primary)]">
                  All race nominations reviewed
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                  There are currently no pending race nominations requiring your budget authorization.
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {pendingProposals.map((prop) => {
                  const race = raceEvents.find((r) => r.id === prop.raceId);
                  const horse = horses.find((h) => h.id === prop.horseId);
                  return (
                    <div
                      key={prop.id}
                      className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition-shadow hover:shadow"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-border)] pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-bold text-[var(--color-text-primary)]">
                              {prop.raceName}
                            </span>
                            {race && (
                              <Pill tone="primary" size="sm">
                                {race.grade}
                              </Pill>
                            )}
                          </div>
                          {race && (
                            <div className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">
                              {race.course} · {race.distance} · {race.surface} · Date:{' '}
                              <strong className="text-[var(--color-text-primary)]">
                                {race.date} ({race.time})
                              </strong>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                            Requested Entry Budget
                          </div>
                          <div className="font-metric text-[18px] font-bold text-[var(--color-primary)]">
                            £{prop.requestedBudget.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                          {horse && <HorseAvatar name={horse.name} image={horse.image} size={42} />}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-bold text-[var(--color-text-primary)]">
                                {prop.horseName}
                              </span>
                              {horse && (
                                <Pill tone={horse.health === 'FIT' ? 'success' : 'warning'} size="sm">
                                  {horse.health}
                                </Pill>
                              )}
                            </div>
                            <div className="text-[11px] text-[var(--color-text-muted)]">
                              Nominated by <strong>{prop.proposedBy}</strong> on {prop.proposedDate}
                            </div>
                          </div>
                        </div>

                        {prop.notes && (
                          <div className="rounded-[var(--radius-sm)] border border-[var(--color-border-strong)]/40 bg-[var(--color-surface-subtle)] p-2.5 text-[12px] text-[var(--color-text-secondary)]">
                            <span className="font-semibold text-[var(--color-text-primary)]">
                              Trainer recommendation:{' '}
                            </span>
                            "{prop.notes}"
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
                        <div className="text-[12px] text-[var(--color-text-muted)]">
                          {race && (
                            <span>
                              Total Race Purse:{' '}
                              <strong className="text-[var(--color-text-primary)]">{race.purse}</strong>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            icon="x"
                            onClick={() => declineRaceEntry(prop.id, 'Declined by Owner')}
                          >
                            Decline
                          </Button>
                          <Button
                            variant="primary"
                            icon="check"
                            onClick={() =>
                              approveRaceEntry(prop.id, prop.requestedBudget, 'Approved by Owner')
                            }
                            className="bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]/90"
                          >
                            Approve & Authorise (£{prop.requestedBudget.toLocaleString()})
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>

          {/* 2. Recent Decisions (if any) */}
          {relevantProposals.filter((p) => p.status !== 'PENDING').length > 0 && (
            <Panel padded>
              <SectionTitle>Recent Decisions</SectionTitle>
              <div className="mt-2.5 space-y-2">
                {relevantProposals
                  .filter((p) => p.status !== 'PENDING')
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-2.5 text-[12px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--color-text-primary)]">{p.horseName}</span>
                        <span className="text-[var(--color-text-secondary)]">in {p.raceName}</span>
                        <Pill tone={p.status === 'APPROVED' ? 'success' : 'neutral'} size="sm">
                          {p.status}
                        </Pill>
                      </div>
                      <div className="text-[11px] text-[var(--color-text-muted)]">
                        {p.status === 'APPROVED'
                          ? `Authorised Budget: £${(p.approvedBudget ?? p.requestedBudget).toLocaleString()}`
                          : p.managerNotes || 'Declined'}
                      </div>
                    </div>
                  ))}
              </div>
            </Panel>
          )}

          {/* 3. Race Results & Winnings for Owner's Horses */}
          <Panel padded>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <SectionTitle>Race Results & Winnings ({historyList.length})</SectionTitle>
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  Official finishing records and prize money for horses registered to{' '}
                  {currentUser.owner || currentUser.name}
                </p>
              </div>
              <span className="text-[11px] font-medium text-[var(--color-text-muted)]">
                {wins} wins · {podiums} top 3
              </span>
            </div>
            {historyList.length === 0 ? (
              <EmptyState
                icon="flag"
                title="No race records"
                description="No past race results on file for your horses."
              />
            ) : (
              <DataTable columns={historyColumns} rows={historyList} rowKey={(r) => r.id} />
            )}
          </Panel>
        </div>
      ) : (
        /* ========================================================= */
        /* STAFF VIEW (TRAINER & CLUB MANAGER): UPCOMING RACES & REG */
        /* ========================================================= */
        <>
          {/* Upcoming races */}
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
            {raceEvents.map((race) => {
              const raceProps = raceProposals.filter(
                (p) => p.raceId === race.id && p.status === 'PENDING',
              );
              return (
                <Panel key={race.id} padded>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <button
                        onClick={() => navigate('racing', { view: 'event', refId: race.id })}
                        className="text-left text-[14px] font-semibold text-[var(--color-text-primary)] hover:underline"
                      >
                        {race.name}
                      </button>
                      <div className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">
                        {race.course}
                      </div>
                    </div>
                    <Pill
                      tone={
                        race.status === 'Declared'
                          ? 'primary'
                          : race.status === 'Confirmed'
                            ? 'success'
                            : 'neutral'
                      }
                      size="sm"
                    >
                      {race.status}
                    </Pill>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-y-2 text-[12px]">
                    <RaceMeta label="Date" value={`${race.date} · ${race.time}`} />
                    <RaceMeta label="Distance" value={`${race.distance} · ${race.surface}`} />
                    <RaceMeta label="Grade" value={race.grade} />
                    <RaceMeta label="Purse" value={race.purse} />
                  </div>

                  {/* Proposals tag if any */}
                  {raceProps.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 rounded-[var(--radius-xs)] bg-[var(--color-warning-soft)] p-1.5 text-[11px] text-[var(--color-warning)]">
                      <Icon name="clock" size={12} />
                      <span>{raceProps.length} proposal(s) awaiting budget approval</span>
                    </div>
                  )}

                  <div className="mt-3 border-t border-[var(--color-border)] pt-2.5">
                    <FieldLabel>Confirmed Runners ({race.entries.length})</FieldLabel>
                    <div className="mt-1.5 space-y-1">
                      {race.entries.map((e) => (
                        <div key={e.horseId} className="flex items-center justify-between text-[12px]">
                          <button
                            onClick={() => navigate('horses', { horseId: e.horseId })}
                            className="truncate text-[var(--color-text-primary)] hover:underline"
                          >
                            {e.horseName}
                          </button>
                          <span className="font-metric text-[11px] text-[var(--color-text-muted)]">
                            Draw {e.draw}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 border-t border-[var(--color-border)] pt-2.5 text-right">
                    <button
                      onClick={() => navigate('racing', { view: 'register', refId: race.id })}
                      className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
                    >
                      {currentUser.role === 'CLUB_MANAGER'
                        ? 'Manage entries & budget →'
                        : 'Propose runner →'}
                    </button>
                  </div>
                </Panel>
              );
            })}
          </div>

          {/* Race history */}
          <Panel padded className="mt-4">
            <div className="mb-3 flex items-center justify-between">
              <SectionTitle>Race history</SectionTitle>
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Last {RACE_HISTORY.length} runs
              </span>
            </div>
            <DataTable columns={historyColumns} rows={RACE_HISTORY} rowKey={(r) => r.id} />
          </Panel>
        </>
      )}
    </Screen>
  );
}
