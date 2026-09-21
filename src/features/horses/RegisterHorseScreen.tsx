import React, { useState } from 'react';
import { useRtms } from '../../app/RtmsContext';
import { Screen } from '../../components/Screen';
import { Panel, FieldLabel, SectionTitle } from '../../components/Panel';
import { Button } from '../../components/Button';
import type { Horse } from './horseData';

const inputStyles =
  'mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30';

export function RegisterHorseScreen() {
  const { navigate, toast, registerHorse, can, currentUser } = useRtms();

  const [formData, setFormData] = useState({
    name: '',
    breed: 'Thoroughbred',
    sex: 'Stallion',
    dob: '',
    color: '',
    microchip: '',
    owner: currentUser.owner ?? 'Marlowe Racing Ltd.',
    trainer: currentUser.name,
    stable: 'Barn A',
    stall: '',
    sire: '',
    dam: '',
    healthStatus: 'Fit',
    trainingReadiness: 'Ready',
    initialTrainingStatus: 'Draft',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!can('horse.create')) {
      toast('Your role is read-only for horse registration.', 'danger');
      return;
    }
    if (!formData.name.trim() || !formData.microchip.trim() || !formData.stall.trim()) {
      toast('Name, microchip ID and stall are required.', 'warning');
      return;
    }
    const health = formData.healthStatus.toUpperCase() as Horse['health'];
    const training = formData.initialTrainingStatus.toUpperCase() as Horse['training'];
    const readiness = formData.trainingReadiness === 'Recovery' ? 'Resting' : formData.trainingReadiness as Horse['readiness'];
    const horse: Horse = {
      id: `h-registered-${Date.now()}`,
      name: formData.name.trim(),
      image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      sex: formData.sex as Horse['sex'],
      breed: formData.breed,
      foaled: formData.dob || '2026-01-01',
      ageYears: 0,
      microchip: formData.microchip.trim(),
      sire: formData.sire || 'Not recorded',
      dam: formData.dam || 'Not recorded',
      health,
      healthNote: health === 'FIT' ? 'Cleared at registration' : 'Follow-up monitoring required',
      stable: formData.stable,
      stall: formData.stall.trim(),
      owner: formData.owner,
      trainer: formData.trainer,
      training,
      activePlan: 'Intake Assessment',
      phase: 'Admission',
      nextWorkout: 'Plan pending trainer review',
      readiness,
      weightKg: 0,
      restingHrBpm: 0,
      schedule: [],
      activity: [{ time: 'Just now', actor: currentUser.name, event: 'Registered in horse register' }],
    };
    registerHorse(horse);
    toast('Horse registered successfully', 'success');
    navigate('horses');
  };

  const secondaryAction = (
    <Button variant="secondary" onClick={() => navigate('horses')}>
      Cancel
    </Button>
  );

  const primaryAction = (
    can('horse.create') ? (
      <Button variant="primary" icon="check" onClick={handleSave}>
        Save
      </Button>
    ) : undefined
  );

  return (
    <Screen
      title="Register horse"
      secondary={secondaryAction}
      primary={primaryAction}
    >
      <div className="flex flex-col gap-4 max-w-5xl mx-auto pb-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Identity Section */}
          <Panel>
            <div className="mb-4">
              <SectionTitle>Identity</SectionTitle>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <FieldLabel>Name</FieldLabel>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputStyles}
                  placeholder="e.g. Thunder Bolt"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Breed</FieldLabel>
                  <select
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className={inputStyles}
                  >
                    <option>Thoroughbred</option>
                    <option>Arabian</option>
                  </select>
                </div>
                <div>
                  <FieldLabel>Sex</FieldLabel>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className={inputStyles}
                  >
                    <option>Stallion</option>
                    <option>Mare</option>
                    <option>Gelding</option>
                    <option>Colt</option>
                    <option>Filly</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Date of birth</FieldLabel>
                  <input
                    type="text"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="DD MMM YYYY"
                  />
                </div>
                <div>
                  <FieldLabel>Color</FieldLabel>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="e.g. Bay"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Microchip ID</FieldLabel>
                <input
                  type="text"
                  name="microchip"
                  value={formData.microchip}
                  onChange={handleChange}
                  className={`${inputStyles} font-metric`}
                  placeholder="15-digit ISO code"
                />
              </div>
            </div>
          </Panel>

          {/* Assignment Section */}
          <Panel>
            <div className="mb-4">
              <SectionTitle>Assignment</SectionTitle>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <FieldLabel>Owner</FieldLabel>
                <select
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  className={inputStyles}
                >
                  <option>Marlowe Racing Ltd.</option>
                  <option>Ashgrove Stud</option>
                  <option>Hollowbrook Partners</option>
                  <option>Crescent Bloodstock</option>
                </select>
              </div>
              <div>
                <FieldLabel>Trainer</FieldLabel>
                <select
                  name="trainer"
                  value={formData.trainer}
                  onChange={handleChange}
                  className={inputStyles}
                >
                  <option>Elena Cardoso</option>
                  <option>Tomas Reyes</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Stable</FieldLabel>
                  <select
                    name="stable"
                    value={formData.stable}
                    onChange={handleChange}
                    className={inputStyles}
                  >
                    <option>Barn A</option>
                    <option>Barn B</option>
                    <option>Barn C</option>
                  </select>
                </div>
                <div>
                  <FieldLabel>Stall</FieldLabel>
                  <input
                    type="text"
                    name="stall"
                    value={formData.stall}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="e.g. A-12"
                  />
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* Pedigree Section */}
        <Panel>
          <div className="mb-4">
            <SectionTitle>Pedigree</SectionTitle>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <FieldLabel>Sire</FieldLabel>
              <input
                type="text"
                name="sire"
                value={formData.sire}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <FieldLabel>Dam</FieldLabel>
              <input
                type="text"
                name="dam"
                value={formData.dam}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
          </div>
        </Panel>

        {/* Status Section */}
        <Panel>
          <div className="mb-4">
            <SectionTitle>Status</SectionTitle>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <FieldLabel>Health status</FieldLabel>
              <select
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleChange}
                className={inputStyles}
              >
                <option>Fit</option>
                <option>Monitor</option>
              </select>
            </div>
            <div>
              <FieldLabel>Training readiness</FieldLabel>
              <select
                name="trainingReadiness"
                value={formData.trainingReadiness}
                onChange={handleChange}
                className={inputStyles}
              >
                <option>Ready</option>
                <option>Building</option>
                <option>Recovery</option>
              </select>
            </div>
            <div>
              <FieldLabel>Initial training status</FieldLabel>
              <select
                name="initialTrainingStatus"
                value={formData.initialTrainingStatus}
                onChange={handleChange}
                className={inputStyles}
              >
                <option>Draft</option>
                <option>Scheduled</option>
              </select>
            </div>
          </div>
        </Panel>
      </div>
    </Screen>
  );
}
