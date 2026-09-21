export type ModuleId =
  | 'overview'
  | 'horses'
  | 'training'
  | 'veterinary'
  | 'stable-care'
  | 'racing'
  | 'management';

export type Role = 'HEAD_TRAINER' | 'VETERINARIAN' | 'GROOM' | 'HORSE_OWNER' | 'CLUB_MANAGER';

export type Permission =
  | 'module.overview.view'
  | 'module.horses.view'
  | 'module.training.view'
  | 'module.veterinary.view'
  | 'module.stable-care.view'
  | 'module.racing.view'
  | 'module.management.view'
  | 'horse.view'
  | 'horse.create'
  | 'horse.export'
  | 'horse.documents.view'
  | 'admission.view'
  | 'admission.submit'
  | 'admission.resubmit'
  | 'admission.review.groom'
  | 'admission.review.vet'
  | 'admission.review.trainer'
  | 'admission.approve'
  | 'admission.request_info'
  | 'training.view'
  | 'training.manage'
  | 'training.log'
  | 'medical.summary.view'
  | 'medical.private.view'
  | 'medical.record'
  | 'medical.treatment.manage'
  | 'medical.preventive.manage'
  | 'medical.lock_training'
  | 'stable-care.view'
  | 'stable-care.execute'
  | 'stable-care.report_incident'
  | 'stable-care.manage'
  | 'race.view'
  | 'race.propose'
  | 'race.approve'
  | 'contract.view'
  | 'invoice.view'
  | 'finance.view'
  | 'management.summary.view'
  | 'contract.manage'
  | 'invoice.manage'
  | 'access.manage'
  | 'audit.view';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  initials: string;
  role: Role;
  roleLabel: string;
  owner?: string;
}

export const ROLE_LABELS: Record<Role, string> = {
  HEAD_TRAINER: 'Head Trainer',
  VETERINARIAN: 'Veterinarian',
  GROOM: 'Groom',
  HORSE_OWNER: 'Horse Owner',
  CLUB_MANAGER: 'Club Manager',
};

export const AUTH_USERS: SessionUser[] = [
  { id: 'user-trainer', email: 'elena.cardoso@riversidertms.com', name: 'Elena Cardoso', initials: 'EC', role: 'HEAD_TRAINER', roleLabel: ROLE_LABELS.HEAD_TRAINER },
  { id: 'user-vet', email: 'amelia.haines@riversidertms.com', name: 'Dr. Amelia Haines', initials: 'AH', role: 'VETERINARIAN', roleLabel: ROLE_LABELS.VETERINARIAN },
  { id: 'user-groom', email: 'damilola.okafor@riversidertms.com', name: 'Damilola Okafor', initials: 'DO', role: 'GROOM', roleLabel: ROLE_LABELS.GROOM },
  { id: 'user-owner', email: 'owner@marloweracing.com', name: 'Marlowe Racing Ltd.', initials: 'MR', role: 'HORSE_OWNER', roleLabel: ROLE_LABELS.HORSE_OWNER, owner: 'Marlowe Racing Ltd.' },
  { id: 'user-manager', email: 'sofia.bennett@riversidertms.com', name: 'Sofia Bennett', initials: 'SB', role: 'CLUB_MANAGER', roleLabel: ROLE_LABELS.CLUB_MANAGER },
];

/** Frontend-only credential used by the local authentication adapter. */
export const AUTH_PASSWORD = 'rtms2026';

export const PERMISSION_LABELS: Record<Permission, string> = {
  'module.overview.view': 'View overview',
  'module.horses.view': 'Open Horse Management',
  'module.training.view': 'Open Training Management',
  'module.veterinary.view': 'Open Medical & Health',
  'module.stable-care.view': 'Open Stable & Daily Care',
  'module.racing.view': 'Open Racing',
  'module.management.view': 'Open Admissions & Management',
  'horse.view': 'View official horse profiles',
  'horse.create': 'Create official Horse after approval',
  'horse.export': 'Export horse register',
  'horse.documents.view': 'View ownership documents',
  'admission.view': 'View admission applications',
  'admission.submit': 'Submit admission application',
  'admission.resubmit': 'Resubmit requested admission information',
  'admission.review.groom': 'Complete Groom admission review',
  'admission.review.vet': 'Complete Veterinarian admission review',
  'admission.review.trainer': 'Complete Trainer admission review',
  'admission.approve': 'Approve final admission and create Horse',
  'admission.request_info': 'Request admission information',
  'training.view': 'View training plans and results',
  'training.manage': 'Create and maintain training plans',
  'training.log': 'Complete workouts and record results',
  'medical.summary.view': 'View health summary and restrictions',
  'medical.private.view': 'View clinical notes and medication details',
  'medical.record': 'Record examination and diagnosis',
  'medical.treatment.manage': 'Manage treatment and prescriptions',
  'medical.preventive.manage': 'Manage preventive care',
  'medical.lock_training': 'Apply or lift training restriction',
  'stable-care.view': 'View stable care operations',
  'stable-care.execute': 'Execute assigned care tasks',
  'stable-care.report_incident': 'Submit stable incident report',
  'stable-care.manage': 'Assign and manage stable tasks',
  'race.view': 'View races and race history',
  'race.propose': 'Propose horse race registration',
  'race.approve': 'Approve race registration and budget',
  'contract.view': 'View owner-horse contracts',
  'contract.manage': 'Manage owner-horse contracts',
  'invoice.view': 'View invoices and billing summary',
  'invoice.manage': 'Manage invoices and billing',
  'finance.view': 'View financial summary',
  'management.summary.view': 'View club management summary',
  'access.manage': 'Manage roles and permissions',
  'audit.view': 'View immutable audit log',
};

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  HEAD_TRAINER: [
    'module.overview.view',
    'module.horses.view',
    'module.training.view',
    'module.racing.view',
    'module.management.view',
    'horse.view',
    'horse.export',
    'admission.view',
    'admission.review.trainer',
    'admission.request_info',
    'training.view',
    'training.manage',
    'training.log',
    'medical.summary.view',
    'race.view',
    'race.propose',
  ],
  VETERINARIAN: [
    'module.overview.view',
    'module.horses.view',
    'module.veterinary.view',
    'module.management.view',
    'horse.view',
    'admission.view',
    'admission.review.vet',
    'admission.request_info',
    'medical.summary.view',
    'medical.private.view',
    'medical.record',
    'medical.treatment.manage',
    'medical.preventive.manage',
    'medical.lock_training',
  ],
  GROOM: [
    'module.overview.view',
    'module.horses.view',
    'module.veterinary.view',
    'module.stable-care.view',
    'module.management.view',
    'horse.view',
    'admission.view',
    'admission.review.groom',
    'admission.request_info',
    'medical.summary.view',
    'stable-care.view',
    'stable-care.execute',
    'stable-care.report_incident',
  ],
  HORSE_OWNER: [
    'module.overview.view',
    'module.horses.view',
    'module.training.view',
    'module.racing.view',
    'module.management.view',
    'horse.view',
    'horse.documents.view',
    'admission.view',
    'admission.submit',
    'admission.resubmit',
    'training.view',
    'medical.summary.view',
    'race.view',
    'contract.view',
    'invoice.view',
    'finance.view',
  ],
  CLUB_MANAGER: [
    'module.overview.view',
    'module.horses.view',
    'module.racing.view',
    'module.management.view',
    'horse.view',
    'horse.create',
    'horse.export',
    'horse.documents.view',
    'admission.view',
    'admission.approve',
    'admission.request_info',
    'training.view',
    'medical.summary.view',
    'race.view',
    'race.approve',
    'contract.view',
    'contract.manage',
    'invoice.view',
    'invoice.manage',
    'finance.view',
    'management.summary.view',
    'access.manage',
    'audit.view',
  ],
};

