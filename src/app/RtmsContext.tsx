import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ToastStack, type ToastMessage } from '../components/Toast';
import { HORSES, MAX_STALLS_PER_GROOM, type Horse, type TrainingLock } from '../features/horses/horseData';
import { CARE_TASKS, type CareTask } from '../features/care/careData';
import { CANDIDATES, REQUIRED_ADMISSION_DOCUMENTS, type Candidate, type CandidateStatus, type RacingReadinessAssessment } from '../features/management/candidateData';
import { QUARANTINE_STALLS, REGULAR_STALLS } from '../features/stables/stableData';
import {
  getMedicalRecord as getStaticMedicalRecord,
  type Examination,
  type MedicalRecord,
  type TreatmentPlan,
} from '../features/veterinary/medicalData';
import {
  DEFAULT_COURSES,
  DETAILED_PLANS,
  TODAY_SESSIONS,
  TRAINING_PLAN_SUMMARIES,
  generateWorkoutsFromCourse,
  type Course,
  type CourseSubject,
  type TrainingPlan,
  type TrainingSession,
  type TrainingResult,
} from '../features/training/trainingData';
import {
  INITIAL_RACE_PROPOSALS,
  UPCOMING_RACES,
  type RaceEvent,
  type RaceProposal,
} from '../features/racing/racingData';
import {
  can as canPermission,
  canAccessModule as canModule,
  canReviewAdmissionStage,
  getNextAdmissionStage,
  getDefaultModule,
  getVisibleModules,
  AUTH_PASSWORD,
  AUTH_USERS,
  ROLE_PERMISSIONS,
  type AdmissionStage,
  type ModuleId,
  type Permission,
  type Role,
  type SessionUser,
} from './access';

export type { ModuleId } from './access';
export type { Permission, Role, SessionUser } from './access';
export type { Course, CourseSubject, TrainingPlan, TrainingSession, RaceEvent, RaceProposal };


export interface Route {
  module: ModuleId;
  /** Optional secondary view within a module, e.g. 'plan', 'record', 'candidate', 'profile'. */
  view?: string;
  horseId?: string;
  refId?: string;
}

export interface ReportedIssue {
  id: string;
  horseId: string;
  horseName: string;
  category: string;
  observation: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reportedBy: string;
  time: string;
  status: 'New' | 'Under review' | 'Resolved' | 'Pending Vet check' | 'Under treatment';
  title?: string;
  imageUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
  audienceRoles?: Role[];
  audienceUserIds?: string[];
  deepLink?: Route;
}

export interface AuditEvent {
  id: string;
  actor: string;
  role: Role;
  action: string;
  detail: string;
  time: string;
}

interface RtmsContextValue {
  route: Route;
  navigate: (module: ModuleId, extra?: Omit<Route, 'module'>) => void;

  // Session/RBAC
  isAuthenticated: boolean;
  currentUser: SessionUser;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  canAccessModule: (module: ModuleId) => boolean;
  visibleModules: ModuleId[];

  horses: Horse[];
  getHorse: (id?: string) => Horse | undefined;
  registerHorse: (horse: Horse) => void;
  getMedicalRecord: (horseId: string) => MedicalRecord;
  recordExamination: (horseId: string, examination: Examination) => void;
  saveTreatment: (horseId: string, treatment: TreatmentPlan) => void;

  // Training lock (cross-module)
  isLocked: (horseId: string) => boolean;
  getLock: (horseId: string) => TrainingLock | undefined;
  lockTraining: (horseId: string, lock: TrainingLock) => void;
  unlockTraining: (horseId: string) => void;

  // Groom care tasks & reported issues
  careTasks: CareTask[];
  completeCareTask: (taskId: string) => void;
  issues: ReportedIssue[];
  reportIssue: (issue: Omit<ReportedIssue, 'id' | 'status' | 'time'>) => void;
  updateIssueStatus: (id: string, status: ReportedIssue['status']) => void;

  // Stall & Groom assignment (Trainer management)
  stallAssignments: Record<string, string>;
  assignGroomToStall: (stallCode: string, groomName: string) => { success: boolean; message: string };

  // Candidate admission workflow
  candidateStatuses: Record<string, CandidateStatus>;
  candidates: Candidate[];
  addCandidate: (candidate: Candidate) => void;
  getCandidateStatus: (candidate: Candidate) => CandidateStatus;
  reviewGroomAdmission: (candidate: Candidate) => void;
  approveVeterinaryAdmission: (candidate: Candidate) => void;
  submitReadinessAssessment: (candidate: Candidate, assessment: RacingReadinessAssessment) => void;
  rejectCandidate: (candidate: Candidate, feedback?: string) => void;
  approveCandidate: (candidate: Candidate, stable: string, stall: string) => void;

  // Training Courses, Sessions & Logging
  courses: Course[];
  addCourse: (course: Course) => void;
  detailedPlans: Record<string, TrainingPlan>;
  trainingPlanSummaries: typeof TRAINING_PLAN_SUMMARIES;
  todaySessions: TrainingSession[];
  logWorkoutResult: (sessionId: string, result: TrainingResult) => void;
  createHorseTrainingPlan: (
    horseId: string,
    courseId: string,
    startDate: string,
    daysOfWeek: string[],
  ) => { success: boolean; message: string };

