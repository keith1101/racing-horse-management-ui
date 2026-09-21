import { useState } from 'react';
import type { ReactNode } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Pill, HealthBadge } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { Select } from '../../components/Select';
import { HorseAvatar } from '../horses/HorseAvatar';
import { useRtms } from '../../app/RtmsContext';
import { RaceMeta } from './racingUtils';
import { getRaceEligibility } from '../../app/access';

export function RaceRegistrationScreen() {
  const {
    route,
    navigate,
    horses,
    isLocked,
    getLock,
    toast,
    can,
    raceEvents,
    raceProposals,
    proposeRaceEntry,
    approveRaceEntry,
    declineRaceEntry,
  } = useRtms();

  const [currentEventId, setCurrentEventId] = useState<string>(
    () => route.refId || raceEvents[0]?.id || '',
  );

  const event = raceEvents.find((r) => r.id === currentEventId) ?? raceEvents[0];

  // Trainer Proposal Form state
  const [selectedHorseId, setSelectedHorseId] = useState<string>('');
  const [requestedBudget, setRequestedBudget] = useState<string>('1500');
  const [trainerNotes, setTrainerNotes] = useState<string>('');

  // Manager Approval Edit state
  const [approvedBudgets, setApprovedBudgets] = useState<Record<string, string>>({});
  const [managerNotes, setManagerNotes] = useState<Record<string, string>>({});

  const canPropose = can('race.propose');
  const canApprove = can('race.approve');

  if (!event) {
    return (
      <Screen title="Race registration" secondary={<BackButton onClick={() => navigate('racing')} />}>
        <Panel padded>
          <div className="text-center text-[13px] text-[var(--color-text-secondary)]">
            No race events available.
          </div>
        </Panel>
      </Screen>
    );
  }

  const enteredIds = new Set(event.entries.map((e) => e.horseId));
  const eventProposals = raceProposals.filter((p) => p.raceId === event.id);
  const pendingProposals = eventProposals.filter((p) => p.status === 'PENDING');

  function handlePropose() {
    if (!selectedHorseId || !event) return;
    const num = Number(requestedBudget) || 1500;
    const res = proposeRaceEntry(event.id, selectedHorseId, num, trainerNotes);
    if (res.success) {
      setSelectedHorseId('');
      setTrainerNotes('');
    }
  }

  function handleApprove(proposalId: string, defaultBudget: number) {
    const budgetVal = Number(approvedBudgets[proposalId] ?? defaultBudget);
    const notesVal = managerNotes[proposalId] ?? '';
    approveRaceEntry(proposalId, budgetVal, notesVal);
  }

  function handleDecline(proposalId: string) {
    const reason = managerNotes[proposalId] || 'Budget or conditioning constraints';
    declineRaceEntry(proposalId, reason);
  }

  return (
    <Screen
      title="Race Registration & Nominations"
      secondary={<BackButton onClick={() => navigate('racing')} />}
    >
      {/* Race Selector & Details */}
      <Panel padded>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-semibold text-[var(--color-text-primary)]">{event.name}</span>
              <Pill tone={event.status === 'Declared' ? 'primary' : event.status === 'Confirmed' ? 'success' : 'neutral'} size="sm">
                {event.status}
              </Pill>
            </div>
            <div className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">
              {event.course} · {event.distance} · {event.surface}
            </div>
          </div>
          <div className="w-56">
            <Select
              label="Select Race Event"
              value={currentEventId}
              onChange={setCurrentEventId}
              options={raceEvents.map((r) => ({ value: r.id, label: `${r.name} (${r.date})` }))}
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-y-2 border-t border-[var(--color-border)] pt-3 sm:grid-cols-4">
          <RaceMeta label="Race Date" value={`${event.date} · ${event.time}`} />
          <RaceMeta label="Grade & Purse" value={`${event.grade} · ${event.purse}`} />
          <RaceMeta label="Field Declared" value={`${event.entries.length} runners`} />
          <RaceMeta label="Pending Proposals" value={`${pendingProposals.length} awaiting review`} />
        </div>
      </Panel>

      {/* Manager Approval Queue (Shown when user has race.approve or pending proposals exist) */}
      {canApprove && (
        <Panel padded className="mt-4">
          <div className="flex items-center justify-between">
            <SectionTitle>
              Proposals Awaiting Manager Approval ({pendingProposals.length})
            </SectionTitle>
            <span className="text-[11px] text-[var(--color-text-muted)]">Budget allocation review</span>
          </div>

          {pendingProposals.length === 0 ? (
            <div className="mt-3 rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] p-4 text-center text-[12px] text-[var(--color-text-muted)]">
              No pending proposals for this race event.
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {pendingProposals.map((prop) => (
                <div
                  key={prop.id}
                  className="rounded-[var(--radius-sm)] border border-[var(--color-warning)] bg-[var(--color-warning-soft)]/20 p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <HorseAvatar name={prop.horseName} image="" size={36} />
                      <div>
                        <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                          {prop.horseName}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-muted)]">
                          Proposed by {prop.proposedBy} on {prop.proposedDate}
                        </div>
                      </div>
                    </div>
                    <Pill tone="warning" size="sm">
                      Requested Budget: £{prop.requestedBudget.toLocaleString()}
                    </Pill>
                  </div>

                  {prop.notes && (
                    <p className="mt-2 text-[12px] text-[var(--color-text-secondary)]">
                      <span className="font-medium text-[var(--color-text-primary)]">Trainer note:</span> {prop.notes}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] pt-2.5">
                    <div className="flex items-center gap-2">
                      <FieldLabel>Approved Budget (£):</FieldLabel>
                      <input
                        type="number"
                        defaultValue={prop.requestedBudget}
                        onChange={(e) =>
                          setApprovedBudgets((prev) => ({ ...prev, [prop.id]: e.target.value }))
                        }
                        className="h-8 w-28 rounded-[var(--radius-xs)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-[12px]"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        placeholder="Manager review notes / funding code..."
                        value={managerNotes[prop.id] ?? ''}
                        onChange={(e) =>
                          setManagerNotes((prev) => ({ ...prev, [prop.id]: e.target.value }))
                        }
                        className="h-8 w-full rounded-[var(--radius-xs)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-[12px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        icon="x"
                        onClick={() => handleDecline(prop.id)}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon="check"
                        onClick={() => handleApprove(prop.id, prop.requestedBudget)}
                      >
                        Approve & Allocate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}

      {/* Head Trainer Proposal Form */}
      {canPropose && (
        <Panel padded className="mt-4">
          <SectionTitle>Propose Runner Entry (Head Trainer)</SectionTitle>
          <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <FieldLabel>Select Eligible Horse</FieldLabel>
              <select
                value={selectedHorseId}
                onChange={(e) => setSelectedHorseId(e.target.value)}
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2 text-[12px]"
              >
                <option value="">-- Choose horse --</option>
                {horses.map((h) => {
                  const locked = isLocked(h.id);
                  const reason = getRaceEligibility(h, locked);
                  const entered = enteredIds.has(h.id);
                  const proposed = eventProposals.some((p) => p.horseId === h.id && p.status === 'PENDING');
                  const label = `${h.name} (${reason ? `Restricted: ${reason}` : entered ? 'Entered' : proposed ? 'Proposal Pending' : `${h.readiness} - Ready`})`;
                  return (
                    <option key={h.id} value={h.id} disabled={!!reason || entered || proposed}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <FieldLabel>Requested Budget (£)</FieldLabel>
              <input
                type="number"
                value={requestedBudget}
                onChange={(e) => setRequestedBudget(e.target.value)}
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[12px]"
              />
            </div>
            <div>
              <FieldLabel>Trainer Tactical Justification</FieldLabel>
              <input
                value={trainerNotes}
                onChange={(e) => setTrainerNotes(e.target.value)}
                placeholder="e.g. Cleared 1,400m gallop trial; strong closing sectional"
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[12px]"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              variant="primary"
              icon="check"
              disabled={!selectedHorseId}
              onClick={handlePropose}
            >
              Submit Proposal to Club Manager
            </Button>
          </div>
        </Panel>
      )}

      {/* Official Declared Field */}
      <Panel padded className="mt-4">
        <div className="flex items-center justify-between">
          <SectionTitle>Confirmed Field ({event.entries.length} Runners)</SectionTitle>
          <span className="text-[11px] text-[var(--color-text-muted)]">Official entries</span>
        </div>
        <div className="mt-3 divide-y divide-[var(--color-border)] rounded-[var(--radius-sm)] border border-[var(--color-border)]">
          {event.entries.map((entry) => (
            <div key={entry.horseId} className="flex items-center justify-between p-2.5 text-[12px]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-surface-muted)] font-metric text-[11px] font-semibold">
                  {entry.draw}
                </span>
                <button
                  onClick={() => navigate('horses', { horseId: entry.horseId })}
                  className="font-medium text-[var(--color-text-primary)] hover:underline"
                >
                  {entry.horseName}
                </button>
              </div>
              <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
                <span>Jockey: {entry.jockey}</span>
                <span className="font-metric">{entry.weightKg} kg</span>
                <Pill tone="success" icon="check" size="sm">
                  Confirmed
                </Pill>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Complete Stable Eligibility Roster */}
      <Panel padded className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Stable Roster & Race Eligibility Status</SectionTitle>
          <span className="text-[11px] text-[var(--color-text-muted)]">{horses.length} horses</span>
        </div>

        <div className="space-y-2">
          {horses.map((horse) => {
            const locked = isLocked(horse.id);
            const lock = getLock(horse.id);
            const entered = enteredIds.has(horse.id);
            const pendingProposal = eventProposals.find(
              (p) => p.horseId === horse.id && p.status === 'PENDING',
            );
            const eligibilityReason = getRaceEligibility(horse, locked);

            return (
              <div
                key={horse.id}
                className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5"
              >
                <HorseAvatar name={horse.name} image={horse.image} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate('horses', { horseId: horse.id })}
                      className="text-[13px] font-medium text-[var(--color-text-primary)] hover:underline"
                    >
                      {horse.name}
                    </button>
                    {locked && <Icon name="lock" size={11} className="text-[var(--color-danger)]" />}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                    <span>Owner: {horse.owner}</span>
                    <span>·</span>
                    <span>Readiness: {horse.readiness}</span>
                  </div>

                  {eligibilityReason && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-[var(--color-danger)]">
                      <Icon name="alert-triangle" size={11} />
                      Blocked: {locked ? lock?.reason ?? eligibilityReason : eligibilityReason}
                    </div>
                  )}

                  {pendingProposal && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-[var(--color-warning)]">
                      <Icon name="clock" size={11} />
                      Proposal awaiting budget approval (£{pendingProposal.requestedBudget.toLocaleString()})
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <HealthBadge status={horse.health} size="sm" />
                  {entered ? (
                    <Pill tone="success" icon="check" size="sm">
                      Declared
                    </Pill>
                  ) : pendingProposal ? (
                    <Pill tone="warning" size="sm">
                      Proposed
                    </Pill>
                  ) : eligibilityReason ? (
                    <Pill tone="danger" icon="lock" size="sm">
                      Restricted
                    </Pill>
                  ) : (
                    <Pill tone="info" size="sm">
                      Eligible
                    </Pill>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
