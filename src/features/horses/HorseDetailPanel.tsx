import { useState } from 'react';
import { Button } from '../../components/Button';
import { EmptyState, DetailSkeleton } from '../../components/states';
import { HorseHeader } from './HorseHeader';
import { HorseTabs, HORSE_TABS, type HorseTab } from './HorseTabs';
import { HorseOverview } from './HorseOverview';
import { HorsePedigree } from './HorsePedigree';
import { HorseHealthTab, HorseTrainingTab, HorseRaceHistoryTab, HorseDocumentsTab } from './HorseProfileTabs';
import type { Horse } from './horseData';
import { useRtms } from '../../app/RtmsContext';

interface HorseDetailPanelProps {
  horse?: Horse;
  loading?: boolean;
  onBack?: () => void;
}

export function HorseDetailPanel({ horse, loading, onBack }: HorseDetailPanelProps) {
  const { navigate, can } = useRtms();
  const [tab, setTab] = useState<HorseTab>('Overview');

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <DetailSkeleton />
      </div>
    );
  }

  if (!horse) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon="list"
          title="Select a horse"
        />
      </div>
    );
  }

  const visibleTabs = HORSE_TABS.filter((item) => {
    if (item === 'Health') return can('medical.summary.view');
    if (item === 'Training') return can('training.view');
    if (item === 'Race History') return can('race.view');
    if (item === 'Documents') return can('horse.documents.view');
    return true;
  });
  const activeTab = visibleTabs.includes(tab) ? tab : visibleTabs[0] ?? 'Overview';

  return (
    <div className="flex h-full min-h-0 flex-col">
      {onBack && (
        <div className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 lg:hidden">
          <Button variant="tertiary" size="sm" icon="chevron-right" onClick={onBack} className="[&_svg]:rotate-180">
            Back to list
          </Button>
        </div>
      )}
      <HorseHeader
        horse={horse}
        onTrainingPlan={can('training.manage') ? () => navigate('training', { view: 'plan', horseId: horse.id }) : undefined}
        onViewRestriction={can('module.veterinary.view') ? () => navigate('veterinary', { view: 'restrictions', horseId: horse.id }) : undefined}
      />
      <HorseTabs active={activeTab} tabs={visibleTabs} onChange={setTab} />
      <div className="scroll-slim min-h-0 flex-1 overflow-y-auto p-4">
        {activeTab === 'Overview' ? (
          <HorseOverview horse={horse} />
        ) : activeTab === 'Pedigree' ? (
          <HorsePedigree horse={horse} />
        ) : activeTab === 'Health' ? (
          <HorseHealthTab horse={horse} />
        ) : activeTab === 'Training' ? (
          <HorseTrainingTab horse={horse} />
        ) : activeTab === 'Race History' ? (
          <HorseRaceHistoryTab horse={horse} />
        ) : activeTab === 'Documents' ? (
          <HorseDocumentsTab horse={horse} />
        ) : null}
      </div>
    </div>
  );
}
