import { useMemo, useState } from 'react';
import { useRtms } from '../../app/RtmsContext';
import { Button } from '../../components/Button';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Pill } from '../../components/StatusBadge';
import { HorseAvatar } from '../horses/HorseAvatar';
import { Icon } from '../../components/Icon';
import { generateWorkoutsFromCourse } from './trainingData';

interface CreateTrainingPlanModalProps {
  open: boolean;
  onClose: () => void;
  preselectedHorseId?: string;
}

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CreateTrainingPlanModal({ open, onClose, preselectedHorseId }: CreateTrainingPlanModalProps) {
  const {
    horses,
    courses,
    detailedPlans,
    isLocked,
    createHorseTrainingPlan,
    navigate,
  } = useRtms();

  const [horseId, setHorseId] = useState<string>(() => preselectedHorseId || horses[0]?.id || '');
  const [courseId, setCourseId] = useState<string>(() => courses[0]?.id || '');
  const [startDate, setStartDate] = useState<string>('2026-09-22');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);

  const selectedHorse = horses.find((h) => h.id === horseId);
  const selectedCourse = courses.find((c) => c.id === courseId);
  const locked = horseId ? isLocked(horseId) : false;
  const existingPlan = horseId ? detailedPlans[horseId] : undefined;
  const hasActivePlan = existingPlan && existingPlan.status === 'Active';

  function toggleDay(day: string) {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev; // At least one day required
        return prev.filter((d) => d !== day);
      }
      return [...prev, day];
    });
  }

  const preview = useMemo(() => {
    if (!selectedCourse || !selectedHorse) return null;
    return generateWorkoutsFromCourse(
      selectedCourse,
      startDate,
      selectedDays,
      selectedHorse.id,
      selectedHorse.name,
      'Elena Cardoso',
    );
  }, [selectedCourse, selectedHorse, startDate, selectedDays]);

  if (!open) return null;

  function handleSubmit() {
    if (!horseId || !courseId || locked) return;
    const res = createHorseTrainingPlan(horseId, courseId, startDate, selectedDays);
    if (res.success) {
      onClose();
      navigate('training', { view: 'plan', horseId });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3.5">
          <div>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)]">
              Create Training Plan from Course
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-[var(--radius-xs)] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)]"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="scroll-slim flex-1 space-y-4 overflow-y-auto p-5">
          {/* Horse Selection */}
          <Panel padded>
            <SectionTitle>1. Select Horse</SectionTitle>
            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {horses.map((h) => {
                const isHSelected = h.id === horseId;
                const hLocked = isLocked(h.id);
                const hActive = detailedPlans[h.id]?.status === 'Active';
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setHorseId(h.id)}
                    className={
                      'flex items-center gap-2.5 rounded-[var(--radius-sm)] border p-2 text-left transition-colors ' +
                      (isHSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] ring-1 ring-[var(--color-primary)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-subtle)]') +
                      (hLocked ? ' opacity-75' : '')
                    }
                  >
                    <HorseAvatar name={h.name} image={h.image} size={32} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-[12px] font-medium text-[var(--color-text-primary)]">
                          {h.name}
                        </span>
                        {hLocked && <Icon name="lock" size={11} className="text-[var(--color-danger)]" />}
                      </div>
                      <div className="truncate text-[10px] text-[var(--color-text-muted)]">
                        {hLocked ? 'Medical Lock' : hActive ? 'Active plan' : `${h.readiness} readiness`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {locked && (
              <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-2.5 text-[12px] text-[var(--color-danger)]">
                <Icon name="alert-triangle" size={14} />
                <span>
                  <strong>Training restriction active:</strong> Cannot assign a workout plan until cleared by a veterinarian.
                </span>
              </div>
            )}

            {!locked && hasActivePlan && (
              <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-warning)] bg-[var(--color-warning-soft)] p-2.5 text-[12px] text-[var(--color-warning)]">
                <Icon name="clock" size={14} />
                <span>
                  <strong>Single active plan rule:</strong> {selectedHorse?.name} currently has active plan &quot;{existingPlan.title}&quot;. Activating this course will archive the previous plan as completed.
                </span>
              </div>
            )}
          </Panel>

          {/* Course Selection */}
          <Panel padded>
            <SectionTitle>2. Select Course Curriculum</SectionTitle>
            <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {courses.map((course) => {
                const isCSelected = course.id === courseId;
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setCourseId(course.id)}
                    className={
                      'flex flex-col rounded-[var(--radius-sm)] border p-3 text-left transition-colors ' +
                      (isCSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] ring-1 ring-[var(--color-primary)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-subtle)]')
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                        {course.title}
                      </span>
                      <Pill tone="primary" size="sm">
                        {course.category}
                      </Pill>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
                      {course.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] font-medium text-[var(--color-text-muted)]">
                      <span>{course.subjects.length} ordered subjects</span>
                      <span>·</span>
                      <span>{course.targetDurationWeeks} weeks target</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Panel>

          {/* Schedule Configuration */}
          <Panel padded>
            <SectionTitle>3. Schedule & Training Days</SectionTitle>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Plan Start Date</FieldLabel>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                />
              </div>
              <div>
                <FieldLabel>Training Days of Week</FieldLabel>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {ALL_DAYS.map((d) => {
                    const active = selectedDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        className={
                          'h-8 rounded-[var(--radius-xs)] px-2.5 text-[12px] font-medium transition-colors ' +
                          (active
                            ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)]'
                            : 'border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]')
                        }
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Panel>

          {/* Workouts Auto-Generation Preview */}
          {preview && (
            <Panel padded>
              <div className="flex items-center justify-between">
                <SectionTitle>
                  Generated Workouts Preview ({preview.allSessions.length} workouts across {preview.phases.length} phases)
                </SectionTitle>
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  Mapped across: {selectedDays.join(', ')}
                </span>
              </div>
              <div className="mt-3 divide-y divide-[var(--color-border)] rounded-[var(--radius-sm)] border border-[var(--color-border)]">
                {preview.phases.map((phase) => (
                  <div key={phase.id} className="p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-[var(--color-text-primary)]">
                        {phase.name}
                      </span>
                      <span className="font-metric text-[11px] text-[var(--color-text-muted)]">
                        {phase.window}
                      </span>
                    </div>
                    <div className="mt-1.5 space-y-1">
                      {phase.sessions.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between rounded-[var(--radius-xs)] bg-[var(--color-surface-subtle)] px-2 py-1 text-[11px]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-metric font-medium text-[var(--color-primary)]">
                              {s.date}
                            </span>
                            <span className="font-medium text-[var(--color-text-primary)]">{s.session}</span>
                            <span className="text-[var(--color-text-muted)]">({s.distance} · {s.surface})</span>
                          </div>
                          <Pill
                            tone={
                              s.load === 'Peak'
                                ? 'danger'
                                : s.load === 'Hard'
                                  ? 'warning'
                                  : s.load === 'Moderate'
                                    ? 'primary'
                                    : 'info'
                            }
                            size="sm"
                          >
                            {s.load}
                          </Pill>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-3">
          <Button variant="tertiary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon="check"
            disabled={!horseId || !courseId || locked || !preview || preview.allSessions.length === 0}
            onClick={handleSubmit}
          >
            Assign Course & Generate {preview?.allSessions.length ?? 0} Workouts
          </Button>
        </div>
      </div>
    </div>
  );
}