const modulePermission: Record<ModuleId, Permission> = {
  overview: 'module.overview.view',
  horses: 'module.horses.view',
  training: 'module.training.view',
  veterinary: 'module.veterinary.view',
  'stable-care': 'module.stable-care.view',
  racing: 'module.racing.view',
  management: 'module.management.view',
};

export function can(role: Role, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function canAny(role: Role, permissions: Permission[]) {
  return permissions.some((permission) => can(role, permission));
}

export function canAccessModule(role: Role, module: ModuleId) {
  return can(role, modulePermission[module]);
}

export function getVisibleModules(role: Role): ModuleId[] {
  return (Object.keys(modulePermission) as ModuleId[]).filter((module) => canAccessModule(role, module));
}

export function getDefaultModule(role: Role): ModuleId {
  return getVisibleModules(role)[0] ?? 'overview';
}

export function getModulePermission(module: ModuleId) {
  return modulePermission[module];
}

export type AdmissionStage =
  | 'SUBMITTED'
  | 'GROOM_REVIEW'
  | 'WAITING_FOR_STALL'
  | 'VET_REVIEW'
  | 'TRAINER_REVIEW'
  | 'MANAGER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ADDITIONAL_INFORMATION_REQUIRED';

export const ADMISSION_STAGE_LABELS: Record<AdmissionStage, string> = {
  SUBMITTED: 'Submitted',
  GROOM_REVIEW: 'Groom review',
  WAITING_FOR_STALL: 'Waiting for stall assignment',
  VET_REVIEW: 'Veterinarian review',
  TRAINER_REVIEW: 'Head Trainer review',
  MANAGER_REVIEW: 'Manager final review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ADDITIONAL_INFORMATION_REQUIRED: 'Information required',
};

export const ADMISSION_REVIEW_PERMISSIONS: Record<Exclude<AdmissionStage, 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'ADDITIONAL_INFORMATION_REQUIRED'>, Permission> = {
  GROOM_REVIEW: 'admission.review.groom',
  WAITING_FOR_STALL: 'admission.review.groom',
  VET_REVIEW: 'admission.review.vet',
  TRAINER_REVIEW: 'admission.review.trainer',
  MANAGER_REVIEW: 'admission.approve',
};

export function canReviewAdmissionStage(role: Role, stage: AdmissionStage) {
  const permission = ADMISSION_REVIEW_PERMISSIONS[stage as keyof typeof ADMISSION_REVIEW_PERMISSIONS];
  return permission ? can(role, permission) : false;
}

export function getNextAdmissionStage(stage: AdmissionStage): AdmissionStage | undefined {
  if (stage === 'SUBMITTED' || stage === 'ADDITIONAL_INFORMATION_REQUIRED') return 'GROOM_REVIEW';
  if (stage === 'GROOM_REVIEW' || stage === 'WAITING_FOR_STALL') return 'VET_REVIEW';
  if (stage === 'VET_REVIEW') return 'TRAINER_REVIEW';
  if (stage === 'TRAINER_REVIEW') return 'MANAGER_REVIEW';
  if (stage === 'MANAGER_REVIEW') return 'APPROVED';
  return undefined;
}

export function getRaceEligibility(horse: { health: string; readiness: string; id: string }, locked: boolean) {
  if (locked) return 'Training restriction is active';
  if (horse.health === 'ISOLATED') return 'Isolation/quarantine is active';
  if (horse.health === 'INJURED') return 'Medical clearance is required';
  if (horse.readiness === 'Restricted') return 'Readiness is restricted';
  if (horse.readiness === 'Resting') return 'Horse is resting';
  return undefined;
}
