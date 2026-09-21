import { useState, useEffect } from 'react';
import { Drawer } from '../../components/Drawer';
import { Button } from '../../components/Button';
import { FieldLabel } from '../../components/Panel';
import { Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { HorseAvatar } from '../horses/HorseAvatar';
import { useRtms } from '../../app/RtmsContext';
import type { TrainingSession, TrainingResult } from './trainingData';

interface LogWorkoutModalProps {
  open: boolean;
  onClose: () => void;
  session?: TrainingSession;
}

export function LogWorkoutModal({ open, onClose, session }: LogWorkoutModalProps) {
  const { logWorkoutResult, horses, toast } = useRtms();

  const [actualDistance, setActualDistance] = useState('1,400 m');
  const [durationMin, setDurationMin] = useState(18);
  const [topSpeed, setTopSpeed] = useState(52.0);
  const [avgSpeed, setAvgSpeed] = useState(48.5);
  const [avgHr, setAvgHr] = useState(176);
  const [maxHr, setMaxHr] = useState(212);
  const [recoveryMin, setRecoveryMin] = useState(12);
  const [rating, setRating] = useState(5);
  const [assessment, setAssessment] = useState<TrainingResult['assessment']>('Excellent');
  const [notes, setNotes] = useState('');

  // Pre-fill if session already has results or baseline
  useEffect(() => {
    if (session) {
      setActualDistance(session.distance || '1,400 m');
      if (session.result) {
        setTopSpeed(session.result.maxSpeed);
        setAvgSpeed(session.result.avgSpeed);
        setAvgHr(session.result.avgHr);
        setMaxHr(session.result.maxHr);
        setRecoveryMin(session.result.recoveryMin);
        setDurationMin(session.result.durationMin ?? 18);
        setRating(session.result.rating ?? 5);
        setAssessment(session.result.assessment);
        setNotes(session.result.notes);
      } else {
        // Defaults
        setTopSpeed(50.5);
        setAvgSpeed(46.2);
        setAvgHr(172);
        setMaxHr(208);
        setRecoveryMin(14);
        setDurationMin(20);
        setRating(4);
        setAssessment('On target');
        setNotes('Strong stride mechanics, balanced through the home turn. Handled surface transition well.');
      }
    }
  }, [session]);

  const horse = session ? horses.find((h) => h.id === session.horseId) : undefined;

  const handleSave = () => {
    if (!session) return;

    const result: TrainingResult = {
      avgSpeed: Number(avgSpeed),
      maxSpeed: Number(topSpeed),
      avgHr: Number(avgHr),
      maxHr: Number(maxHr),
      recoveryMin: Number(recoveryMin),
      durationMin: Number(durationMin),
      rating: Number(rating),
      assessment,
      notes: notes.trim(),
    };

    logWorkoutResult(session.id, result);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Log Workout Result"
      subtitle={session ? `${session.horseName} · ${session.session} (${session.time})` : undefined}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon="check"
            onClick={handleSave}
          >
            Save Result
          </Button>
        </>
      }
    >
      {session && (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
            {horse && <HorseAvatar name={horse.name} image={horse.image} size={44} rounded="md" />}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-[var(--color-text-primary)]">
                  {session.horseName}
                </span>
                <Pill tone="primary" size="sm">
                  {session.session}
                </Pill>
              </div>
              <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                Golden Hour: <strong className="text-[var(--color-text-primary)]">{session.time}</strong> · Surface: {session.surface} · Trainer: {session.trainer}
              </p>
              {session.assignedGroom && (
                <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
                  Assigned Groom: <strong className="text-[var(--color-primary)]">{session.assignedGroom}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Performance Star Rating */}
          <div>
            <FieldLabel>Performance Rating (Đánh giá buổi tập)</FieldLabel>
            <div className="mt-1.5 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-110 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  title={`${star} star${star > 1 ? 's' : ''}`}
                >
                  <span className={star <= rating ? 'text-amber-400' : 'text-stone-300'}>
                    ★
                  </span>
                </button>
              ))}
              <span className="ml-2 text-[12px] font-semibold text-[var(--color-text-primary)]">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Actual Distance & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Actual Distance</FieldLabel>
              <input
                type="text"
                value={actualDistance}
                onChange={(e) => setActualDistance(e.target.value)}
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              />
            </div>
            <div>
              <FieldLabel>Duration (Minutes)</FieldLabel>
              <input
                type="number"
                min={1}
                max={120}
                value={durationMin}
                onChange={(e) => setDurationMin(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              />
            </div>
          </div>

          {/* Speed Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Top Speed (km/h)</FieldLabel>
              <input
                type="number"
                step="0.1"
                value={topSpeed}
                onChange={(e) => setTopSpeed(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] font-semibold text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              />
            </div>
            <div>
              <FieldLabel>Average Speed (km/h)</FieldLabel>
              <input
                type="number"
                step="0.1"
                value={avgSpeed}
                onChange={(e) => setAvgSpeed(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] font-semibold text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              />
            </div>
          </div>

          {/* Heart Rate & Recovery Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <FieldLabel>Avg HR (bpm)</FieldLabel>
              <input
                type="number"
                value={avgHr}
                onChange={(e) => setAvgHr(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              />
            </div>
            <div>
              <FieldLabel>Peak HR (bpm)</FieldLabel>
              <input
                type="number"
                value={maxHr}
                onChange={(e) => setMaxHr(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              />
            </div>
            <div>
              <FieldLabel>Recovery Time</FieldLabel>
              <input
                type="number"
                value={recoveryMin}
                onChange={(e) => setRecoveryMin(Number(e.target.value))}
                placeholder="Minutes"
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              />
            </div>
          </div>

          {/* Assessment Classification */}
          <div>
            <FieldLabel>Trainer Assessment Classification</FieldLabel>
            <div className="mt-1 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {(['Excellent', 'On target', 'Below target', 'Fatigued'] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAssessment(a)}
                  className={
                    'rounded-[var(--radius-sm)] border px-2 py-1.5 text-[12px] font-medium outline-none transition-colors ' +
                    (assessment === a
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]')
                  }
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Trainer Feedback / Notes */}
          <div>
            <FieldLabel>Trainer Feedback & Sectional Notes</FieldLabel>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record split times, bridle manners, stride extension, recovery observations..."
              className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 py-2 text-[13px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            />
          </div>
        </div>
      )}
    </Drawer>
  );
}
