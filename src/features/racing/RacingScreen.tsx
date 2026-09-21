import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { DataTable, type Column } from '../../components/DataTable';
import { Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { HorseAvatar } from '../horses/HorseAvatar';
import { useRtms } from '../../app/RtmsContext';
import { UPCOMING_RACES, RACE_HISTORY, type RaceResult } from './racingData';
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
  const { navigate, can, currentUser, raceEvents, raceProposals } = useRtms();
  const canSubmitRace = can('race.propose') || can('race.approve');

  const wins = RACE_HISTORY.filter((r) => r.finish === 1).length;
  const podiums = RACE_HISTORY.filter((r) => r.finish <= 3).length;
  const pendingProposals = raceProposals.filter((p) => p.status === 'PENDING');

  const historyColumns: Column<RaceResult>[] = [
    { key: 'date', header: 'Date', width: '92px', render: (r) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{r.date}</span>, sortValue: (r) => r.date },
    {
      key: 'horse',
      header: 'Horse',
      render: (r) => (
        <button onClick={() => navigate('horses', { horseId: r.horseId })} className="text-[13px] font-medium hover:underline">
          {r.horseName}
        </button>
      ),
      sortValue: (r) => r.horseName,
    },
    { key: 'race', header: 'Race', render: (r) => <span className="text-[13px]">{r.race}</span> },
    { key: 'course', header: 'Course / dist.', render: (r) => <span className="text-[12px] text-[var(--color-text-secondary)]">{r.course} · {r.distance}</span> },
    {
      key: 'finish',
      header: 'Finish',
      render: (r) => (
        <span className={'font-metric inline-flex items-center gap-1 text-[13px] font-semibold ' + (r.finish === 1 ? 'text-[var(--color-success)]' : r.finish <= 3 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]')}>
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
      title="Racing"
      secondary={
        <Button variant="secondary" icon="list" onClick={() => navigate('racing', { view: 'history' })}>
          Race history
        </Button>
      }
      primary={
        canSubmitRace ? (
          <Button variant="primary" icon="plus" onClick={() => navigate('racing', { view: 'register' })}>
            {currentUser.role === 'CLUB_MANAGER' ? 'Review entries & budget' : 'Propose entry'}
          </Button>
        ) : undefined
      }
    >
      {/* Manager Pending Proposals Alert Banner */}
      {currentUser.role === 'CLUB_MANAGER' && pendingProposals.length > 0 && (
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

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Upcoming races" value={raceEvents.length} unit="events" icon="calendar" tone="info" />
        <MetricCard label="Entries declared" value={raceEvents.reduce((s, r) => s + r.entries.length, 0)} unit="runners" icon="flag" />
        <MetricCard label="Pending proposals" value={pendingProposals.length} unit="awaiting review" icon="clock" tone={pendingProposals.length ? 'warning' : 'default'} />
        <MetricCard label="Season wins" value={wins} unit={`/ ${RACE_HISTORY.length}`} icon="trending-up" tone="success" />
      </div>

      {/* Upcoming races */}
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {raceEvents.map((race) => {
          const raceProps = raceProposals.filter((p) => p.raceId === race.id && p.status === 'PENDING');
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
                  <div className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">{race.course}</div>
                </div>
                <Pill tone={race.status === 'Declared' ? 'primary' : race.status === 'Confirmed' ? 'success' : 'neutral'} size="sm">
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
                      <span className="font-metric text-[11px] text-[var(--color-text-muted)]">Draw {e.draw}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 border-t border-[var(--color-border)] pt-2.5 text-right">
                <button
                  onClick={() => navigate('racing', { view: 'register', refId: race.id })}
                  className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
                >
                  {currentUser.role === 'CLUB_MANAGER' ? 'Manage entries & budget →' : 'Propose runner →'}
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
          <span className="text-[11px] text-[var(--color-text-muted)]">Last {RACE_HISTORY.length} runs</span>
        </div>
        <DataTable columns={historyColumns} rows={RACE_HISTORY} rowKey={(r) => r.id} />
      </Panel>
    </Screen>
  );
}
