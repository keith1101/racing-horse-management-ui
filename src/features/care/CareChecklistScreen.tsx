import { useState } from 'react';
import { useRtms } from '../../app/RtmsContext';
import { Screen } from '../../components/Screen';
import { Panel } from '../../components/Panel';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { EmptyState } from '../../components/states';
import { Icon } from '../../components/Icon';
import { ProgressBar } from '../../components/ProgressBar';
import { HealthBadge } from '../../components/StatusBadge';
import { Select } from '../../components/Select';
import { HorseAvatar } from '../horses/HorseAvatar';

interface ChecklistItem {
  id: string;
  name: string;
  icon: 'utensils' | 'droplet' | 'scissors' | 'building' | 'activity' | 'pill' | 'heart-pulse';
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'feed', name: 'Morning feed', icon: 'utensils' },
  { id: 'water', name: 'Water check', icon: 'droplet' },
  { id: 'grooming', name: 'Grooming', icon: 'scissors' },
  { id: 'stall', name: 'Stall cleaning', icon: 'building' },
  { id: 'exercise', name: 'Exercise preparation', icon: 'activity' },
  { id: 'medication', name: 'Medication administration', icon: 'pill' },
  { id: 'hoof', name: 'Hoof inspection', icon: 'activity' },
  { id: 'health', name: 'Health observation', icon: 'heart-pulse' },
];

export function CareChecklistScreen() {
  const { route, navigate, horses, getHorse, can } = useRtms();
  const canExecute = can('stable-care.execute') || can('stable-care.manage');
  const canReport = can('stable-care.report_incident');
  const [selectedHorseId, setSelectedHorseId] = useState<string>(route.horseId || horses[0]?.id || '');
  const horse = getHorse(selectedHorseId);

  const [checklistState, setChecklistState] = useState<
    Record<string, { done: boolean; note: string; time?: string }>
  >({});

  if (!horse) {
    return (
      <Screen
        title="Daily care checklist"
        context={
          <button
            onClick={() => navigate('stable-care')}
            className="inline-flex items-center gap-1 hover:underline text-[13px] text-[var(--color-text-secondary)]"
          >
            <Icon name="arrow-left" size={13} /> Back to Stable Care
          </button>
        }
      >
        <EmptyState
          icon="check"
          title="No horse selected"
          description="Please select a horse to view their daily care checklist."
        />
      </Screen>
    );
  }

  const handleToggle = (id: string) => {
    setChecklistState((prev) => {
      const isDone = !prev[id]?.done;
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      return {
        ...prev,
        [id]: {
          done: isDone,
          note: prev[id]?.note || '',
          time: isDone ? timeString : undefined,
        },
      };
    });
  };

  const handleNoteChange = (id: string, note: string) => {
    setChecklistState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        note,
      },
    }));
  };

  const totalItems = CHECKLIST_ITEMS.length;
  const completedItems = Object.values(checklistState).filter((item) => item.done).length;
  const remainingItems = totalItems - completedItems;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <Screen
      title="Daily care checklist"
      context={
        <button
          onClick={() => navigate('stable-care')}
          className="inline-flex items-center gap-1 hover:underline text-[13px] text-[var(--color-text-secondary)]"
        >
          <Icon name="arrow-left" size={13} /> Back to Task Board
        </button>
      }
      secondary={
        canReport ? (
          <Button variant="secondary" icon="alert-triangle" onClick={() => navigate('stable-care', { view: 'report', horseId: horse.id })}>
            Report Issue
          </Button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-4 pb-8">
        {/* Horse Header & Switcher */}
        <Panel className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <HorseAvatar name={horse.name} image={horse.image} size={48} rounded="md" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)]">{horse.name}</h2>
                <HealthBadge status={horse.health} />
              </div>
              <div className="text-[13px] text-[var(--color-text-secondary)] mt-1 flex items-center gap-2">
                <span>{horse.stable} · Stall {horse.stall}</span>
                <span className="text-[var(--color-border-strong)]">|</span>
                <span>{horse.breed} · {horse.ageYears} yrs</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select
              label="Select horse"
              value={selectedHorseId}
              onChange={setSelectedHorseId}
              options={horses.map((h) => ({ value: h.id, label: h.name }))}
            />
            <Button variant="secondary" icon="user" onClick={() => navigate('horses', { horseId: horse.id })}>
              View Profile
            </Button>
          </div>
        </Panel>

        {/* Progress Summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard label="Total Tasks" value={totalItems.toString()} />
          <MetricCard label="Completed" value={completedItems.toString()} tone="success" />
          <MetricCard label="Remaining" value={remainingItems.toString()} tone={remainingItems > 0 ? 'warning' : 'default'} />
          <Panel className="p-4 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Progress</span>
              <span className="font-metric text-[16px] font-semibold">{completionPercentage}%</span>
            </div>
            <ProgressBar value={completionPercentage} tone={completionPercentage === 100 ? 'success' : 'primary'} size="md" />
          </Panel>
        </div>

        {/* Checklist */}
        <Panel className="p-0 overflow-hidden">
          <div className="border-b border-[var(--color-border)] px-4 py-3 bg-[var(--color-surface-subtle)] flex items-center justify-between">
            <h3 className="text-[13px] font-semibold tracking-tight text-[var(--color-text-primary)]">Daily Checklist</h3>
            <span className="text-[12px] text-[var(--color-text-secondary)] font-metric">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {CHECKLIST_ITEMS.map((item) => {
              const state = checklistState[item.id];
              const isDone = state?.done || false;
              
              return (
                <div key={item.id} className={`p-4 transition-colors ${isDone ? 'bg-[var(--color-success)]/5' : 'hover:bg-[var(--color-surface-subtle)]'}`}>
                  <div className="flex items-start gap-3">
                    {canExecute ? (
                      <button
                        type="button"
                        aria-label={isDone ? `Mark ${item.name} incomplete` : `Complete ${item.name}`}
                        onClick={() => handleToggle(item.id)}
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border transition-colors ${
                          isDone
                            ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white'
                            : 'border-[var(--color-border-strong)] bg-white hover:border-[var(--color-primary)]'
                        }`}
                      >
                        {isDone && <Icon name="check" size={12} />}
                      </button>
                    ) : (
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border ${
                          isDone
                            ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white'
                            : 'border-[var(--color-border-strong)] bg-white'
                        }`}
                      >
                        {isDone && <Icon name="check" size={12} />}
                      </span>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-full ${isDone ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]'}`}>
                            <Icon name={item.icon} size={14} />
                          </div>
                          <span className={`text-[13px] font-medium ${isDone ? 'text-[var(--color-text-secondary)] line-through' : 'text-[var(--color-text-primary)]'}`}>
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {isDone && state.time && (
                            <span className="font-metric text-[12px] text-[var(--color-text-secondary)] flex items-center gap-1">
                              <Icon name="clock" size={12} /> {state.time}
                            </span>
                          )}
                          <span className={`text-[12px] font-medium ${isDone ? 'text-[var(--color-success)]' : 'text-[var(--color-text-secondary)]'}`}>
                            {isDone ? 'Done' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      
                      {isDone && canExecute && (
                        <div className="mt-3 pl-[36px]">
                          <input
                            type="text"
                            placeholder="Add an optional note..."
                            value={state.note || ''}
                            onChange={(e) => handleNoteChange(item.id, e.target.value)}
                            className="h-8 w-full max-w-md rounded-[var(--radius-xs)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-[12px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus)] focus-visible:ring-1 focus-visible:ring-[var(--color-focus)]/30"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </Screen>
  );
}
