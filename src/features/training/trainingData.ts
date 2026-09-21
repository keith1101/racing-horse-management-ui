export type SessionStatus = 'Completed' | 'In progress' | 'Scheduled' | 'Cancelled';
export type SessionIntensity = 'Recovery' | 'Light' | 'Moderate' | 'Hard' | 'Peak';

export interface TrainingSession {
  id: string;
  time: string; // today's schedule time
  date: string; // ISO-ish display date for plan tables
  horseId: string;
  horseName: string;
  session: string;
  distance: string;
  surface: 'Turf' | 'Dirt' | 'All-weather' | 'Pool' | '—';
  load: SessionIntensity;
  intensity: number; // 0-100 planned effort
  trainer: string;
  status: SessionStatus;
  result?: TrainingResult;
}

export interface TrainingResult {
  avgSpeed: number; // km/h
  maxSpeed: number;
  avgHr: number; // bpm
  maxHr: number;
  recoveryMin: number; // minutes to return to resting band
  assessment: 'Excellent' | 'On target' | 'Below target' | 'Fatigued';
  notes: string;
}

export interface TrainingPhase {
  id: string;
  name: string;
  focus: string;
  window: string;
  status: 'Completed' | 'Active' | 'Upcoming';
  sessions: TrainingSession[];
}

export interface TrainingPlan {
  id: string;
  horseId: string;
  title: string;
  goal: string;
  trainer: string;
  start: string;
  target: string;
  status: 'Draft' | 'Active' | 'On hold' | 'Completed';
  progress: number; // 0-100
  phases: TrainingPhase[];
}

