import { useState } from 'react';
import { useRtms } from '../../app/RtmsContext';
import { Drawer } from '../../components/Drawer';
import { Button } from '../../components/Button';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import type { Course, CourseSubject } from './trainingData';

interface CourseCatalogDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectCourse?: (courseId: string) => void;
}

const inputStyles =
  'mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30';

export function CourseCatalogDrawer({ open, onClose, onSelectCourse }: CourseCatalogDrawerProps) {
  const { courses, addCourse, can } = useRtms();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [creating, setCreating] = useState(false);

  // New course form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Course['category']>('Classic');
  const [newDuration, setNewDuration] = useState('4');
  const [newDesc, setNewDesc] = useState('');

  // Subjects for new course
  const [subjects, setSubjects] = useState<Omit<CourseSubject, 'id' | 'order'>[]>([
    {
      title: 'Base Aerobic Trot',
      sessionType: 'Trot',
      distance: '2,000 m',
      surface: 'All-weather',
      load: 'Light',
      intensity: 35,
      phaseName: 'Foundation',
      description: 'Aerobic warmup and stride rhythm',
    },
    {
      title: 'Progressive Canter',
      sessionType: 'Canter',
      distance: '1,600 m',
      surface: 'Turf',
      load: 'Moderate',
      intensity: 55,
      phaseName: 'Foundation',
      description: 'Controlled pacing around bend',
    },
    {
      title: 'Match Gallop',
      sessionType: 'Gallop',
      distance: '1,200 m',
      surface: 'Turf',
      load: 'Hard',
      intensity: 75,
      phaseName: 'Conditioning',
      description: 'Closing sectional acceleration',
    },
  ]);

  const activeCourse = courses.find((c) => c.id === selectedCourseId) ?? courses[0];
  const canManage = can('training.manage');

  function handleSaveCourse() {
    if (!newTitle.trim()) return;
    const course: Course = {
      id: `crs-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetDurationWeeks: Number(newDuration) || 4,
      description: newDesc.trim() || 'Custom training course created by head trainer.',
      subjects: subjects.map((s, idx) => ({
        ...s,
        id: `cs-${Date.now()}-${idx}`,
        order: idx + 1,
      })),
    };
    addCourse(course);
    setSelectedCourseId(course.id);
    setCreating(false);
    setNewTitle('');
    setNewDesc('');
  }

  function addSubjectRow() {
    setSubjects((prev) => [
      ...prev,
      {
        title: 'New Workout Subject',
        sessionType: 'Gallop',
        distance: '1,400 m',
        surface: 'Turf',
        load: 'Moderate',
        intensity: 60,
        phaseName: 'Conditioning',
        description: 'Workout description',
      },
    ]);
  }

  function removeSubject(index: number) {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Training Courses Catalog"
      subtitle="Standardized curricula and ordered course subjects used to generate horse workout plans."
      footer={
        <div className="flex w-full items-center justify-between">
          <Button variant="tertiary" onClick={onClose}>
            Close
          </Button>
          {onSelectCourse && activeCourse && (
            <Button
              variant="primary"
              icon="check"
              onClick={() => {
                onSelectCourse(activeCourse.id);
                onClose();
              }}
            >
              Use &quot;{activeCourse.title}&quot;
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Toggle Create Form */}
        {canManage && (
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <span className="text-[12px] text-[var(--color-text-secondary)]">
              {courses.length} courses in library
            </span>
            <Button
              variant={creating ? 'secondary' : 'primary'}
              size="sm"
              icon={creating ? 'x' : 'plus'}
              onClick={() => setCreating((v) => !v)}
            >
              {creating ? 'Cancel New Course' : 'Create New Course'}
            </Button>
          </div>
        )}

        {creating ? (
          /* Create New Course Form */
          <div className="space-y-3.5 rounded-[var(--radius-md)] border border-[var(--color-primary)] bg-[var(--color-primary-subtle)]/30 p-3.5">
            <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">
              Define New Course Template
            </div>
            <div>
              <FieldLabel>Course Title</FieldLabel>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Classic Distance Stamina 2,000m"
                className={inputStyles}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Category</FieldLabel>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Course['category'])}
                  className={inputStyles}
                >
                  <option value="Sprint">Sprint</option>
                  <option value="Classic">Classic</option>
                  <option value="Distance">Distance</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Rehabilitation">Rehabilitation</option>
                </select>
              </div>
              <div>
                <FieldLabel>Duration (Weeks)</FieldLabel>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className={inputStyles}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Description & Tactical Goal</FieldLabel>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe target distance, workout objectives, and biomechanical focus..."
                rows={2}
                className="mt-1 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-2 text-[12px] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              />
            </div>

            {/* Subjects List */}
            <div className="space-y-2 border-t border-[var(--color-border)] pt-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[var(--color-text-primary)]">
                  Ordered Course Subjects ({subjects.length})
                </span>
                <button
                  type="button"
                  onClick={addSubjectRow}
                  className="flex items-center gap-1 text-[11px] font-medium text-[var(--color-primary)] hover:underline"
                >
                  <Icon name="plus" size={12} /> Add Subject
                </button>
              </div>

              {subjects.map((sub, idx) => (
                <div
                  key={idx}
                  className="space-y-1.5 rounded-[var(--radius-xs)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-metric text-[11px] font-semibold text-[var(--color-primary)]">
                      Subject #{idx + 1}
                    </span>
                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubject(idx)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
                      >
                        <Icon name="x" size={13} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={sub.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSubjects((p) => p.map((s, i) => (i === idx ? { ...s, title: val } : s)));
                      }}
                      placeholder="Title"
                      className="h-8 rounded-[var(--radius-xs)] border border-[var(--color-border)] px-2 text-[12px]"
                    />
                    <select
                      value={sub.phaseName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSubjects((p) => p.map((s, i) => (i === idx ? { ...s, phaseName: val } : s)));
                      }}
                      className="h-8 rounded-[var(--radius-xs)] border border-[var(--color-border)] px-2 text-[12px]"
                    >
                      <option value="Foundation">Foundation</option>
                      <option value="Conditioning">Conditioning</option>
                      <option value="Speed development">Speed development</option>
                      <option value="Race preparation">Race preparation</option>
                      <option value="Recovery">Recovery</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <input
                      value={sub.distance}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSubjects((p) => p.map((s, i) => (i === idx ? { ...s, distance: val } : s)));
                      }}
                      placeholder="e.g. 1,400 m"
                      className="h-7 rounded-[var(--radius-xs)] border border-[var(--color-border)] px-2"
                    />
                    <select
                      value={sub.load}
                      onChange={(e) => {
                        const val = e.target.value as CourseSubject['load'];
                        setSubjects((p) => p.map((s, i) => (i === idx ? { ...s, load: val } : s)));
                      }}
                      className="h-7 rounded-[var(--radius-xs)] border border-[var(--color-border)] px-1"
                    >
                      <option value="Recovery">Recovery</option>
                      <option value="Light">Light</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Hard">Hard</option>
                      <option value="Peak">Peak</option>
                    </select>
                    <select
                      value={sub.surface}
                      onChange={(e) => {
                        const val = e.target.value as CourseSubject['surface'];
                        setSubjects((p) => p.map((s, i) => (i === idx ? { ...s, surface: val } : s)));
                      }}
                      className="h-7 rounded-[var(--radius-xs)] border border-[var(--color-border)] px-1"
                    >
                      <option value="Turf">Turf</option>
                      <option value="Dirt">Dirt</option>
                      <option value="All-weather">All-weather</option>
                      <option value="Pool">Pool</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="primary" size="sm" icon="check" onClick={handleSaveCourse} disabled={!newTitle.trim()}>
              Save Course to Library
            </Button>
          </div>
        ) : (
          /* Course Tabs & Detailed View */
          <>
            <div className="flex flex-wrap gap-1 border-b border-[var(--color-border)] pb-2">
              {courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourseId(c.id)}
                  className={
                    'rounded-[var(--radius-xs)] px-2.5 py-1 text-[12px] font-medium transition-colors ' +
                    (c.id === selectedCourseId
                      ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)]'
                      : 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]')
                  }
                >
                  {c.title}
                </button>
              ))}
            </div>

            {activeCourse && (
              <div className="space-y-3">
                <Panel padded>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
                        {activeCourse.title}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                        <Pill tone="primary" size="sm">
                          {activeCourse.category}
                        </Pill>
                        <span>·</span>
                        <span>{activeCourse.targetDurationWeeks} weeks duration</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                    {activeCourse.description}
                  </p>
                </Panel>

                <Panel padded>
                  <SectionTitle>Course Subjects ({activeCourse.subjects.length} ordered sessions)</SectionTitle>
                  <div className="mt-2.5 space-y-2">
                    {activeCourse.subjects.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-surface-muted)] font-metric text-[11px] font-semibold text-[var(--color-text-primary)]">
                              {s.order}
                            </span>
                            <span className="text-[13px] font-medium text-[var(--color-text-primary)]">
                              {s.title}
                            </span>
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
                        <p className="mt-1 text-[11px] text-[var(--color-text-secondary)]">
                          {s.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
                          <span>{s.phaseName} phase</span>
                          <span>·</span>
                          <span className="font-metric">{s.distance}</span>
                          <span>·</span>
                          <span>{s.surface}</span>
                          <span>·</span>
                          <span className="font-metric">{s.intensity}% effort</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            )}
          </>
        )}
      </div>
    </Drawer>
  );
}

