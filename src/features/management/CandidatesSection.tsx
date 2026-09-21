import { useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { HorseAvatar } from '../horses/HorseAvatar';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useRtms } from '../../app/RtmsContext';
import {
  ADMISSION_STAGE_LABELS,
  getNextAdmissionStage,
  type AdmissionStage,
} from '../../app/access';
import { type Candidate, type CandidateStatus, type VerificationStatus } from './candidateData';

const statusTone: Record<CandidateStatus, 'neutral' | 'info' | 'warning' | 'success' | 'danger'> = {
  SUBMITTED: 'neutral',
  GROOM_REVIEW: 'info',
  WAITING_FOR_STALL: 'warning',
  VET_REVIEW: 'info',
  TRAINER_REVIEW: 'info',
  MANAGER_REVIEW: 'warning',
  ADDITIONAL_INFORMATION_REQUIRED: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
};

const verifyTone: Record<VerificationStatus, 'success' | 'neutral' | 'info' | 'warning'> = {
  Verified: 'success',
  Unverified: 'neutral',
  'Verification pending': 'info',
  'Registry unavailable': 'warning',
};

const admissionStages: AdmissionStage[] = ['GROOM_REVIEW', 'WAITING_FOR_STALL', 'VET_REVIEW', 'TRAINER_REVIEW', 'MANAGER_REVIEW'];