  // Racing workflow: proposals & budget approvals
  raceEvents: RaceEvent[];
  raceProposals: RaceProposal[];
  proposeRaceEntry: (
    raceId: string,
    horseId: string,
    requestedBudget: number,
    notes?: string,
  ) => { success: boolean; message: string };
  approveRaceEntry: (
    proposalId: string,
    approvedBudget: number,
    managerNotes?: string,
  ) => void;
  declineRaceEntry: (proposalId: string, reason: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  auditEvents: AuditEvent[];

  toast: (message: string, tone?: ToastMessage['tone']) => void;
}

const RtmsCtx = createContext<RtmsContextValue | null>(null);

const AUTH_STORAGE_KEY = 'rtms.auth.user';

function readStoredUserId() {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem(AUTH_STORAGE_KEY);
  } catch {
    return null;
  }
}

function nowStamp() {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RtmsProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>({ module: 'overview' });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [sessionUserId, setSessionUserId] = useState<string | null>(readStoredUserId);

  const [lockOverrides, setLockOverrides] = useState<Record<string, TrainingLock | null>>({});
  const [additionalHorses, setAdditionalHorses] = useState<Horse[]>(() =>
    CANDIDATES.filter((candidate) => candidate.horseId).map((candidate) => ({
      id: candidate.horseId!, admissionId: candidate.id, currentStatus: 'CANDIDATE' as const,
      name: candidate.name, image: candidate.image, sex: candidate.sex, breed: candidate.breed,
      foaled: candidate.dateOfBirth ?? '', ageYears: candidate.ageYears, microchip: candidate.registrationNumber ?? '', sire: candidate.sire, dam: candidate.dam,
      health: candidate.healthScreening === 'Passed' ? 'FIT' : 'MONITOR', healthNote: 'Admission Candidate in quarantine.', stable: 'Quarantine', stall: candidate.stall ?? 'Q01', owner: candidate.owner, trainer: 'Unassigned',
      training: 'DRAFT', activePlan: 'Admission assessment', phase: 'Quarantine', nextWorkout: 'Not available until eligible', readiness: 'Restricted', weightKg: 0, restingHrBpm: 0,
      schedule: [{ time: 'To be arranged', type: 'Treatment' as const, title: 'Initial admission examination', staff: 'Veterinary team' }], activity: [{ time: 'Seed record', actor: 'System', event: 'Candidate created in quarantine' }],
    })),
  );
  const [medicalRecords, setMedicalRecords] = useState<Record<string, MedicalRecord>>({});

  // Care tasks & stall assignments
  const [careTasks, setCareTasks] = useState<CareTask[]>(CARE_TASKS);
  const [stallAssignments, setStallAssignments] = useState<Record<string, string>>(() =>
    HORSES.reduce((acc, h) => {
      if (h.assignedGroom) acc[h.stall] = h.assignedGroom;
      return acc;
    }, {} as Record<string, string>),
  );

  // Training courses & plan management
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [detailedPlans, setDetailedPlans] = useState<Record<string, TrainingPlan>>(DETAILED_PLANS);
  const [trainingPlanSummaries, setTrainingPlanSummaries] = useState<typeof TRAINING_PLAN_SUMMARIES>(TRAINING_PLAN_SUMMARIES);
  const [todaySessions, setTodaySessions] = useState<TrainingSession[]>(TODAY_SESSIONS);
  const [horsePlanOverrides, setHorsePlanOverrides] = useState<Record<string, Partial<Horse>>>({});

  // Racing workflow
  const [raceEvents, setRaceEvents] = useState<RaceEvent[]>(UPCOMING_RACES);
  const [raceProposals, setRaceProposals] = useState<RaceProposal[]>(INITIAL_RACE_PROPOSALS);

  const [issues, setIssues] = useState<ReportedIssue[]>([
    {
      id: 'iss-1',
      horseId: 'h-goldenharbor',
      horseName: 'Golden Harbor',
      category: 'Digestive',
      observation: 'Left roughly half of the evening feed; mild restlessness in stall.',
      severity: 'Moderate',
      reportedBy: 'D. Okafor',
      time: '19 Sep, 21:10',
      status: 'Under review',
    },
  ]);
  const [candidateStatuses, setCandidateStatuses] = useState<Record<string, CandidateStatus>>({});
  const [candidates, setCandidates] = useState<Candidate[]>(CANDIDATES);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notification-lock',
      title: 'Training restriction active',
      detail: 'Midnight Reign is blocked pending veterinary review.',
      time: 'Today, 08:05',
      unread: true,
      audienceRoles: ['HEAD_TRAINER', 'HORSE_OWNER', 'CLUB_MANAGER'],
    },
    {
      id: 'notification-issue',
      title: 'Issue awaiting veterinary review',
      detail: 'Golden Harbor · Digestive · Moderate',
      time: '19 Sep, 21:10',
      unread: true,
      audienceRoles: ['VETERINARIAN'],
    },
  ]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([
    {
      id: 'audit-seed',
      actor: 'Dr. Amelia Haines',
      role: 'VETERINARIAN',
      action: 'Applied training lock',
      detail: 'Midnight Reign · Superficial digital flexor tendon strain',
      time: '20 Sep, 08:05',
    },
  ]);

  const currentUser = useMemo(
    () => AUTH_USERS.find((user) => user.id === sessionUserId) ?? AUTH_USERS[0],
    [sessionUserId],
  );
  const isAuthenticated = sessionUserId !== null && AUTH_USERS.some((user) => user.id === sessionUserId);
  const permissions: readonly Permission[] = isAuthenticated ? ROLE_PERMISSIONS[currentUser.role] : [];

  const toast = useCallback((message: string, tone: ToastMessage['tone'] = 'default') => {
    setToasts((items) => [...items, { id: Date.now() + Math.random(), message, tone }]);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const user = AUTH_USERS.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || password !== AUTH_PASSWORD) {
      return { success: false, message: 'Invalid email or password.' };
    }
    setSessionUserId(user.id);
    setRoute({ module: getDefaultModule(user.role) });
    try {
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, user.id);
    } catch {
      // Session storage is optional for the frontend adapter.
    }
    return { success: true, message: 'Signed in successfully.' };
  }, []);

  const logout = useCallback(() => {
    setSessionUserId(null);
    setRoute({ module: 'overview' });
    try {
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Session storage is optional for the frontend adapter.
    }
  }, []);

  const recordAudit = useCallback(
    (action: string, detail: string) => {
      setAuditEvents((events) => [
        {
          id: `audit-${Date.now()}-${Math.random()}`,
          actor: currentUser.name,
          role: currentUser.role,
          action,
          detail,
          time: nowStamp(),
        },
        ...events,
      ]);
    },
    [currentUser],
  );

  const can = useCallback(
    (permission: Permission) => isAuthenticated && canPermission(currentUser.role, permission),
    [currentUser.role, isAuthenticated],
  );
  const canAny = useCallback(
    (required: Permission[]) => isAuthenticated && required.some((permission) => permissions.includes(permission)),
    [isAuthenticated, permissions],
  );
  const canAccessModule = useCallback(
    (module: ModuleId) => isAuthenticated && canModule(currentUser.role, module),
    [currentUser.role, isAuthenticated],
  );
  const visibleModules = useMemo(() => isAuthenticated ? getVisibleModules(currentUser.role) : [], [currentUser.role, isAuthenticated]);

  const navigate = useCallback(
    (module: ModuleId, extra?: Omit<Route, 'module'>) => {
      if (!isAuthenticated) return;
      if (!canModule(currentUser.role, module)) {
        toast(
          `Access denied: ${module.replace('-', ' ')} is not available for ${currentUser.role.replace('_', ' ').toLowerCase()}.`,
          'danger',
        );
        setRoute({ module: getDefaultModule(currentUser.role) });
        return;
      }
      setRoute({ module, ...extra });
    },
    [currentUser.role, isAuthenticated, toast],
  );

  const getLock = useCallback(
    (horseId: string): TrainingLock | undefined => {
      if (horseId in lockOverrides) return lockOverrides[horseId] ?? undefined;
      return [...HORSES, ...additionalHorses].find((horse) => horse.id === horseId)?.lock;
    },
    [additionalHorses, lockOverrides],
  );

  const isLocked = useCallback((horseId: string) => !!getLock(horseId), [getLock]);

  const lockTraining = useCallback(
    (horseId: string, lock: TrainingLock) => {
      if (!canPermission(currentUser.role, 'medical.lock_training')) {
        toast('Only a veterinarian can apply a training restriction.', 'danger');
        return;
      }
      setLockOverrides((overrides) => ({ ...overrides, [horseId]: lock }));
      const horse = [...HORSES, ...additionalHorses].find((item) => item.id === horseId);
      recordAudit('Applied training lock', `${horse?.name ?? horseId} · ${lock.reason}`);
      setNotifications((items) => [
        {
          id: `notification-${Date.now()}`,
          title: 'Training restriction applied',
          detail: `${horse?.name ?? horseId} is blocked pending review.`,
          time: 'Just now',
          unread: true,
          audienceRoles: ['HEAD_TRAINER', 'HORSE_OWNER', 'CLUB_MANAGER'],
        },
        ...items,
      ]);
    },
    [additionalHorses, currentUser.role, recordAudit, toast],
  );

  const unlockTraining = useCallback(
    (horseId: string) => {
      if (!canPermission(currentUser.role, 'medical.lock_training')) {
        toast('Only a veterinarian can lift a training restriction.', 'danger');
        return;
      }
      setLockOverrides((overrides) => ({ ...overrides, [horseId]: null }));
      const horse = [...HORSES, ...additionalHorses].find((item) => item.id === horseId);
      recordAudit('Lifted training lock', horse?.name ?? horseId);
    },
    [additionalHorses, currentUser.role, recordAudit, toast],
  );

  const allHorses = useMemo(
    () =>
      [...HORSES, ...additionalHorses].map((horse) => {
        const lock = getLock(horse.id);
        const planOverride = horsePlanOverrides[horse.id];
        const groomOverride = stallAssignments[horse.stall];
        const base = { ...horse, ...planOverride };
        return {
          ...base,
          assignedGroom: groomOverride ?? base.assignedGroom,
          lock: lock ?? undefined,
          training: lock
            ? ('BLOCKED' as const)
            : base.training === 'BLOCKED'
              ? ('SCHEDULED' as const)
              : base.training,
        };
      }),
    [additionalHorses, getLock, horsePlanOverrides, stallAssignments],
  );

  // Ownership scope is enforced client-side as a first-pass row-level policy.
  const horses = useMemo(
    () =>
      currentUser.role === 'HORSE_OWNER'
        ? allHorses.filter((horse) => horse.owner === currentUser.owner)
        : allHorses,
    [allHorses, currentUser.owner, currentUser.role],
  );

  const getHorse = useCallback((id?: string) => horses.find((horse) => horse.id === id), [horses]);

  const getMedicalRecord = useCallback(
    (horseId: string) => medicalRecords[horseId] ?? getStaticMedicalRecord(horseId),
    [medicalRecords],
  );

  const recordExamination = useCallback(
    (horseId: string, examination: Examination) => {
      if (!canPermission(currentUser.role, 'medical.record')) {
        toast('Only veterinary staff can record examinations.', 'danger');
        return;
      }
      setMedicalRecords((records) => {
        const previous = records[horseId] ?? getStaticMedicalRecord(horseId);
        return { ...records, [horseId]: { ...previous, examinations: [examination, ...previous.examinations] } };
      });
      setCandidates((items) => items.map((candidate) =>
        candidate.horseId === horseId && candidate.examSchedule?.status === 'PENDING'
          ? { ...candidate, examSchedule: { ...candidate.examSchedule, status: 'COMPLETED', scheduledDate: candidate.examSchedule.scheduledDate ?? examination.date } }
          : candidate,
      ));
      recordAudit('Recorded examination', `${getHorse(horseId)?.name ?? horseId} · ${examination.diagnosis}`);
    },
    [currentUser.role, getHorse, recordAudit, toast],
  );

  const saveTreatment = useCallback(
    (horseId: string, treatment: TreatmentPlan) => {
      if (!canPermission(currentUser.role, 'medical.treatment.manage')) {
        toast('Only veterinary staff can manage treatment plans.', 'danger');
        return;
      }
      setMedicalRecords((records) => {
        const previous = records[horseId] ?? getStaticMedicalRecord(horseId);
        return { ...records, [horseId]: { ...previous, treatment } };
      });
      recordAudit('Saved treatment plan', `${getHorse(horseId)?.name ?? horseId} · ${treatment.title}`);
    },
    [currentUser.role, getHorse, recordAudit, toast],
  );

  const registerHorse = useCallback(
    (horse: Horse) => {
      if (!canPermission(currentUser.role, 'horse.create')) {
        toast('You do not have permission to register a horse.', 'danger');
        return;
      }
      setAdditionalHorses((items) => (items.some((item) => item.id === horse.id) ? items : [...items, horse]));
      recordAudit('Registered horse', horse.name);
    },
    [currentUser.role, recordAudit, toast],
  );

  const completeCareTask = useCallback(
    (taskId: string) => {
      const stamp = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      setCareTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: 'Completed' as const, completedAt: stamp } : t)),
      );
      const target = careTasks.find((t) => t.id === taskId);
      if (target) {
        recordAudit('Completed care task', `${target.horseName} · ${target.type} · Stall ${target.stall}`);
        toast(`${target.horseName} · ${target.type} completed at ${stamp}`, 'success');
      }
    },
    [careTasks, recordAudit, toast],
  );

  const assignGroomToStall = useCallback(
    (stallCode: string, groomName: string) => {
      if (!canPermission(currentUser.role, 'training.manage')) {
        toast('Only a Head Trainer can assign grooms to stalls.', 'danger');
        return { success: false, message: 'Unauthorized' };
      }

      if (groomName) {
        const assignedStallsCount = Object.entries(stallAssignments).filter(
          ([stall, groom]) => groom === groomName && stall !== stallCode,
        ).length;

        if (assignedStallsCount >= MAX_STALLS_PER_GROOM) {
          const msg = `${groomName} is already assigned to the maximum limit of ${MAX_STALLS_PER_GROOM} stalls.`;
          toast(msg, 'danger');
          return { success: false, message: msg };
        }
      }

      setStallAssignments((prev) => ({ ...prev, [stallCode]: groomName }));
      const horse = allHorses.find((h) => h.stall === stallCode);
      recordAudit('Assigned groom to stall', `Stall ${stallCode} (${horse?.name ?? 'Stall'}) → ${groomName || 'Unassigned'}`);
      toast(`Assigned ${groomName || 'Unassigned'} to Stall ${stallCode}`, 'success');
      return { success: true, message: 'Groom assigned successfully' };
    },
    [allHorses, currentUser.role, recordAudit, stallAssignments, toast],
  );

  const logWorkoutResult = useCallback(
    (sessionId: string, result: TrainingResult) => {
      if (!canPermission(currentUser.role, 'training.log') && !canPermission(currentUser.role, 'training.manage')) {
        toast('Only training staff can record workout results.', 'danger');
        return;
      }

      setTodaySessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status: 'Completed' as const, result } : s)),
      );

      const target = todaySessions.find((s) => s.id === sessionId);
      if (target) {
        recordAudit(
          'Logged workout result',
          `${target.horseName} · Max ${result.maxSpeed} km/h · ${result.rating ?? 5}★ · ${result.assessment}`,
        );
        toast(`Logged workout result for ${target.horseName}`, 'success');
      }
    },
    [currentUser.role, recordAudit, toast, todaySessions],
  );

  const reportIssue = useCallback<RtmsContextValue['reportIssue']>(
    (issue) => {
      if (!canPermission(currentUser.role, 'stable-care.report_incident')) {
        toast('You do not have permission to report stable-care issues.', 'danger');
        return;
      }
      setIssues((previous) => [
        { ...issue, id: `iss-${Date.now()}`, status: 'Pending Vet check', time: nowStamp() },
        ...previous,
      ]);
      setNotifications((items) => [
        {
          id: `notification-${Date.now()}`,
          title: issue.title || 'New stable-care incident',
          detail: `${issue.horseName} · ${issue.category} · ${issue.severity}`,
          time: 'Just now',
          unread: true,
          audienceRoles: ['VETERINARIAN'],
        },
        ...items,
      ]);
      recordAudit('Reported stable incident', `${issue.horseName} · ${issue.title || issue.category}`);
    },
    [currentUser.role, recordAudit, toast],
  );

  const updateIssueStatus = useCallback<RtmsContextValue['updateIssueStatus']>(
    (id, status) => {
      if (!canPermission(currentUser.role, 'medical.record')) {
        toast('Only veterinary staff can update medical issue status.', 'danger');
        return;
      }
      setIssues((previous) => previous.map((issue) => (issue.id === id ? { ...issue, status } : issue)));
      recordAudit('Updated issue status', `${id} · ${status}`);
    },
    [currentUser.role, recordAudit, toast],
  );

  const getCandidateStatus = useCallback(
    (candidate: Candidate) => candidateStatuses[candidate.id] ?? candidate.evaluation,
    [candidateStatuses],
  );

  const addCandidate = useCallback(
    (candidate: Candidate) => {
      if (!canPermission(currentUser.role, 'admission.submit')) {
        toast('Only a horse owner can submit an admission application.', 'danger');
        return;
      }
      if (candidate.owner !== currentUser.owner || REQUIRED_ADMISSION_DOCUMENTS.some((type) => !candidate.documents?.some((document) => document.type === type))) {
        toast('The owner identity and all four required admission documents are required.', 'danger');
        return;
      }
      setCandidates((items) => [...items, { ...candidate, evaluation: 'GROOM_REVIEW' }]);
      recordAudit('Submitted candidate intake', candidate.name);
    },
    [currentUser.role, recordAudit, toast],
  );

  const reviewGroomAdmission = useCallback((candidate: Candidate) => {
    if (!canPermission(currentUser.role, 'admission.review.groom') || !['GROOM_REVIEW', 'WAITING_FOR_STALL'].includes(getCandidateStatus(candidate)) || REQUIRED_ADMISSION_DOCUMENTS.some((type) => !candidate.documents?.some((document) => document.type === type))) {
      toast('This admission is not awaiting Groom review.', 'danger'); return;
    }
    const occupied = new Set([...additionalHorses, ...HORSES].filter((horse) => horse.currentStatus === 'CANDIDATE').map((horse) => horse.stall));
    const stall = QUARANTINE_STALLS.find((slot) => !occupied.has(slot.stall));
    const regularAvailable = REGULAR_STALLS.filter((slot) => ![...additionalHorses, ...HORSES].some((horse) => horse.stable === slot.stable && horse.stall === slot.stall)).length;
    const candidateCount = [...additionalHorses, ...HORSES].filter((horse) => horse.currentStatus === 'CANDIDATE').length;
    if (!stall || regularAvailable < candidateCount + 1) { setCandidateStatuses((s) => ({ ...s, [candidate.id]: 'WAITING_FOR_STALL' })); toast('No capacity is available for this admission. It remains waiting for a stall.', 'warning'); return; }
    const horseId = candidate.horseId ?? `h-admission-${candidate.id.replace('cand-', '')}`;
    const horse: Horse = {
      id: horseId, admissionId: candidate.id, currentStatus: 'CANDIDATE', name: candidate.name, image: candidate.image,
      sex: candidate.sex, breed: candidate.breed, foaled: candidate.dateOfBirth ?? '', ageYears: candidate.ageYears,
      microchip: candidate.registrationNumber ?? '', sire: candidate.sire, dam: candidate.dam, health: 'MONITOR', healthNote: 'In quarantine pending initial veterinary examination.',
      stable: stall.stable, stall: stall.stall, owner: candidate.owner, trainer: 'Unassigned', training: 'DRAFT', activePlan: 'Admission assessment', phase: 'Quarantine', nextWorkout: 'Not available until eligible', readiness: 'Restricted', weightKg: 0, restingHrBpm: 0,
      schedule: [{ time: 'To be arranged', type: 'Treatment', title: 'Initial admission examination', staff: 'Veterinary team' }],
      activity: [{ time: nowStamp(), actor: currentUser.name, event: 'Created as Candidate and placed in quarantine' }],
    };
    setAdditionalHorses((items) => items.some((item) => item.id === horseId) ? items : [...items, horse]);
    setMedicalRecords((records) => records[horseId] ? records : ({ ...records, [horseId]: { horseId, examinations: [] } }));
    setCandidates((items) => items.map((item) => item.id === candidate.id ? { ...item, horseId, stable: stall.stable, stall: stall.stall, examSchedule: { id: `initial-exam-${candidate.id}`, status: 'PENDING', description: 'Initial admission examination in quarantine' } } : item));
    setCandidateStatuses((s) => ({ ...s, [candidate.id]: 'VET_REVIEW' }));
    recordAudit('Groom accepted admission', `${candidate.name} · Candidate created in Quarantine ${stall.stall}`);
    toast(`${candidate.name} is a Candidate in Quarantine ${stall.stall}; initial exam sent to Veterinary.`, 'success');
  }, [additionalHorses, currentUser.name, getCandidateStatus, recordAudit, toast]);

  const approveVeterinaryAdmission = useCallback((candidate: Candidate) => {
    if (!canPermission(currentUser.role, 'admission.review.vet') || getCandidateStatus(candidate) !== 'VET_REVIEW') { toast('This admission is not awaiting Veterinary review.', 'danger'); return; }
    if (!candidate.horseId || candidate.examSchedule?.status !== 'COMPLETED') { toast('Record the initial examination before approving this admission.', 'warning'); return; }
    setCandidateStatuses((s) => ({ ...s, [candidate.id]: 'TRAINER_REVIEW' }));
    setCandidates((items) => items.map((item) => item.id === candidate.id ? { ...item, healthScreening: 'Passed', vetFeedback: 'Initial examination completed and accepted.' } : item));
    recordAudit('Veterinary admission review accepted', `${candidate.name} → TRAINER_REVIEW`);
  }, [currentUser.role, getCandidateStatus, recordAudit, toast]);

  const submitReadinessAssessment = useCallback((candidate: Candidate, assessment: RacingReadinessAssessment) => {
    if (!canPermission(currentUser.role, 'admission.assess.trainer') || getCandidateStatus(candidate) !== 'TRAINER_REVIEW') { toast('This admission is not awaiting a Trainer assessment.', 'danger'); return; }
    setCandidates((items) => items.map((item) => item.id === candidate.id ? { ...item, readinessAssessment: assessment } : item));
    setCandidateStatuses((s) => ({ ...s, [candidate.id]: 'MANAGER_REVIEW' }));
    recordAudit('Recorded racing readiness assessment', `${candidate.name} → MANAGER_REVIEW`);
    toast(`${candidate.name}'s assessment was sent to the Manager.`, 'success');
  }, [currentUser.role, getCandidateStatus, recordAudit, toast]);

  const rejectCandidate = useCallback((candidate: Candidate, feedback?: string) => {
    const stage = getCandidateStatus(candidate);
    const canReject = (stage === 'GROOM_REVIEW' || stage === 'WAITING_FOR_STALL') && canPermission(currentUser.role, 'admission.review.groom') || stage === 'VET_REVIEW' && canPermission(currentUser.role, 'admission.review.vet') || stage === 'MANAGER_REVIEW' && canPermission(currentUser.role, 'admission.approve');
    if (!canReject) { toast('This admission is waiting for the assigned reviewer.', 'danger'); return; }
    setCandidateStatuses((s) => ({ ...s, [candidate.id]: 'REJECTED' }));
    setCandidates((items) => items.map((item) => item.id === candidate.id ? { ...item, managerFeedback: feedback ?? 'Admission rejected.' } : item));
    if (candidate.horseId) setAdditionalHorses((items) => items.map((horse) => horse.id === candidate.horseId ? { ...horse, currentStatus: 'REJECTED', stable: '—', stall: '—' } : horse));
    recordAudit('Rejected admission application', candidate.name);
  }, [currentUser.role, getCandidateStatus, recordAudit, toast]);

  const approveCandidate = useCallback(
    (candidate: Candidate, stable: string, stall: string) => {
      if (!canPermission(currentUser.role, 'admission.approve') || getCandidateStatus(candidate) !== 'MANAGER_REVIEW') {
        toast('Only the Club Manager can approve an application in Manager final review.', 'danger');
        return;
      }
      if (!candidate.horseId || !candidate.readinessAssessment) { toast('A Candidate horse and racing readiness assessment are required before final approval.', 'danger'); return; }
      if (!REGULAR_STALLS.some((slot) => slot.stable === stable && slot.stall === stall) || [...HORSES, ...additionalHorses].some((horse) => horse.stable === stable && horse.stall === stall && horse.id !== candidate.horseId)) { toast('Choose an available regular stable slot.', 'danger'); return; }
      setCandidateStatuses((statuses) => ({ ...statuses, [candidate.id]: 'APPROVED' }));
      setCandidates((items) => items.map((item) => item.id === candidate.id ? { ...item, stable, stall, managerFeedback: 'Approved for eligible status and regular housing.' } : item));
      setAdditionalHorses((items) => items.map((horse) => horse.id === candidate.horseId ? { ...horse, currentStatus: 'ELIGIBLE', stable, stall, health: 'FIT', healthNote: 'Eligible after admission approval.', trainer: candidate.readinessAssessment?.trainer ?? horse.trainer, training: 'DRAFT', readiness: candidate.readinessAssessment?.status === 'READY' ? 'Ready' : 'Building', phase: 'Admission complete', nextWorkout: 'Trainer to assign plan', activity: [{ time: nowStamp(), actor: currentUser.name, event: `Approved as eligible and assigned ${stable} ${stall}` }, ...horse.activity] } : horse));
      recordAudit('Approved candidate', `${candidate.name} · eligible in ${stable} ${stall}`);
    },
    [currentUser, getCandidateStatus, recordAudit, toast],
  );

  const visibleCandidates = useMemo(
    () => currentUser.role === 'HORSE_OWNER' ? candidates.filter((candidate) => candidate.owner === currentUser.owner) : candidates,
    [candidates, currentUser.owner, currentUser.role],
  );

  const addCourse = useCallback((course: Course) => {
    if (!canPermission(currentUser.role, 'training.manage')) {
      toast('Only a Head Trainer can create training courses.', 'danger');
      return;
    }
    setCourses((prev) => [course, ...prev]);
    recordAudit('Created course template', `${course.title} (${course.category})`);
    toast(`Course "${course.title}" added to catalog`, 'success');
  }, [currentUser.role, recordAudit, toast]);

  const createHorseTrainingPlan = useCallback(
    (horseId: string, courseId: string, startDate: string, daysOfWeek: string[]) => {
      if (!canPermission(currentUser.role, 'training.manage')) {
        toast('Only a Head Trainer can create training plans.', 'danger');
        return { success: false, message: 'Unauthorized' };
      }
      const horse = allHorses.find((h) => h.id === horseId);
      if (!horse) return { success: false, message: 'Horse not found' };
      if (horse.currentStatus && horse.currentStatus !== 'ELIGIBLE') {
        toast('A Candidate horse cannot begin training before Manager eligibility approval.', 'danger');
        return { success: false, message: 'Horse is not eligible' };
      }
      if (getLock(horseId)) {
        toast('Cannot assign a training plan while a veterinary restriction is active.', 'danger');
        return { success: false, message: 'Horse is under medical restriction' };
      }
      const course = courses.find((c) => c.id === courseId);
      if (!course) return { success: false, message: 'Course not found' };

      // Invariant: At most 1 active training plan per horse.
      const previousPlan = detailedPlans[horseId];
      if (previousPlan && previousPlan.status === 'Active') {
        recordAudit('Superseded training plan', `${horse.name} · Completed previous plan "${previousPlan.title}" for new course`);
      }

      const { phases, allSessions } = generateWorkoutsFromCourse(
        course,
        startDate,
        daysOfWeek,
        horseId,
        horse.name,
        currentUser.name,
      );

      const targetDate = allSessions[allSessions.length - 1]?.date ?? 'TBD';

      const newPlan: TrainingPlan = {
        id: `pl-${horseId}-${Date.now()}`,
        horseId,
        title: course.title,
        goal: `${course.title} campaign (${course.targetDurationWeeks} weeks)`,
        trainer: currentUser.name,
        start: startDate,
        target: targetDate,
        status: 'Active',
        progress: 0,
        phases,
      };

      setDetailedPlans((prev) => ({ ...prev, [horseId]: newPlan }));

      setTrainingPlanSummaries((prev) => {
        const filtered = prev.filter((p) => p.horseId !== horseId);
        return [
          {
            id: newPlan.id,
            horseId,
            title: newPlan.title,
            phase: phases[0]?.name ?? 'Foundation',
            trainer: currentUser.name,
            progress: 0,
            sessions: `0 / ${allSessions.length}`,
            target: targetDate,
          },
          ...filtered,
        ];
      });

      // Update horse status to ACTIVE
      setHorsePlanOverrides((prev) => ({
        ...prev,
        [horseId]: {
          training: 'ACTIVE',
          activePlan: course.title,
          phase: phases[0]?.name ?? 'Foundation',
          readiness: 'Building',
          nextWorkout: allSessions[0] ? `${allSessions[0].date} · ${allSessions[0].session}` : undefined,
        },
      }));

      // Add to today's sessions
      setTodaySessions((prev) => [
        ...allSessions.filter((s) => s.date === '20 Sep' || s.date === '22 Sep'),
        ...prev.filter((s) => s.horseId !== horseId),
      ]);

      recordAudit('Assigned training course', `${horse.name} · ${course.title} (${allSessions.length} workouts generated)`);
      toast(`Assigned "${course.title}" to ${horse.name} — ${allSessions.length} workouts generated`, 'success');
      return { success: true, message: 'Plan created' };
    },
    [allHorses, courses, currentUser.name, currentUser.role, detailedPlans, getLock, recordAudit, toast],
  );

  const proposeRaceEntry = useCallback(
    (raceId: string, horseId: string, requestedBudget: number, notes?: string) => {
      if (!canPermission(currentUser.role, 'race.propose')) {
        toast('Only a Head Trainer can submit race entry proposals.', 'danger');
        return { success: false, message: 'Unauthorized' };
      }
      const horse = allHorses.find((h) => h.id === horseId);
      if (!horse) return { success: false, message: 'Horse not found' };
      if (getLock(horseId)) {
        toast('Ineligible: Horse has an active training restriction.', 'danger');
        return { success: false, message: 'Training restriction active' };
      }
      if (horse.health === 'INJURED' || horse.health === 'ISOLATED') {
        toast(`Ineligible: Horse health status is ${horse.health}.`, 'danger');
        return { success: false, message: 'Health status prevents racing' };
      }
      const race = raceEvents.find((r) => r.id === raceId);
      if (!race) return { success: false, message: 'Race not found' };

      const proposal: RaceProposal = {
        id: `prop-${Date.now()}`,
        raceId,
        raceName: race.name,
        horseId,
        horseName: horse.name,
        proposedBy: currentUser.name,
        proposedDate: nowStamp(),
        requestedBudget,
        status: 'PENDING',
        notes,
      };

      setRaceProposals((prev) => [proposal, ...prev]);
      setNotifications((prev) => [
        {
          id: `notification-race-${Date.now()}`,
          title: 'New race proposal awaiting approval',
          detail: `${horse.name} · ${race.name} · Budget: £${requestedBudget.toLocaleString()}`,
          time: 'Just now',
          unread: true,
          audienceRoles: ['CLUB_MANAGER'],
        },
        ...prev,
      ]);
      recordAudit('Proposed race entry', `${horse.name} · ${race.name} (Budget: £${requestedBudget.toLocaleString()})`);
      toast(`Proposed ${horse.name} for ${race.name} — pending Club Manager approval`, 'success');
      return { success: true, message: 'Proposal submitted' };
    },
    [allHorses, currentUser.name, currentUser.role, getLock, raceEvents, recordAudit, toast],
  );

  const approveRaceEntry = useCallback(
    (proposalId: string, approvedBudget: number, managerNotes?: string) => {
      if (!canPermission(currentUser.role, 'race.approve')) {
        toast('Only an authorized Club Manager or Horse Owner can approve race registration and budget.', 'danger');
        return;
      }
      const proposal = raceProposals.find((p) => p.id === proposalId);
      if (!proposal) return;

      const actorLabel = currentUser.role === 'HORSE_OWNER' ? 'Owner' : 'Club Manager';

      setRaceProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId
            ? { ...p, status: 'APPROVED', approvedBudget, managerNotes: managerNotes || `Approved by ${actorLabel}` }
            : p,
        ),
      );

      // Add to race entries in raceEvents
      setRaceEvents((prev) =>
        prev.map((event) => {
          if (event.id === proposal.raceId) {
            const alreadyEntered = event.entries.some((e) => e.horseId === proposal.horseId);
            if (alreadyEntered) return event;
            return {
              ...event,
              entries: [
                ...event.entries,
                {
                  horseId: proposal.horseId,
                  horseName: proposal.horseName,
                  jockey: 'TBD',
                  draw: event.entries.length + 1,
                  weightKg: 56,
                },
              ],
            };
          }
          return event;
        }),
      );

      recordAudit('Approved race entry & budget', `${proposal.horseName} · ${proposal.raceName} (Approved by ${actorLabel}: £${approvedBudget.toLocaleString()})`);
      toast(`Approved race entry for ${proposal.horseName} (£${approvedBudget.toLocaleString()} budget authorised)`, 'success');
    },
    [currentUser.role, raceProposals, recordAudit, toast],
  );

  const declineRaceEntry = useCallback(
    (proposalId: string, reason: string) => {
      if (!canPermission(currentUser.role, 'race.approve')) {
        toast('Only an authorized Club Manager or Horse Owner can decline race registration proposals.', 'danger');
        return;
      }
      const proposal = raceProposals.find((p) => p.id === proposalId);
      if (!proposal) return;

      const actorLabel = currentUser.role === 'HORSE_OWNER' ? 'Owner' : 'Club Manager';

      setRaceProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId
            ? { ...p, status: 'DECLINED', managerNotes: reason || `Declined by ${actorLabel}` }
            : p,
        ),
      );

      recordAudit('Declined race entry', `${proposal.horseName} · ${proposal.raceName} (${reason})`);
      toast(`Declined entry nomination for ${proposal.horseName}`, 'warning');
    },
    [currentUser.role, raceProposals, recordAudit, toast],
  );

  const visibleNotifications = useMemo(
    () => notifications.filter((item) => !item.audienceRoles || item.audienceRoles.includes(currentUser.role))
      .filter((item) => !item.audienceUserIds || item.audienceUserIds.includes(currentUser.id)),
    [currentUser.id, currentUser.role, notifications],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((items) => items.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const value: RtmsContextValue = {
    route,
    navigate,
    isAuthenticated,
    currentUser,
    login,
    logout,
    can,
    canAny,
    canAccessModule,
    visibleModules,
    horses,
    getHorse,
    registerHorse,
    getMedicalRecord,
    recordExamination,
    saveTreatment,
    isLocked,
    getLock,
    lockTraining,
    unlockTraining,
    issues,
    reportIssue,
    updateIssueStatus,
    careTasks,
    completeCareTask,
    stallAssignments,
    assignGroomToStall,
    candidateStatuses,
    candidates: visibleCandidates,
    addCandidate,
    getCandidateStatus,
    reviewGroomAdmission,
    approveVeterinaryAdmission,
    submitReadinessAssessment,
    rejectCandidate,
    approveCandidate,
    courses,
    addCourse,
    detailedPlans,
    trainingPlanSummaries,
    todaySessions,
    logWorkoutResult,
    createHorseTrainingPlan,
    raceEvents,
    raceProposals,
    proposeRaceEntry,
    approveRaceEntry,
    declineRaceEntry,
    notifications: visibleNotifications,
    markNotificationRead,
    auditEvents,
    toast,
  };

  return (
    <RtmsCtx.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </RtmsCtx.Provider>
  );
}

export function useRtms() {
  const ctx = useContext(RtmsCtx);
  if (!ctx) throw new Error('useRtms must be used within RtmsProvider');
  return ctx;
}
