import { useState } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Select } from '../../components/Select';
import { Icon } from '../../components/Icon';
import { HorseAvatar } from '../horses/HorseAvatar';
import { HealthBadge } from '../../components/StatusBadge';
import { useRtms } from '../../app/RtmsContext';
import { ISSUE_CATEGORIES } from './careData';

export function IssueReportScreen() {
  const { route, navigate, horses, getHorse, reportIssue, toast, currentUser, can } = useRtms();
  const canReport = can('stable-care.report_incident');
  
  const [horseId, setHorseId] = useState(route.horseId || '');
  const [category, setCategory] = useState(ISSUE_CATEGORIES[0]);
  const [observation, setObservation] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Moderate' | 'High'>('Moderate');
  const [reporter, setReporter] = useState(currentUser.name);
  const [photoAttached, setPhotoAttached] = useState(false);

  const selectedHorse = getHorse(horseId);

  const handleSubmit = () => {
    if (!canReport) return;
    if (!selectedHorse) {
      toast('Please select a horse', 'danger');
      return;
    }
    if (!observation.trim()) {
      toast('Add an observation before submitting the report', 'warning');
      return;
    }
    if (!reporter.trim()) {
      toast('Add the reporter name before submitting the report', 'warning');
      return;
    }
    
    reportIssue({
      horseId: selectedHorse.id,
      horseName: selectedHorse.name,
      category,
      observation,
      severity,
      reportedBy: reporter
    });
    
    toast('Issue reported — sent to veterinary review', 'success');
    navigate('stable-care');
  };

  const handlePhotoClick = () => {
    setPhotoAttached(true);
    toast('Photo attached to this report', 'info');
  };

  const now = new Date();
  const timestamp = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  if (horses.length === 0) {
    return (
      <Screen 
        title="Report issue"
        context={<button onClick={() => navigate('stable-care')} className="inline-flex items-center gap-1 hover:underline text-[var(--color-text-secondary)]"><Icon name="arrow-left" size={13} /> Back to Stable Care</button>}
      >
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Icon name="horse" size={48} className="mb-4 text-[var(--color-text-muted)]" />
          <p className="text-[13px] text-[var(--color-text-secondary)]">No horses available.</p>
        </div>
      </Screen>
    );
  }

  return (
    <Screen
      title="Report issue"
      secondary={<Button variant="secondary" onClick={() => navigate('stable-care')}>Cancel</Button>}
      primary={canReport ? <Button variant="primary" icon="check" onClick={handleSubmit}>Submit report</Button> : undefined}
    >
      <div className="mx-auto max-w-2xl space-y-4">
        {/* Horse Selection */}
        <Panel className="space-y-4">
          <SectionTitle>Horse Selection</SectionTitle>
          {route.horseId && selectedHorse ? (
            <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3">
              <HorseAvatar name={selectedHorse.name} image={selectedHorse.image} size={44} />
              <div className="flex-1">
                <div className="font-medium text-[var(--color-text-primary)]">{selectedHorse.name}</div>
                <div className="text-[12px] text-[var(--color-text-secondary)]">{selectedHorse.stable}</div>
              </div>
              <HealthBadge status={selectedHorse.health} />
            </div>
          ) : (
            <div>
              <FieldLabel>Select Horse</FieldLabel>
              <Select
                label="Select horse"
                value={horseId} 
                onChange={setHorseId}
                placeholder="Select a horse..."
                options={[
                  ...horses.map(h => ({ value: h.id, label: h.name }))
                ]}
              />
            </div>
          )}
        </Panel>

        {/* Issue Details */}
        <Panel className="space-y-4">
          <SectionTitle>Issue Details</SectionTitle>
          
          <div>
            <FieldLabel>Category</FieldLabel>
            <Select
              label="Issue category"
              value={category} 
              onChange={setCategory}
              options={ISSUE_CATEGORIES.map(c => ({ value: c, label: c }))}
            />
          </div>

          <div>
            <FieldLabel>Observation</FieldLabel>
            <textarea 
              className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 py-2 text-[13px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]" 
              rows={4} 
              placeholder="Describe the issue or observation..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel>Severity</FieldLabel>
            <div className="mt-1 flex gap-1.5">
              {(['Low', 'Moderate', 'High'] as const).map(level => {
                const isSelected = severity === level;
                let selectedClasses = '';
                
                if (level === 'High') {
                  selectedClasses = 'border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]';
                } else if (level === 'Moderate') {
                  selectedClasses = 'border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]';
                } else {
                  selectedClasses = 'border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]';
                }

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSeverity(level)}
                    className={`flex-1 rounded-[var(--radius-sm)] border px-2 py-1.5 text-[12px] font-medium transition-colors ${isSelected ? selectedClasses : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]'}`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </Panel>

        {/* Photo Placeholder */}
        <Panel className="space-y-4">
          <SectionTitle>Photo (Optional)</SectionTitle>
          <div 
            onClick={handlePhotoClick}
            className="cursor-pointer rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border)] p-6 text-center transition-colors hover:border-[var(--color-primary-soft)]"
          >
            <div className="mb-2 flex justify-center text-[var(--color-text-muted)]">
              <Icon name="camera" size={24} />
            </div>
            <p className="mb-3 text-[13px] text-[var(--color-text-secondary)]">
              {photoAttached ? '1 photo attached' : 'Drag photo or click to browse'}
            </p>
            <Button variant="tertiary" size="sm" onClick={(e) => { e.stopPropagation(); handlePhotoClick(); }}>
              Browse
            </Button>
          </div>
        </Panel>

        {/* Reporter Info */}
        <Panel className="space-y-4">
          <SectionTitle>Reporter Info</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Reported By</FieldLabel>
              <input 
                type="text" 
                value={reporter}
                onChange={(e) => setReporter(e.target.value)}
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30" 
              />
            </div>
            <div>
              <FieldLabel>Time</FieldLabel>
              <div className="mt-1 flex h-9 items-center rounded-[var(--radius-xs)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-2.5">
                <span className="font-metric text-[13px] text-[var(--color-text-secondary)]">{timestamp}</span>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </Screen>
  );
}
