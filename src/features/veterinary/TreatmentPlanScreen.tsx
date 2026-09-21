import { useState } from 'react';
import { useRtms } from '../../app/RtmsContext';
import { type TreatmentStatus, type TreatmentPlan } from './medicalData';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { HorseAvatar } from '../horses/HorseAvatar';
import { Pill, HealthBadge } from '../../components/StatusBadge';
import { TrainingLockBanner } from '../../components/TrainingLockBanner';
import { Select } from '../../components/Select';

export function TreatmentPlanScreen() {
  const { route, navigate, toast, horses, getHorse, isLocked, getLock, can, getMedicalRecord, saveTreatment } = useRtms();
  
  const [selectedHorseId, setSelectedHorseId] = useState<string>(route.horseId || horses[2]?.id || horses[0]?.id || '');
  const horse = getHorse(selectedHorseId) || horses[0];
  const medicalRecord = horse ? getMedicalRecord(horse.id) : null;
  const existingTreatment = medicalRecord?.treatment;

  const [status, setStatus] = useState<TreatmentStatus>(existingTreatment?.status || 'Active');
  const [started, setStarted] = useState(existingTreatment?.started || '20 Sep 2026');
  const [expectedEnd, setExpectedEnd] = useState(existingTreatment?.expectedEnd || '18 Oct 2026');
  const [vet, setVet] = useState(existingTreatment?.vet || 'Dr. Haines');
  const [title, setTitle] = useState(existingTreatment?.title || 'Physical rehabilitation protocol');
  const [meds, setMeds] = useState(existingTreatment?.medications || [
    { name: 'Phenylbutazone', dose: '2.0 g', route: 'Oral', frequency: 'Once daily · 5 days' },
    { name: 'Cold therapy (cryo-wrap)', dose: '20 min', route: 'Topical', frequency: 'Twice daily' },
  ]);

  const locked = horse ? isLocked(horse.id) : false;
  const lock = horse ? getLock(horse.id) : undefined;
  const canManage = can('medical.treatment.manage');
  const canViewPrivate = can('medical.private.view');

  if (!canViewPrivate) {
    return (
      <Screen
        title="Treatment plan"
        secondary={<Button variant="tertiary" icon="arrow-left" onClick={() => navigate('veterinary')}>Back</Button>}
      >
        <Panel padded>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-danger-soft)] text-[var(--color-danger)]">
              <Icon name="lock" size={20} />
            </span>
            <h2 className="mt-3 text-[16px] font-semibold text-[var(--color-text-primary)]">
              Clinical Treatment Plan Restricted
            </h2>
            <p className="mt-1 max-w-md text-[13px] text-[var(--color-text-secondary)]">
              Prescription details, pharmaceutical regimens and treatment plans are confidential medical records accessible only to veterinary staff and club management.
            </p>
          </div>
        </Panel>
      </Screen>
    );
  }

  const handleSave = () => {
    if (!canManage) {
      toast('Only veterinary staff or club management can save treatment plans.', 'danger');
      return;
    }
    if (horse) {
      const treatment: TreatmentPlan = {
        id: existingTreatment?.id ?? `tr-${horse.id}-${Date.now()}`,
        title,
        status,
        started,
        expectedEnd,
        vet,
        medications: meds,
        schedule: existingTreatment?.schedule ?? [],
      };
      saveTreatment(horse.id, treatment);
    }
    toast(existingTreatment ? 'Treatment plan updated successfully' : 'Treatment plan created successfully', 'success');
    navigate('veterinary');
  };

  return (
    <Screen
      title="Treatment plan"
      context={
        <button onClick={() => navigate('veterinary')} className="inline-flex items-center gap-1 hover:underline text-[13px] text-[var(--color-text-secondary)]">
          <Icon name="arrow-left" size={13} /> Back to veterinary
        </button>
      }
      secondary={
        <>
          <Button variant="secondary" icon="calendar" onClick={() => navigate('veterinary', { view: 'treatment-schedule' })}>
            View schedule
          </Button>
        </>
      }
      primary={canManage ? <Button variant="primary" icon="check" onClick={handleSave}>{existingTreatment ? 'Update treatment' : 'Create treatment'}</Button> : undefined}
    >
      <div className="flex flex-col gap-4 max-w-4xl pb-10">
        {/* Horse Header & Switcher */}
        {horse && (
          <Panel padded>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <HorseAvatar image={horse.image} name={horse.name} size={52} rounded="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[17px] font-semibold text-[var(--color-text-primary)]">{horse.name}</span>
                    <HealthBadge status={horse.health} size="sm" />
                    {existingTreatment && (
                      <Pill tone={status === 'Active' ? 'primary' : status === 'Completed' ? 'success' : 'neutral'} size="sm">
                        {status}
                      </Pill>
                    )}
                  </div>
                  <div className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">
                    {horse.stable} · Stall {horse.stall} · {horse.breed} · {horse.ageYears} yrs {horse.sex}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  label="Select horse"
                  value={selectedHorseId}
                  onChange={setSelectedHorseId}
                  options={horses.map((h) => ({ value: h.id, label: h.name }))}
                />
                <Button variant="secondary" size="sm" icon="user" onClick={() => navigate('horses', { horseId: horse.id })}>
                  Profile
                </Button>
              </div>
            </div>

            {locked && lock && (
              <div className="mt-3">
                <TrainingLockBanner
                  reason={lock.reason}
                  reviewDate={lock.reviewDate}
                  veterinarian={lock.veterinarian}
                />
              </div>
            )}
          </Panel>
        )}

        {/* Treatment Overview */}
        <Panel padded>
          <SectionTitle>Treatment protocol details</SectionTitle>
          <div className="mt-3 space-y-3">
            <div>
              <FieldLabel>Protocol Title</FieldLabel>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Superficial digital flexor tendon strain management"
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <FieldLabel>Status</FieldLabel>
                <div className="mt-1">
                  <Select
                    label="Status"
                    value={status}
                    onChange={(v) => setStatus(v as TreatmentStatus)}
                    options={[
                      { value: 'Planned', label: 'Planned' },
                      { value: 'Active', label: 'Active' },
                      { value: 'Completed', label: 'Completed' },
                      { value: 'Discontinued', label: 'Discontinued' },
                    ]}
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Start Date</FieldLabel>
                <input
                  type="text"
                  value={started}
                  onChange={(e) => setStarted(e.target.value)}
                  className="font-metric mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
                />
              </div>
              <div>
                <FieldLabel>Expected End Date</FieldLabel>
                <input
                  type="text"
                  value={expectedEnd}
                  onChange={(e) => setExpectedEnd(e.target.value)}
                  className="font-metric mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
                />
              </div>
            </div>

            <div>
              <FieldLabel>Assigned Veterinarian</FieldLabel>
              <div className="mt-1 max-w-sm">
                <Select
                  label="Veterinarian"
                  value={vet}
                  onChange={setVet}
                  options={[
                    { value: 'Dr. Haines', label: 'Dr. Haines (Senior Equine Practitioner)' },
                    { value: 'Dr. Al Mansoor', label: 'Dr. Al Mansoor (Orthopedic Specialist)' },
                  ]}
                />
              </div>
            </div>
          </div>
        </Panel>

        {/* Medications Section */}
        <Panel padded>
          <div className="flex items-center justify-between">
            <SectionTitle>Medications & therapeutic regimen</SectionTitle>
            {canManage && (
              <Button
                variant="tertiary"
                size="sm"
                icon="plus"
                onClick={() => {
                  setMeds((prev) => [
                    ...prev,
                    { name: 'Flunixin Meglumine', dose: '1.1 mg/kg', route: 'Intravenous', frequency: 'Once daily' },
                  ]);
                  toast('Added Flunixin Meglumine to regimen', 'info');
                }}
              >
                Add medication
              </Button>
            )}
          </div>

          <div className="mt-3 space-y-2">
            {meds.map((m, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
                    <Icon name="pill" size={14} />
                  </span>
                  <div>
                    <span className="text-[13px] font-medium text-[var(--color-text-primary)]">{m.name}</span>
                    <div className="text-[11px] text-[var(--color-text-muted)]">
                      Route: <span className="text-[var(--color-text-secondary)]">{m.route}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-metric text-[12px] text-[var(--color-text-primary)]">{m.dose}</span>
                  <span className="text-[12px] text-[var(--color-text-secondary)]">{m.frequency}</span>
                  {canManage && (
                    <button
                      onClick={() => setMeds(meds.filter((_, i) => i !== idx))}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] outline-none"
                    >
                      <Icon name="x" size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Screen>
  );
}
