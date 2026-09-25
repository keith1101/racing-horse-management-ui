import { useState } from 'react';
import { Panel, SectionTitle } from '../../../../components/Panel';
import { Button } from '../../../../components/Button';
import { Icon } from '../../../../components/Icon';
import { Pill } from '../../../../components/StatusBadge';
import { HorseAvatar } from '../../../horses/HorseAvatar';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { useRtms } from '../../../../app/RtmsContext';
import type { Candidate } from '../../../management/candidateData';

export function ManagerAdmissionQueue() {
  const { candidates, getCandidateStatus, can, navigate } = useRtms();
  const [candidateToApprove, setCandidateToApprove] = useState<Candidate | null>(null);

  const managerCandidates = candidates.filter(
    (c) => getCandidateStatus(c) === 'MANAGER_REVIEW',
  );

  const handleConfirmApprove = () => {
    if (!candidateToApprove) return;
    navigate('management', { view: 'candidate', refId: candidateToApprove.id });
    setCandidateToApprove(null);
  };

  const canApprove = can('admission.approve');

  return (
    <>
      <Panel padded>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="users" size={15} className="text-[var(--color-primary)]" />
            <SectionTitle>Final Admissions Sign-off</SectionTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--color-warning-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-warning)]">
              {managerCandidates.length} awaiting approval
            </span>
            <Button variant="tertiary" size="sm" onClick={() => navigate('management')}>
              View all
            </Button>
          </div>
        </div>

        <p className="mb-3 text-[12px] text-[var(--color-text-secondary)]">
          Candidates cleared through Groom, Veterinary, and Trainer assessment awaiting final eligibility and stall assignment.
        </p>

        {managerCandidates.length === 0 ? (
          <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] p-6 text-center">
            <Icon name="check" size={20} className="mx-auto text-[var(--color-success)]" />
            <p className="mt-1 text-[13px] font-medium text-[var(--color-text-primary)]">
              All cleared
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
              No admission applications awaiting Manager final review.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {managerCandidates.map((c) => {
              const proposedStall = c.stable && c.stall ? `${c.stable} · ${c.stall}` : 'Barn C · C11';
              return (
                <div
                  key={c.id}
                  className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3.5 transition-colors hover:border-[var(--color-border-strong)]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <HorseAvatar name={c.name} image={c.image} size={42} />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[14px] font-bold text-[var(--color-text-primary)]">
                            {c.name}
                          </span>
                          <Pill tone="warning" size="sm">
                            Manager Final Review
                          </Pill>
                        </div>
                        <p className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">
                          Owner: <strong className="font-medium text-[var(--color-text-primary)]">{c.owner}</strong> · {c.ageYears}yo {c.sex} · {c.breed}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-[var(--color-primary)]">
                          Proposed stall: {proposedStall}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:self-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate('management')}
                      >
                        Review Details
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon="check"
                        disabled={!canApprove}
                        title={!canApprove ? 'You do not have permission to approve admissions' : undefined}
                        onClick={() => setCandidateToApprove(c)}
                      >
                        Approve & Admit
                      </Button>
                    </div>
                  </div>

                  {/* Stage Verification Status Row */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-2.5 text-[11px]">
                    <span className="inline-flex items-center gap-1 font-medium text-[var(--color-success)]">
                      <Icon name="check" size={12} />
                      Pedigree Verified
                    </span>
                    <span className="text-[var(--color-text-muted)]">·</span>
                    <span className="inline-flex items-center gap-1 font-medium text-[var(--color-success)]">
                      <Icon name="check" size={12} />
                      Health Exam Passed
                    </span>
                    <span className="text-[var(--color-text-muted)]">·</span>
                    <span className="inline-flex items-center gap-1 font-medium text-[var(--color-success)]">
                      <Icon name="check" size={12} />
                      Trainer Evaluation Passed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <ConfirmDialog
        open={Boolean(candidateToApprove)}
        title={`Approve admission for ${candidateToApprove?.name}?`}
        description={
          <div>
            <p>
              This will admit <strong>{candidateToApprove?.name}</strong> into the club and create its official horse profile in RTMS.
            </p>
            <div className="mt-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] p-2.5 text-[12px] text-[var(--color-text-secondary)]">
              <div>Owner: <strong>{candidateToApprove?.owner}</strong></div>
              <div>Assigned stall: <strong>{candidateToApprove?.stable && candidateToApprove?.stall ? `${candidateToApprove.stable} · ${candidateToApprove.stall}` : 'Barn C · C11'}</strong></div>
            </div>
          </div>
        }
        confirmLabel="Approve & Admit"
        cancelLabel="Cancel"
        onConfirm={handleConfirmApprove}
        onCancel={() => setCandidateToApprove(null)}
      />
    </>
  );
}