/** Today's training schedule (Head Trainer dashboard). */
export const TODAY_SESSIONS: TrainingSession[] = [
  { id: 'ts-1', time: '06:00', date: '20 Sep', horseId: 'h-silvercomet', horseName: 'Silver Comet', session: 'Breeze', distance: '1,000 m', surface: 'All-weather', load: 'Hard', intensity: 82, trainer: 'Tomas Reyes', status: 'Completed', result: { avgSpeed: 47.4, maxSpeed: 51.8, avgHr: 178, maxHr: 214, recoveryMin: 11, assessment: 'Excellent', notes: 'Strong closing sectional, relaxed through the bridle.' } },
  { id: 'ts-2', time: '06:15', date: '20 Sep', horseId: 'h-ironwill', horseName: 'Iron Will', session: 'Steady gallop', distance: '2,000 m', surface: 'Turf', load: 'Moderate', intensity: 58, trainer: 'Tomas Reyes', status: 'Completed', result: { avgSpeed: 39.1, maxSpeed: 44.0, avgHr: 171, maxHr: 199, recoveryMin: 19, assessment: 'Below target', notes: 'Recovery HR slower than baseline — flagged for telemetry review.' } },
  { id: 'ts-3', time: '06:30', date: '20 Sep', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', session: 'Gallop', distance: '1,400 m', surface: 'Turf', load: 'Hard', intensity: 78, trainer: 'Elena Cardoso', status: 'In progress' },
  { id: 'ts-4', time: '06:45', date: '20 Sep', horseId: 'h-royalcadence', horseName: 'Royal Cadence', session: 'Gallop', distance: '1,200 m', surface: 'Turf', load: 'Moderate', intensity: 64, trainer: 'Elena Cardoso', status: 'Scheduled' },
  { id: 'ts-5', time: '07:00', date: '20 Sep', horseId: 'h-shadowdancer', horseName: 'Shadow Dancer', session: 'Distance gallop', distance: '1,600 m', surface: 'Turf', load: 'Moderate', intensity: 60, trainer: 'Elena Cardoso', status: 'Scheduled' },
  { id: 'ts-6', time: '07:30', date: '20 Sep', horseId: 'h-emberqueen', horseName: 'Ember Queen', session: 'Canter', distance: '800 m', surface: 'All-weather', load: 'Light', intensity: 42, trainer: 'Elena Cardoso', status: 'Scheduled' },
  { id: 'ts-7', time: '07:15', date: '23 Sep', horseId: 'h-goldenharbor', horseName: 'Golden Harbor', session: 'Return-to-work trot', distance: '600 m', surface: 'All-weather', load: 'Recovery', intensity: 28, trainer: 'Tomas Reyes', status: 'Scheduled' },
];

export interface ReadinessRow {
  horseId: string;
  horseName: string;
  image: string;
  readiness: 'Ready' | 'Building' | 'Restricted' | 'Resting';
  score: number; // 0-100
  lastLoad: SessionIntensity;
  trend: 'up' | 'down' | 'flat';
  note: string;
}

/** Active training plans summary. */
export const TRAINING_PLAN_SUMMARIES = [
  { id: 'pl-thunderbolt', horseId: 'h-thunderbolt', title: 'Spring Classic Prep', phase: 'Race preparation', trainer: 'Elena Cardoso', progress: 72, sessions: '18 / 25', target: '05 Oct 2026' },
  { id: 'pl-silvercomet', horseId: 'h-silvercomet', title: 'Sprint Series', phase: 'Race preparation', trainer: 'Tomas Reyes', progress: 64, sessions: '14 / 22', target: '28 Sep 2026' },
  { id: 'pl-shadowdancer', horseId: 'h-shadowdancer', title: 'Distance Series', phase: 'Conditioning', trainer: 'Elena Cardoso', progress: 48, sessions: '12 / 25', target: '19 Oct 2026' },
  { id: 'pl-royalcadence', horseId: 'h-royalcadence', title: 'Mile Campaign', phase: 'Conditioning', trainer: 'Elena Cardoso', progress: 40, sessions: '9 / 23', target: '26 Oct 2026' },
  { id: 'pl-ironwill', horseId: 'h-ironwill', title: 'Stamina Block', phase: 'Conditioning', trainer: 'Tomas Reyes', progress: 55, sessions: '13 / 24', target: '12 Oct 2026' },
  { id: 'pl-goldenharbor', horseId: 'h-goldenharbor', title: 'Return to Work', phase: 'Foundation', trainer: 'Tomas Reyes', progress: 15, sessions: '3 / 20', target: '02 Nov 2026' },
  { id: 'pl-northernstar', horseId: 'h-northernstar', title: 'Intake Assessment', phase: 'Draft plan', trainer: 'Tomas Reyes', progress: 0, sessions: '0 / 18', target: 'Pending review' },
];

/** Detailed plan (used by the Training Plan screen). */
export const DETAILED_PLANS: Record<string, TrainingPlan> = {
  'h-thunderbolt': {
    id: 'pl-thunderbolt',
    horseId: 'h-thunderbolt',
    title: 'Spring Classic Prep',
    goal: 'Peak for the Riverside Spring Classic (1,600 m, Turf) on 05 Oct.',
    trainer: 'Elena Cardoso',
    start: '04 Aug 2026',
    target: '05 Oct 2026',
    status: 'Active',
    progress: 72,
    phases: [
      {
        id: 'ph-1', name: 'Foundation', focus: 'Aerobic base & soundness', window: '04 – 24 Aug', status: 'Completed',
        sessions: [
          { id: 'tb-1', time: '', date: '06 Aug', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', session: 'Long trot', distance: '3,000 m', surface: 'All-weather', load: 'Light', intensity: 40, trainer: 'Elena Cardoso', status: 'Completed', result: { avgSpeed: 22.0, maxSpeed: 28.5, avgHr: 132, maxHr: 158, recoveryMin: 8, assessment: 'On target', notes: 'Settled base workout.' } },
          { id: 'tb-2', time: '', date: '13 Aug', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', session: 'Steady canter', distance: '2,400 m', surface: 'Turf', load: 'Moderate', intensity: 55, trainer: 'Elena Cardoso', status: 'Completed', result: { avgSpeed: 33.4, maxSpeed: 39.0, avgHr: 156, maxHr: 182, recoveryMin: 12, assessment: 'On target', notes: 'Good rhythm, comfortable action.' } },
        ],
      },
      {
        id: 'ph-2', name: 'Conditioning', focus: 'Stamina & cardiovascular load', window: '25 Aug – 14 Sep', status: 'Completed',
        sessions: [
          { id: 'tb-3', time: '', date: '30 Aug', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', session: 'Gallop', distance: '1,800 m', surface: 'Turf', load: 'Moderate', intensity: 62, trainer: 'Elena Cardoso', status: 'Completed', result: { avgSpeed: 41.2, maxSpeed: 46.8, avgHr: 168, maxHr: 196, recoveryMin: 14, assessment: 'On target', notes: 'Building cleanly.' } },
          { id: 'tb-4', time: '', date: '10 Sep', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', session: 'Interval gallop', distance: '2 × 1,000 m', surface: 'All-weather', load: 'Hard', intensity: 76, trainer: 'Elena Cardoso', status: 'Completed', result: { avgSpeed: 45.0, maxSpeed: 50.1, avgHr: 181, maxHr: 209, recoveryMin: 13, assessment: 'Excellent', notes: 'Repeated efforts held speed well.' } },
        ],
      },
      {
        id: 'ph-3', name: 'Speed development', focus: 'Sprint mechanics & top-end', window: '15 – 28 Sep', status: 'Active',
        sessions: [
          { id: 'tb-5', time: '', date: '17 Sep', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', session: 'Breeze', distance: '1,000 m', surface: 'All-weather', load: 'Hard', intensity: 80, trainer: 'Elena Cardoso', status: 'Completed', result: { avgSpeed: 48.6, maxSpeed: 52.9, avgHr: 184, maxHr: 216, recoveryMin: 11, assessment: 'Excellent', notes: 'Sharp, balanced, quick recovery.' } },
          { id: 'tb-6', time: '06:30', date: '20 Sep', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', session: 'Gallop', distance: '1,400 m', surface: 'Turf', load: 'Hard', intensity: 78, trainer: 'Elena Cardoso', status: 'In progress' },
          { id: 'tb-7', time: '', date: '25 Sep', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', session: 'Breeze', distance: '1,200 m', surface: 'Turf', load: 'Peak', intensity: 88, trainer: 'Elena Cardoso', status: 'Scheduled' },
        ],
      },
      {
        id: 'ph-4', name: 'Race preparation', focus: 'Sharpening & taper', window: '29 Sep – 05 Oct', status: 'Upcoming',
        sessions: [
          { id: 'tb-8', time: '', date: '02 Oct', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', session: 'Sharpener', distance: '800 m', surface: 'Turf', load: 'Hard', intensity: 74, trainer: 'Elena Cardoso', status: 'Scheduled' },
          { id: 'tb-9', time: '', date: '04 Oct', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', session: 'Light stretch', distance: '1,000 m', surface: 'Turf', load: 'Light', intensity: 35, trainer: 'Elena Cardoso', status: 'Scheduled' },
        ],
      },
    ],
  },
};

export const PHASE_LIBRARY = ['Foundation', 'Conditioning', 'Speed development', 'Race preparation', 'Recovery'];

export interface CourseSubject {
  id: string;
  order: number;
  title: string;
  sessionType: string;
  distance: string;
  surface: 'Turf' | 'Dirt' | 'All-weather' | 'Pool';
  load: SessionIntensity;
  intensity: number;
  phaseName: string;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  category: 'Sprint' | 'Classic' | 'Distance' | 'Foundation' | 'Rehabilitation';
  targetDurationWeeks: number;
  description: string;
  subjects: CourseSubject[];
}

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'crs-sprint',
    title: 'Sprint Campaign Preparation',
    category: 'Sprint',
    targetDurationWeeks: 4,
    description: 'Designed for sprint specialists (1,000m – 1,200m). Sharpens explosive sectional speed, barrier gate exit, and rapid recovery.',
    subjects: [
      { id: 'cs-sp-1', order: 1, title: 'Aerobic Trot & Warm-up', sessionType: 'Trot', distance: '2,000 m', surface: 'All-weather', load: 'Light', intensity: 35, phaseName: 'Foundation', description: 'Base cardiovascular warm-up with loose rein.' },
      { id: 'cs-sp-2', order: 2, title: 'Steady Bridle Canter', sessionType: 'Canter', distance: '1,400 m', surface: 'Turf', load: 'Moderate', intensity: 55, phaseName: 'Foundation', description: 'Even cadence work around turns.' },
      { id: 'cs-sp-3', order: 3, title: 'Pace Work & Split Timing', sessionType: 'Gallop', distance: '1,000 m', surface: 'Turf', load: 'Moderate', intensity: 65, phaseName: 'Conditioning', description: 'Tracking intermediate sectional pace.' },
      { id: 'cs-sp-4', order: 4, title: 'Speed Breeze & Sectional', sessionType: 'Breeze', distance: '800 m', surface: 'All-weather', load: 'Hard', intensity: 82, phaseName: 'Speed development', description: 'Sharp acceleration in last 400m.' },
      { id: 'cs-sp-5', order: 5, title: 'Barrier Exit & Top End Breeze', sessionType: 'Breeze', distance: '1,000 m', surface: 'Turf', load: 'Peak', intensity: 90, phaseName: 'Speed development', description: 'Simulated gate jump and quick sprint.' },
      { id: 'cs-sp-6', order: 6, title: 'Pre-Race Sharpener & Taper', sessionType: 'Sharpener', distance: '600 m', surface: 'Turf', load: 'Light', intensity: 45, phaseName: 'Race preparation', description: 'Easy stride-out to maintain alertness.' },
    ],
  },
  {
    id: 'crs-classic',
    title: 'Classic Mile Campaign',
    category: 'Classic',
    targetDurationWeeks: 6,
    description: 'Premier preparation for 1,600m Group races. Balances aerobic stamina block, progressive galloping, and split-second top-turn speed.',
    subjects: [
      { id: 'cs-cl-1', order: 1, title: 'Long Aerobic Trot', sessionType: 'Trot', distance: '3,000 m', surface: 'All-weather', load: 'Light', intensity: 38, phaseName: 'Foundation', description: 'Steady lung and tendon preparation.' },
      { id: 'cs-cl-2', order: 2, title: 'Steady Cadence Canter', sessionType: 'Canter', distance: '2,200 m', surface: 'Turf', load: 'Moderate', intensity: 52, phaseName: 'Foundation', description: 'Rhythmic ground-covering stride.' },
      { id: 'cs-cl-3', order: 3, title: 'Distance Stamina Gallop', sessionType: 'Gallop', distance: '1,800 m', surface: 'Turf', load: 'Moderate', intensity: 64, phaseName: 'Conditioning', description: 'Aerobic threshold gallop.' },
      { id: 'cs-cl-4', order: 4, title: 'Interval Repetitions', sessionType: 'Intervals', distance: '2 × 1,000 m', surface: 'All-weather', load: 'Hard', intensity: 75, phaseName: 'Conditioning', description: 'Two fast repeats with 4 min active walk.' },
      { id: 'cs-cl-5', order: 5, title: 'Race Pace Gallop', sessionType: 'Gallop', distance: '1,400 m', surface: 'Turf', load: 'Hard', intensity: 80, phaseName: 'Speed development', description: 'Closing sectional drill under hands-and-heels.' },
      { id: 'cs-cl-6', order: 6, title: 'Target Breeze', sessionType: 'Breeze', distance: '1,200 m', surface: 'Turf', load: 'Peak', intensity: 88, phaseName: 'Speed development', description: 'Full match pace simulation.' },
      { id: 'cs-cl-7', order: 7, title: 'Pre-Race Sharpener', sessionType: 'Sharpener', distance: '800 m', surface: 'Turf', load: 'Moderate', intensity: 60, phaseName: 'Race preparation', description: 'Taper workout 4 days out from race.' },
      { id: 'cs-cl-8', order: 8, title: 'Light Bridle Stretch', sessionType: 'Canter', distance: '1,000 m', surface: 'Turf', load: 'Recovery', intensity: 30, phaseName: 'Race preparation', description: 'Final limbering and mental calm.' },
    ],
  },
  {
    id: 'crs-foundation',
    title: 'Maiden Foundation & Soundness',
    category: 'Foundation',
    targetDurationWeeks: 4,
    description: 'Comprehensive baseline program for young horses and newcomers to build musculoskeletal durability and track discipline.',
    subjects: [
      { id: 'cs-fd-1', order: 1, title: 'Track Introduction & Long Trot', sessionType: 'Trot', distance: '2,400 m', surface: 'All-weather', load: 'Light', intensity: 32, phaseName: 'Foundation', description: 'Familiarisation with rails and surfaces.' },
      { id: 'cs-fd-2', order: 2, title: 'Balanced Canter in Company', sessionType: 'Canter', distance: '1,600 m', surface: 'All-weather', load: 'Moderate', intensity: 48, phaseName: 'Foundation', description: 'Following a lead horse at relaxed pace.' },
      { id: 'cs-fd-3', order: 3, title: 'Even Pace Gallop', sessionType: 'Gallop', distance: '1,200 m', surface: 'Turf', load: 'Moderate', intensity: 60, phaseName: 'Conditioning', description: 'Learning straight-line discipline.' },
      { id: 'cs-fd-4', order: 4, title: 'Steady Breezing Trial', sessionType: 'Breeze', distance: '800 m', surface: 'Turf', load: 'Hard', intensity: 74, phaseName: 'Conditioning', description: 'Testing readiness and bridle response.' },
      { id: 'cs-fd-5', order: 5, title: 'Cooling Stretch & Assessment', sessionType: 'Canter', distance: '1,000 m', surface: 'Turf', load: 'Recovery', intensity: 28, phaseName: 'Recovery', description: 'Trainer evaluation and gait confirmation.' },
    ],
  },
  {
    id: 'crs-rehab',
    title: 'Post-Rest Reconditioning Program',
    category: 'Rehabilitation',
    targetDurationWeeks: 3,
    description: 'Carefully measured return-to-work program for horses cleared by veterinary staff after injury lock or box rest.',
    subjects: [
      { id: 'cs-rh-1', order: 1, title: 'Hand-Walk & Arena Trot', sessionType: 'Trot', distance: '1,200 m', surface: 'All-weather', load: 'Recovery', intensity: 22, phaseName: 'Recovery', description: 'Soundness check and low-impact limbering.' },
      { id: 'cs-rh-2', order: 2, title: 'Controlled Long Trot', sessionType: 'Trot', distance: '2,000 m', surface: 'All-weather', load: 'Light', intensity: 35, phaseName: 'Recovery', description: 'Checking for heat and stride asymmetry.' },
      { id: 'cs-rh-3', order: 3, title: 'Gentle Bridle Canter', sessionType: 'Canter', distance: '1,000 m', surface: 'Turf', load: 'Light', intensity: 42, phaseName: 'Foundation', description: 'Gradual increase in heart rate.' },
      { id: 'cs-rh-4', order: 4, title: 'Steady Re-entry Canter', sessionType: 'Canter', distance: '1,400 m', surface: 'Turf', load: 'Moderate', intensity: 52, phaseName: 'Foundation', description: 'Soundness clearance trial for full training.' },
    ],
  },
];

const DAY_INDICES: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function generateWorkoutsFromCourse(
  course: Course,
  startDateStr: string,
  daysOfWeek: string[],
  horseId: string,
  horseName: string,
  trainer: string,
): { phases: TrainingPhase[]; allSessions: TrainingSession[] } {
  const chosenDays = daysOfWeek
    .map((d) => DAY_INDICES[d])
    .filter((idx): idx is number => idx !== undefined)
    .sort((a, b) => a - b);

  if (chosenDays.length === 0) chosenDays.push(1, 3, 5); // Default Mon, Wed, Fri

  const baseDate = new Date(startDateStr || '2026-09-22');
  if (isNaN(baseDate.getTime())) baseDate.setTime(new Date('2026-09-22').getTime());

  const sessions: TrainingSession[] = [];
  const phaseMap = new Map<string, TrainingSession[]>();

  let currentDate = new Date(baseDate);
  let subjectIdx = 0;

  // Walk forward finding matching days of week until all course subjects are scheduled
  while (subjectIdx < course.subjects.length) {
    const dayOfWeek = currentDate.getDay();
    if (chosenDays.includes(dayOfWeek)) {
      const subject = course.subjects[subjectIdx];
      const dateDisplay = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const timeDisplay = '06:30';

      const session: TrainingSession = {
        id: `gen-${horseId}-${subject.id}-${Date.now()}-${subjectIdx}`,
        time: timeDisplay,
        date: dateDisplay,
        horseId,
        horseName,
        session: subject.title,
        distance: subject.distance,
        surface: subject.surface,
        load: subject.load,
        intensity: subject.intensity,
        trainer,
        status: subjectIdx === 0 ? 'Scheduled' : 'Scheduled',
      };

      sessions.push(session);
      if (!phaseMap.has(subject.phaseName)) {
        phaseMap.set(subject.phaseName, []);
      }
      phaseMap.get(subject.phaseName)!.push(session);
      subjectIdx++;
    }
    // Next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Convert phaseMap to TrainingPhase[]
  let phaseIdx = 1;
  const phases: TrainingPhase[] = Array.from(phaseMap.entries()).map(([name, phaseSessions]) => {
    const firstDate = phaseSessions[0]?.date ?? '';
    const lastDate = phaseSessions[phaseSessions.length - 1]?.date ?? '';
    const window = firstDate === lastDate ? firstDate : `${firstDate} – ${lastDate}`;
    return {
      id: `ph-${course.id}-${phaseIdx++}`,
      name,
      focus: `${course.title} · ${name}`,
      window,
      status: phaseIdx === 2 ? 'Active' : 'Upcoming',
      sessions: phaseSessions,
    };
  });

  return { phases, allSessions: sessions };
}
