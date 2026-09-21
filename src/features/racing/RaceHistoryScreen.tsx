import { useMemo, useState } from 'react';
import { useRtms } from '../../app/RtmsContext';
import { RACE_HISTORY, type RaceResult } from './racingData';
import { HorseAvatar } from '../horses/HorseAvatar';
import { Screen } from '../../components/Screen';
import { MetricCard } from '../../components/MetricCard';
import { Panel } from '../../components/Panel';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchInput } from '../../components/SearchInput';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/states';

function ordinal(n: number) {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const value = n % 100;
  return n + (suffix[(value - 20) % 10] ?? suffix[value] ?? suffix[0]);
}

export function RaceHistoryScreen() {
  const { navigate, getHorse } = useRtms();
  const [search, setSearch] = useState('');
  const [selectedHorse, setSelectedHorse] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const uniqueHorses = useMemo(() => Array.from(new Set(RACE_HISTORY.map((race) => race.horseName))).sort(), []);
  const uniqueCourses = useMemo(() => Array.from(new Set(RACE_HISTORY.map((race) => race.course))).sort(), []);

  const filteredHistory = useMemo(
    () =>
      RACE_HISTORY.filter((race) => {
        if (selectedHorse && race.horseName !== selectedHorse) return false;
        if (selectedCourse && race.course !== selectedCourse) return false;
        if (search) {
          const query = search.toLowerCase();
          if (!`${race.race} ${race.horseName} ${race.jockey}`.toLowerCase().includes(query)) return false;
        }
        return true;
      }),
    [search, selectedCourse, selectedHorse],
  );

  const totalRaces = RACE_HISTORY.length;
  const uniqueHorsesCount = new Set(RACE_HISTORY.map((race) => race.horseId)).size;
  const totalWins = RACE_HISTORY.filter((race) => race.finish === 1).length;
  const winRate = totalRaces > 0 ? ((totalWins / totalRaces) * 100).toFixed(1) : '0.0';

  const columns: Column<RaceResult>[] = [
    {
      key: 'date',
      header: 'Date',
      width: '110px',
      sortValue: (row) => row.date,
      render: (row) => <span className="font-metric text-[13px]">{row.date}</span>,
    },
    {
      key: 'horse',
      header: 'Horse',
      sortValue: (row) => row.horseName,
      render: (row) => {
        const horse = getHorse(row.horseId);
        return (
          <button
            className="flex items-center gap-2 text-left hover:underline"
            onClick={() => navigate('horses', { horseId: row.horseId })}
          >
            <HorseAvatar name={row.horseName} image={horse?.image} size={28} />
            <span className="font-medium text-[var(--color-text-primary)]">{row.horseName}</span>
          </button>
        );
      },
    },
    { key: 'race', header: 'Race', sortValue: (row) => row.race, render: (row) => <span>{row.race}</span> },
    {
      key: 'course',
      header: 'Track / dist.',
      sortValue: (row) => row.course,
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.course}</span>
          <span className="text-[12px] text-[var(--color-text-secondary)]">{row.distance}</span>
        </div>
      ),
    },
    {
      key: 'finish',
      header: 'Position',
      sortValue: (row) => row.finish,
      render: (row) => {
        const isFirst = row.finish === 1;
        const isTopThree = row.finish <= 3;
        return (
          <div className={`flex items-center gap-1.5 font-metric ${isFirst ? 'font-semibold text-[var(--color-success)]' : isTopThree ? 'font-medium text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>
            {isFirst && <Icon name="flag" size={14} />}
            {ordinal(row.finish)} / {row.field}
          </div>
        );
      },
    },
    {
      key: 'time',
      header: 'Time',
      render: (row) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{row.time}</span>,
    },
    {
      key: 'margin',
      header: 'Margin',
      render: (row) => <span className="text-[12px] text-[var(--color-text-secondary)]">{row.margin || '-'}</span>,
    },
    {
      key: 'jockey',
      header: 'Jockey',
      sortValue: (row) => row.jockey,
      render: (row) => <span className="text-[13px]">{row.jockey}</span>,
    },
  ];

  return (
    <Screen
      title="Race history"
      context={
        <button onClick={() => navigate('racing')} className="inline-flex items-center gap-1 text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline">
          <Icon name="arrow-left" size={13} /> Back to Racing
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Total Races" value={totalRaces} icon="flag" tone="neutral" />
        <MetricCard label="Unique Horses" value={uniqueHorsesCount} icon="horse" tone="neutral" />
        <MetricCard label="Total Wins" value={totalWins} icon="star" tone="success" />
        <MetricCard label="Win Rate" value={winRate} unit="%" icon="trending-up" tone={Number(winRate) > 15 ? 'success' : 'neutral'} />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
        <div className="w-64">
          <SearchInput value={search} onChange={setSearch} label="Search race history" placeholder="Search race, horse, jockey..." />
        </div>
        <Select label="Filter by horse" value={selectedHorse} onChange={setSelectedHorse} placeholder="All horses" options={uniqueHorses.map((horse) => ({ value: horse, label: horse }))} />
        <Select label="Filter by course" value={selectedCourse} onChange={setSelectedCourse} placeholder="All courses" options={uniqueCourses.map((course) => ({ value: course, label: course }))} />
        {(search || selectedHorse || selectedCourse) && (
          <Button variant="tertiary" onClick={() => { setSearch(''); setSelectedHorse(''); setSelectedCourse(''); }}>Clear filters</Button>
        )}
        <div className="ml-auto text-[12px] text-[var(--color-text-secondary)]">{filteredHistory.length} result{filteredHistory.length !== 1 && 's'}</div>
      </div>

      <Panel>
        {filteredHistory.length > 0 ? (
          <DataTable columns={columns} rows={filteredHistory} rowKey={(row) => row.id} />
        ) : (
          <EmptyState icon="filter" title="No race history found" description="Adjust your filters to see past race results." />
        )}
      </Panel>
    </Screen>
  );
}
