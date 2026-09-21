import type { ReactNode } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Panel, SectionTitle } from '../../components/Panel';
import { DataTable, type Column } from '../../components/DataTable';
import { Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/states';
import { HorseAvatar } from '../horses/HorseAvatar';
import { useRtms } from '../../app/RtmsContext';
import { UPCOMING_RACES, RACE_HISTORY, type RaceEntry, type RaceResult } from './racingData';
import { ordinal, RaceMeta } from './racingUtils';

export function RaceEventDetailScreen() {
  const { route, navigate, horses, isLocked } = useRtms();
  const event = UPCOMING_RACES.find((r) => r.id === route.refId);

  if (!event) {
    return (
      <Screen title="Race event" secondary={<BackButton onClick={() => navigate('racing')} />}>
        <Panel padded>
          <EmptyState icon="flag" title="Race event not found" description="This event may have been removed or is no longer available." />
        </Panel>
      </Screen>
    );
  }

  const entryColumns: Column<RaceEntry>[] = [
    {
      key: 'horse',
      header: 'Horse',
      render: (e) => {
        const horse = horses.find((h) => h.id === e.horseId);
        const locked = isLocked(e.horseId);
        return (
          <div className="flex items-center gap-2">
            {horse && <HorseAvatar name={horse.name} image={horse.image} size={26} />}
            <button onClick={() => navigate('horses', { horseId: e.horseId })} className="text-[13px] font-medium hover:underline">
              {e.horseName}
            </button>
            {locked && <Icon name="lock" size={12} className="text-[var(--color-danger)]" />}
          </div>
        );
      },
      sortValue: (e) => e.horseName,
    },
    { key: 'jockey', header: 'Jockey', render: (e) => <span className="text-[13px]">{e.jockey}</span> },
    { key: 'draw', header: 'Draw', align: 'right', render: (e) => <span className="font-metric text-[13px]">{e.draw}</span>, sortValue: (e) => e.draw },
    { key: 'weight', header: 'Weight', align: 'right', render: (e) => <span className="font-metric text-[13px]">{e.weightKg} kg</span>, sortValue: (e) => e.weightKg },
    {
      key: 'status',
      header: 'Participation',
      align: 'right',
      render: (e) =>
        isLocked(e.horseId) ? (
          <Pill tone="danger" icon="lock" size="sm">Restricted</Pill>
        ) : (
          <Pill tone="success" icon="check" size="sm">Confirmed</Pill>
        ),
    },
  ];

  const courseHistory = RACE_HISTORY.filter((r) => r.course === event.course);

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
  ];

  return (
    <Screen
      title={event.name}
      secondary={<BackButton onClick={() => navigate('racing')} />}
      primary={
        <Button variant="primary" icon="flag" onClick={() => navigate('racing', { view: 'register', refId: event.id })}>
          Register runners
        </Button>
      }
    >
      {/* Event information */}
      <Panel padded>
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Event information</SectionTitle>
          <Pill tone={event.status === 'Declared' ? 'primary' : event.status === 'Confirmed' ? 'success' : 'neutral'} size="sm">
            {event.status}
          </Pill>
        </div>
        <div className="grid grid-cols-2 gap-y-2 md:grid-cols-3">
          <RaceMeta label="Course" value={event.course} />
          <RaceMeta label="Date & time" value={`${event.date} · ${event.time}`} />
          <RaceMeta label="Distance" value={event.distance} />
          <RaceMeta label="Surface" value={event.surface} />
          <RaceMeta label="Grade" value={event.grade} />
          <RaceMeta label="Purse" value={event.purse} />
        </div>
      </Panel>

      {/* Registered horses */}
      <Panel padded className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Registered horses</SectionTitle>
          <span className="text-[11px] text-[var(--color-text-muted)]">{event.entries.length} runners</span>
        </div>
        <DataTable
          columns={entryColumns}
          rows={event.entries}
          rowKey={(e) => e.horseId}
          empty={<EmptyState icon="users" title="No runners declared" description="Register horses to see them here." />}
        />
      </Panel>

      {/* Results */}
      <Panel padded className="mt-4">
        <SectionTitle>Results</SectionTitle>
        <div className="mt-3">
          <EmptyState
            icon="clock"
            title="Results available after the event"
            description={`This race is scheduled for ${event.date} at ${event.time}. Finishing positions will appear here once the event has run.`}
          />
        </div>
      </Panel>

      {/* Recent results at this course */}
      <Panel padded className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Recent results at {event.course}</SectionTitle>
          <span className="text-[11px] text-[var(--color-text-muted)]">{courseHistory.length} runs</span>
        </div>
        <DataTable
          columns={historyColumns}
          rows={courseHistory}
          rowKey={(r) => r.id}
          empty={<EmptyState icon="file-text" title="No recent results" description={`No historical results recorded at ${event.course}.`} />}
        />
      </Panel>
    </Screen>
  );
}

function BackButton({ onClick }: { onClick: () => void }): ReactNode {
  return (
    <Button variant="tertiary" icon="arrow-left" onClick={onClick}>
      Back
    </Button>
  );
}
