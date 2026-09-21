import { useState, type ChangeEvent } from 'react';
import { useRtms } from '../../app/RtmsContext';
import { Button } from '../../components/Button';
import { Drawer } from '../../components/Drawer';
import { FieldLabel } from '../../components/Panel';
import type { Candidate } from './candidateData';

const inputStyles =
  'mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30';

interface CandidateIntakeDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CandidateIntakeDrawer({ open, onClose }: CandidateIntakeDrawerProps) {
  const { addCandidate, toast, currentUser } = useRtms();
  const [form, setForm] = useState({
    name: '',
    owner: currentUser.owner ?? '',
    breed: 'Thoroughbred',
    sex: 'Colt' as Candidate['sex'],
    ageYears: '3',
    sire: '',
    dam: '',
  });

  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function submit() {
    if (!form.name.trim() || !form.owner.trim() || !form.sire.trim() || !form.dam.trim()) {
      toast('Name, owner, sire and dam are required for candidate intake.', 'warning');
      return;
    }
    const candidate: Candidate = {
      id: `cand-${Date.now()}`,
      name: form.name.trim(),
      image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      owner: form.owner.trim(),
      breed: form.breed,
      sex: form.sex,
      ageYears: Number(form.ageYears) || 0,
      sire: form.sire.trim(),
      dam: form.dam.trim(),
      pedigreeVerification: 'Unverified',
      healthScreening: 'Not started',
      evaluation: 'SUBMITTED',
      submitted: '20 Sep 2026',
      performanceNote: 'Performance information has not yet been submitted.',
      checklist: [
        { id: 'e1', label: 'Identity & microchip confirmed', done: false },
        { id: 'e2', label: 'Pedigree verified with registry', done: false },
        { id: 'e3', label: 'Veterinary pre-purchase exam', done: false },
        { id: 'e4', label: 'Conformation assessment', done: false },
        { id: 'e5', label: 'Trainer trial evaluation', done: false },
      ],
    };
    addCandidate(candidate);
    toast(`${candidate.name} submitted for review`, 'success');
    setForm({ name: '', owner: currentUser.owner ?? '', breed: 'Thoroughbred', sex: 'Colt', ageYears: '3', sire: '', dam: '' });
    onClose();
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add candidate"
      subtitle="Create a staged intake record. It will not become an official horse until approval."
      footer={
        <>
          <Button variant="tertiary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" icon="check" onClick={submit}>Submit for review</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <FieldLabel>Name</FieldLabel>
          <input name="name" value={form.name} onChange={update} className={inputStyles} placeholder="e.g. Coastal Sovereign" />
        </div>
        <div>
          <FieldLabel>Owner</FieldLabel>
          <input name="owner" value={form.owner} onChange={update} disabled={currentUser.role === 'HORSE_OWNER'} className={inputStyles + (currentUser.role === 'HORSE_OWNER' ? ' cursor-not-allowed bg-[var(--color-surface-muted)]' : '')} placeholder="Owner or syndicate" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Breed</FieldLabel>
            <select name="breed" value={form.breed} onChange={update} className={inputStyles}>
              <option>Thoroughbred</option>
              <option>Arabian</option>
            </select>
          </div>
          <div>
            <FieldLabel>Sex</FieldLabel>
            <select name="sex" value={form.sex} onChange={update} className={inputStyles}>
              <option>Colt</option>
              <option>Filly</option>
              <option>Gelding</option>
              <option>Mare</option>
              <option>Stallion</option>
            </select>
          </div>
        </div>
        <div>
          <FieldLabel>Age</FieldLabel>
          <input name="ageYears" type="number" min="0" max="30" value={form.ageYears} onChange={update} className={inputStyles} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Sire</FieldLabel>
            <input name="sire" value={form.sire} onChange={update} className={inputStyles} />
          </div>
          <div>
            <FieldLabel>Dam</FieldLabel>
            <input name="dam" value={form.dam} onChange={update} className={inputStyles} />
          </div>
        </div>
      </div>
    </Drawer>
  );
}