export function CandidatesSection() {
  const {
    navigate,
    toast,
    candidates: candidateRecords,
    getCandidateStatus,
    canReviewCandidate,
    updateCandidateStatus,
    assignCandidateStall,
    approveCandidate,
    can,
  } = useRtms();
  const [selectedId, setSelectedId] = useState<string>('cand-1');
  const [confirm, setConfirm] = useState<'approve' | 'reject' | null>(null);

  const candidates = useMemo(
    () => candidateRecords.map((candidate) => ({ ...candidate, evaluation: getCandidateStatus(candidate) })),
    [candidateRecords, getCandidateStatus],
  );
  const selected = candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0];

  const pending = candidates.filter((candidate) => !['APPROVED', 'REJECTED'].includes(candidate.evaluation)).length;
  const approved = candidates.filter((candidate) => candidate.evaluation === 'APPROVED').length;
  const selectedStage = selected?.evaluation as AdmissionStage | undefined;
  const nextStage = selectedStage ? getNextAdmissionStage(selectedStage) : undefined;
  const canReviewSelected = selected ? canReviewCandidate(selected) : false;
  const canRequestInformation = can('admission.request_info') && canReviewSelected;
  const canResubmit = selectedStage === 'ADDITIONAL_INFORMATION_REQUIRED' && can('admission.resubmit');
  const canAssignStall = selectedStage === 'WAITING_FOR_STALL' && can('admission.review.groom');

  function approveOrAdvance() {
    if (!selected || !selectedStage) return;
    if (selectedStage === 'MANAGER_REVIEW') {
      approveCandidate(selected);
      toast(`${selected.name} approved — official Horse created`, 'success');
    } else if (nextStage) {
      updateCandidateStatus(selected.id, nextStage);
      toast(`${selected.name} advanced to ${ADMISSION_STAGE_LABELS[nextStage]}`, 'success');
    }
    setConfirm(null);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Applications" value={candidates.length} unit="total" icon="users" />
        <MetricCard label="Awaiting my review" value={candidates.filter((candidate) => canReviewCandidate(candidate)).length} unit="applications" icon="clock" tone="info" />
        <MetricCard label="Approved" value={approved} unit="official horses" icon="check" tone="success" />
        <MetricCard label="Registry issues" value={candidates.filter((candidate) => candidate.pedigreeVerification === 'Registry unavailable').length} unit="flagged" icon="alert-triangle" tone="warning" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Panel className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2.5">
            <SectionTitle>Admission applications</SectionTitle>
            <span className="text-[11px] text-[var(--color-text-muted)]">{pending} open</span>
          </div>
          <ul className="divide-y divide-[var(--color-border)]">
            {candidates.map((candidate) => {
              const isSelected = candidate.id === selected?.id;
              return (
                <li key={candidate.id}>
                  <button
                    onClick={() => setSelectedId(candidate.id)}
                    className={
                      'flex w-full items-center gap-2.5 px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus)] ' +
                      (isSelected ? 'bg-[var(--color-primary-subtle)]' : 'hover:bg-[var(--color-surface-subtle)]')
                    }
                  >
                    <HorseAvatar name={candidate.name} image={candidate.image} size={38} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-[var(--color-text-primary)]">{candidate.name}</div>
                      <div className="truncate text-[11px] text-[var(--color-text-muted)]">{candidate.owner} · {candidate.breed} · {candidate.ageYears} yrs</div>
                    </div>
                    <Pill tone={statusTone[candidate.evaluation]} size="sm">{ADMISSION_STAGE_LABELS[candidate.evaluation]}</Pill>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        {selected && (
          <div className="space-y-4">
            <Panel padded>
              <div className="flex flex-wrap items-start gap-4">
                <HorseAvatar name={selected.name} image={selected.image} size={56} rounded="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[17px] font-semibold text-[var(--color-text-primary)]">{selected.name}</h2>
                    <Pill tone={statusTone[selected.evaluation]}>{ADMISSION_STAGE_LABELS[selected.evaluation]}</Pill>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                    <Field label="Owner" value={selected.owner} />
                    <Field label="Breed / sex" value={`${selected.breed} · ${selected.sex}`} />
                    <Field label="Age" value={`${selected.ageYears} yrs`} />
                    <Field label="Submitted" value={selected.submitted} />
                  </div>
                </div>
              </div>
            </Panel>

            <Panel padded>
              <SectionTitle>Review pipeline</SectionTitle>
              <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                {admissionStages.map((stage) => {
                  const stageIndex = admissionStages.indexOf(stage);
                  const currentIndex = selectedStage ? admissionStages.indexOf(selectedStage) : -1;
                  const completed = selected.evaluation === 'APPROVED' || (currentIndex >= 0 && stageIndex < currentIndex);
                  const active = selected.evaluation === stage;
                  return (
                    <div key={stage} className={`rounded-[var(--radius-sm)] border px-2.5 py-2 ${active ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)]' : completed ? 'border-[var(--color-success)]/40 bg-[var(--color-success-soft)]' : 'border-[var(--color-border)]'}`}>
                      <div className="flex items-center gap-1.5">
                        <Icon name={completed ? 'check' : active ? 'clock' : 'minus'} size={12} className={completed ? 'text-[var(--color-success)]' : active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} />
                        <span className="text-[11px] font-medium text-[var(--color-text-primary)]">{ADMISSION_STAGE_LABELS[stage]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[12px] text-[var(--color-text-secondary)]">
                {selected.evaluation === 'APPROVED'
                  ? 'Final approval created the official Horse record.'
                  : selected.evaluation === 'REJECTED'
                    ? 'Rejected applications are closed. A new application is required for a later attempt.'
                    : selected.evaluation === 'ADDITIONAL_INFORMATION_REQUIRED'
                      ? 'Additional information is required before review can continue.'
                      : null}
              </p>
            </Panel>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Panel padded>
                <SectionTitle>Pedigree verification</SectionTitle>
                <div className="mt-2 flex items-center gap-2">
                  <Pill tone={verifyTone[selected.pedigreeVerification]} icon={selected.pedigreeVerification === 'Verified' ? 'check' : selected.pedigreeVerification === 'Registry unavailable' ? 'alert-triangle' : 'clock'}>
                    {selected.pedigreeVerification}
                  </Pill>
                </div>
                <div className="mt-3 space-y-1.5 text-[12px]">
                  <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Sire</span><span className="text-[var(--color-text-primary)]">{selected.sire}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Dam</span><span className="text-[var(--color-text-primary)]">{selected.dam}</span></div>
                </div>
              </Panel>

              <Panel padded>
                <SectionTitle>Health screening</SectionTitle>
                <div className="mt-2">
                  <Pill tone={selected.healthScreening === 'Passed' ? 'success' : selected.healthScreening === 'Concerns noted' ? 'warning' : 'neutral'}>
                    {selected.healthScreening}
                  </Pill>
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                  <span className="font-medium text-[var(--color-text-primary)]">Performance:</span> {selected.performanceNote}
                </p>
              </Panel>
            </div>

            <Panel padded>
              <SectionTitle>Evaluation checklist</SectionTitle>
              <ul className="mt-3 space-y-1.5">
                {selected.checklist.map((item) => (
                  <li key={item.id} className="flex items-center gap-2.5">
                    <span className={'flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] ' + (item.done ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]' : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]')}>
                      <Icon name={item.done ? 'check' : 'minus'} size={12} />
                    </span>
                    <span className={'text-[13px] ' + (item.done ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]')}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            {selected.evaluation === 'APPROVED' ? (
              <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-success)] bg-[var(--color-success-soft)] px-3 py-2.5 text-[var(--color-success)]">
                <Icon name="check" size={16} />
                <span className="text-[13px] font-medium">Approved — {selected.name} is now an official Horse.</span>
                <button onClick={() => navigate('horses')} className="ml-auto text-[12px] font-medium underline-offset-2 hover:underline">Go to Horses</button>
              </div>
            ) : selected.evaluation === 'REJECTED' ? (
              <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] px-3 py-2.5 text-[var(--color-danger)]">
                <Icon name="x" size={16} />
                <span className="text-[13px] font-medium">{selected.name} was rejected. Submit a new application to try again.</span>
              </div>
            ) : (
              selected.evaluation === 'ADDITIONAL_INFORMATION_REQUIRED' ? (
                <div className="flex flex-wrap items-center gap-2">
                  {canResubmit && <Button
                    variant="primary"
                    icon="refresh"
                    onClick={() => {
                      updateCandidateStatus(selected.id, 'GROOM_REVIEW');
                      toast(`${selected.name} resubmitted for review`, 'success');
                    }}
                  >
                    Resubmit application
                  </Button>}
                </div>
              ) : (
              <div className="flex flex-wrap items-center gap-2">
                {canAssignStall && <Button
                  variant="primary"
                  icon="building"
                  onClick={() => assignCandidateStall(selected.id, 'Barn C', 'C12')}
                >
                  Assign Barn C · C12
                </Button>}
                {canRequestInformation && <Button
                  variant="secondary"
                  icon="file-text"
                  onClick={() => {
                    updateCandidateStatus(selected.id, 'ADDITIONAL_INFORMATION_REQUIRED');
                    toast(`Requested additional information for ${selected.name}`);
                  }}
                >
                  Request information
                </Button>}
                {canReviewSelected && <Button variant="destructive" icon="x" onClick={() => setConfirm('reject')}>Reject</Button>}
                {canReviewSelected && nextStage && !canAssignStall && <Button variant="primary" icon="check" onClick={() => setConfirm('approve')}>
                  {selectedStage === 'MANAGER_REVIEW' ? 'Approve & create Horse' : `Approve & send to ${nextStage ? ADMISSION_STAGE_LABELS[nextStage].replace(' review', '') : 'next reviewer'}`}
                </Button>}
              </div>
              )
            )}

          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirm === 'approve'}
        title={`${selectedStage === 'MANAGER_REVIEW' ? 'Approve' : 'Advance'} ${selected?.name ?? 'application'}?`}
        description={selectedStage === 'MANAGER_REVIEW' ? 'This is the final decision. Approving creates the official Horse record and moves it into normal operations.' : `This records your review and sends the application to ${nextStage ? ADMISSION_STAGE_LABELS[nextStage] : 'the next stage'}.`}
        confirmLabel={selectedStage === 'MANAGER_REVIEW' ? 'Approve and create Horse' : 'Approve review'}
        onCancel={() => setConfirm(null)}
        onConfirm={approveOrAdvance}
      />
      <ConfirmDialog
        open={confirm === 'reject'}
        tone="danger"
        title={`Reject ${selected?.name ?? 'application'}?`}
        description="This application will be closed. The owner must submit a new application for a later attempt."
        confirmLabel="Reject application"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (selected) {
            updateCandidateStatus(selected.id, 'REJECTED');
            toast(`${selected.name} rejected`, 'warning');
          }
          setConfirm(null);
        }}
      />
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-0.5 text-[13px] text-[var(--color-text-primary)]">{value}</div>
    </div>
  );
}
