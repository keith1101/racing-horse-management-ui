import { useState } from 'react';
import { Panel, SectionTitle } from '../../../../components/Panel';
import { Button } from '../../../../components/Button';
import { Icon } from '../../../../components/Icon';
import { Pill } from '../../../../components/StatusBadge';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { useRtms } from '../../../../app/RtmsContext';
import type { RaceProposal } from '../../../racing/racingData';

export function ManagerRaceRegistrationQueue() {
  const { raceProposals, raceEvents, approveRaceEntry, can, navigate } = useRtms();
  const [proposalToApprove, setProposalToApprove] = useState<RaceProposal | null>(null);

  const pendingRegistrations = raceProposals.filter((p) => p.status === 'PENDING');
  const canApprove = can('race.approve');

  const handleConfirmApprove = () => {
    if (!proposalToApprove) return;
    approveRaceEntry(proposalToApprove.id, proposalToApprove.requestedBudget);
    setProposalToApprove(null);
  };

  return (
    <>
      <Panel padded>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="flag" size={15} className="text-[var(--color-primary)]" />
            <SectionTitle>Pending Race Registrations</SectionTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--color-info-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-info)]">
              {pendingRegistrations.length} pending
            </span>
            <Button variant="tertiary" size="sm" onClick={() => navigate('racing')}>
              View all
            </Button>
          </div>
        </div>

        <p className="mb-3 text-[12px] text-[var(--color-text-secondary)]">
          Head Trainer race nominations requiring official club registration sign-off.
        </p>

        {pendingRegistrations.length === 0 ? (
          <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] p-6 text-center">
            <Icon name="check" size={20} className="mx-auto text-[var(--color-success)]" />
            <p className="mt-1 text-[13px] font-medium text-[var(--color-text-primary)]">
              All cleared
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
              No race registrations awaiting review.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRegistrations.map((p) => {
              const matchedEvent = raceEvents.find((e) => e.id === p.raceId);
              const eventDate = matchedEvent?.date || p.proposedDate;
              const distance = matchedEvent?.distance || '1,200 m';
              const surface = matchedEvent?.surface || 'Turf';

              return (
                <div
                  key={p.id}
                  className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3.5 transition-colors hover:border-[var(--color-border-strong)]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-bold text-[var(--color-text-primary)]">
                          {p.horseName}
                        </span>
                        <Pill tone="info" size="sm">
                          Pending Registration
                        </Pill>
                      </div>

                      <div className="mt-1 text-[13px] font-medium text-[var(--color-text-primary)]">
                        {p.raceName}
                      </div>

                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-[var(--color-text-secondary)]">
                        <span>{distance} · {surface}</span>
                        <span>·</span>
                        <span>Race date: {eventDate}</span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px]">
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          Entry fee: £{p.requestedBudget.toLocaleString()}
                        </span>
                        <span className="text-[var(--color-text-muted)]">·</span>
                        <span className="text-[var(--color-text-muted)]">
                          Proposed by: {p.proposedBy}
                        </span>
                      </div>

                      {p.notes && (
                        <p className="mt-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[11px] text-[var(--color-text-secondary)]">
                          <strong className="text-[var(--color-text-primary)]">Trainer note: </strong>
                          {p.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:self-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate('racing')}
                      >
                        Review Details
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon="check"
                        disabled={!canApprove}
                        title={!canApprove ? 'You do not have permission to approve race registrations' : undefined}
                        onClick={() => setProposalToApprove(p)}
                      >
                        Approve Registration
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <ConfirmDialog
        open={Boolean(proposalToApprove)}
        title={`Approve race registration for ${proposalToApprove?.horseName}?`}
        description={
          <div>
            <p>
              Confirm official race entry for <strong>{proposalToApprove?.horseName}</strong> in <strong>{proposalToApprove?.raceName}</strong>.
            </p>
            <div className="mt-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] p-2.5 text-[12px] text-[var(--color-text-secondary)]">
              <div>Entry fee: <strong className="text-[var(--color-text-primary)]">£{proposalToApprove?.requestedBudget.toLocaleString()}</strong></div>
              <div>Proposed by: <strong>{proposalToApprove?.proposedBy}</strong></div>
            </div>
          </div>
        }
        confirmLabel="Approve Registration"
        cancelLabel="Cancel"
        onConfirm={handleConfirmApprove}
        onCancel={() => setProposalToApprove(null)}
      />
    </>
  );
}
