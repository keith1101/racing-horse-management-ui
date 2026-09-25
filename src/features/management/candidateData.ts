/** Canonical lifecycle from the admission workflow in the business notes. */
export type CandidateStatus =
  | 'GROOM_REVIEW'
  | 'WAITING_FOR_STALL'
  | 'VET_REVIEW'
  | 'TRAINER_REVIEW'
  | 'MANAGER_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export const ADMISSION_DOCUMENT_TYPES = [
  'HORSE_PHOTO',
  'REGISTRATION_DOCUMENT',
  'PEDIGREE_CERTIFICATE',
  'VACCINATION_RECORD',
  'DEWORMING_RECORD',
  'HEALTH_CERTIFICATE',
  'PREVIOUS_MEDICAL_RECORD',
  'PREVIOUS_INJURY_RECORD',
] as const;

export type AdmissionDocumentType = (typeof ADMISSION_DOCUMENT_TYPES)[number];

export const REQUIRED_ADMISSION_DOCUMENTS: readonly AdmissionDocumentType[] = [
  'HORSE_PHOTO',
  'REGISTRATION_DOCUMENT',
  'PEDIGREE_CERTIFICATE',
  'VACCINATION_RECORD',
];

export const ADMISSION_DOCUMENT_LABELS: Record<AdmissionDocumentType, string> = {
  HORSE_PHOTO: 'Horse photo',
  REGISTRATION_DOCUMENT: 'Registration document',
  PEDIGREE_CERTIFICATE: 'Pedigree certificate',
  VACCINATION_RECORD: 'Vaccination record',
  DEWORMING_RECORD: 'Deworming record',
  HEALTH_CERTIFICATE: 'Health certificate',
  PREVIOUS_MEDICAL_RECORD: 'Previous medical record',
  PREVIOUS_INJURY_RECORD: 'Previous injury record',
};

export interface AdmissionDocument {
  id: string;
  type: AdmissionDocumentType;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  file?: File;
}

export interface AdmissionExamSchedule {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  scheduledDate?: string;
  description: string;
}

export interface RacingReadinessAssessment {
  status: 'READY' | 'NEEDS_MORE_TRAINING' | 'UNSUITABLE';
  conformationScore?: number;
  temperamentScore?: number;
  gaitQualityScore?: number;
  estimatedMonthsToRace?: number;
  remarks: string;
  assessedAt: string;
  trainer: string;
}

export type VerificationStatus = 'Verified' | 'Unverified' | 'Verification pending' | 'Registry unavailable';

export interface EvaluationItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  image: string;
  owner: string;
  breed: string;
  sex: 'Colt' | 'Filly' | 'Gelding' | 'Mare' | 'Stallion';
  ageYears: number;
  sire: string;
  dam: string;
  pedigreeVerification: VerificationStatus;
  healthScreening: 'Passed' | 'Pending' | 'Concerns noted' | 'Not started';
  evaluation: CandidateStatus;
  submitted: string;
  performanceNote: string;
  checklist: EvaluationItem[];
  /** Owner's immutable intake snapshot in the develop backend. */
  dateOfBirth?: string;
  registrationNumber?: string;
  registryName?: string;
  sireRegistrationNumber?: string;
  damRegistrationNumber?: string;
  pedigreeNotes?: string;
  documents?: AdmissionDocument[];
  /** Linked Horse exists only after Groom approval and quarantine placement. */
  horseId?: string;
  examSchedule?: AdmissionExamSchedule;
  readinessAssessment?: RacingReadinessAssessment;
  groomFeedback?: string;
  vetFeedback?: string;
  managerFeedback?: string;
  /** Quarantine assignment after Groom approval; regular assignment after Manager approval. */
  stable?: string;
  stall?: string;
}

function sampleDocuments(id: string): AdmissionDocument[] {
  return REQUIRED_ADMISSION_DOCUMENTS.map((type) => ({
    id: `${id}-${type.toLowerCase()}`,
    type,
    fileName: `${type.toLowerCase()}.${type === 'HORSE_PHOTO' ? 'jpg' : 'pdf'}`,
    mimeType: type === 'HORSE_PHOTO' ? 'image/jpeg' : 'application/pdf',
    size: 0,
    uploadedAt: 'Sample record',
  }));
}

export const CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Coastal Sovereign',
    dateOfBirth: '2023-04-16', registrationNumber: 'GB2023000000001', registryName: 'Stud Book',
    documents: sampleDocuments('cand-1'), horseId: 'h-admission-1', stable: 'Quarantine', stall: 'Q01',
    examSchedule: { id: 'initial-exam-1', status: 'PENDING', description: 'Initial admission examination in quarantine' },
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    owner: 'Marlowe Racing Ltd.',
    breed: 'Thoroughbred',
    sex: 'Colt',
    ageYears: 3,
    sire: 'Storm Cat’s Legacy',
    dam: 'Coastal Breeze',
    pedigreeVerification: 'Verified',
    healthScreening: 'Pending',
    evaluation: 'VET_REVIEW',
    submitted: '16 Sep 2026',
    performanceNote: 'Two barrier trials, both promising; strong sectional in the second.',
    checklist: [
      { id: 'e1', label: 'Identity and registration checked', done: true },
      { id: 'e2', label: 'Pedigree verified with registry', done: true },
      { id: 'e3', label: 'Veterinary initial examination', done: false },
      { id: 'e4', label: 'Conformation assessment', done: false },
      { id: 'e5', label: 'Racing readiness assessment created', done: false },
    ],
  },
  {
    id: 'cand-2',
    name: 'Amber Ridge',
    dateOfBirth: '2024-03-12', registrationNumber: 'GB2024000000002', registryName: 'Stud Book',
    documents: sampleDocuments('cand-2'),
    image: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    owner: 'Ashgrove Stud',
    breed: 'Thoroughbred',
    sex: 'Filly',
    ageYears: 2,
    sire: 'Firebrand',
    dam: 'Ridgeline',
    pedigreeVerification: 'Verification pending',
    healthScreening: 'Pending',
    evaluation: 'GROOM_REVIEW',
    submitted: '19 Sep 2026',
    performanceNote: 'Unraced. Sold as yearling; strong female family.',
    checklist: [
      { id: 'e1', label: 'Identity and registration checked', done: true },
      { id: 'e2', label: 'Pedigree verified with registry', done: false },
      { id: 'e3', label: 'Veterinary initial examination', done: false },
      { id: 'e4', label: 'Conformation assessment', done: false },
      { id: 'e5', label: 'Racing readiness assessment created', done: false },
    ],
  },
  {
    id: 'cand-3',
    name: 'Granite Star',
    dateOfBirth: '2022-05-18', registrationNumber: 'GB2022000000003', registryName: 'Stud Book',
    documents: sampleDocuments('cand-3'), horseId: 'h-admission-3', stable: 'Quarantine', stall: 'Q02',
    examSchedule: { id: 'initial-exam-3', status: 'COMPLETED', description: 'Initial admission examination in quarantine' },
    image: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    owner: 'Hollowbrook Partners',
    breed: 'Thoroughbred',
    sex: 'Gelding',
    ageYears: 4,
    sire: 'Ironclad',
    dam: 'Stardust Lane',
    pedigreeVerification: 'Verified',
    healthScreening: 'Concerns noted',
    evaluation: 'TRAINER_REVIEW',
    submitted: '11 Sep 2026',
    performanceNote: 'Placed twice from six starts; old splint noted on near fore.',
    checklist: [
      { id: 'e1', label: 'Identity and registration checked', done: true },
      { id: 'e2', label: 'Pedigree verified with registry', done: true },
      { id: 'e3', label: 'Veterinary initial examination', done: true },
      { id: 'e4', label: 'Conformation assessment', done: true },
      { id: 'e5', label: 'Racing readiness assessment created', done: false },
    ],
  },
  {
    id: 'cand-4',
    name: 'Velvet Horizon',
    dateOfBirth: '2021-02-02', registrationNumber: 'AR2021000000004', registryName: 'Arabian Horse Registry',
    documents: sampleDocuments('cand-4'),
    image: 'https://images.unsplash.com/photo-1511994714008-b6d68a8b32a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    owner: 'Crescent Bloodstock',
    breed: 'Arabian',
    sex: 'Mare',
    ageYears: 5,
    sire: 'Sahara Wind',
    dam: 'Velvet Dune',
    pedigreeVerification: 'Registry unavailable',
    healthScreening: 'Not started',
    evaluation: 'GROOM_REVIEW',
    submitted: '20 Sep 2026',
    performanceNote: 'Endurance background; registry lookup returned no match.',
    checklist: [
      { id: 'e1', label: 'Identity and registration checked', done: false },
      { id: 'e2', label: 'Pedigree verified with registry', done: false },
      { id: 'e3', label: 'Veterinary initial examination', done: false },
      { id: 'e4', label: 'Conformation assessment', done: false },
      { id: 'e5', label: 'Racing readiness assessment created', done: false },
    ],
  },
  {
    id: 'cand-5',
    name: 'Northern Ember',
    dateOfBirth: '2023-04-08', registrationNumber: 'GB2023000000005', registryName: 'Stud Book',
    documents: sampleDocuments('cand-5'), horseId: 'h-admission-5', stable: 'Quarantine', stall: 'Q03',
    examSchedule: { id: 'initial-exam-5', status: 'COMPLETED', description: 'Initial admission examination in quarantine' },
    readinessAssessment: { status: 'READY', conformationScore: 8, temperamentScore: 8, gaitQualityScore: 9, estimatedMonthsToRace: 1, remarks: 'Suitable for progressive race preparation.', assessedAt: '20 Sep 2026', trainer: 'Elena Cardoso' },
    image: 'https://images.unsplash.com/photo-1566251037378-5e04e3bec343?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    owner: 'Marlowe Racing Ltd.',
    breed: 'Thoroughbred', sex: 'Filly', ageYears: 3, sire: 'Northern Dancer II', dam: 'Ember Sky',
    pedigreeVerification: 'Verified', healthScreening: 'Passed', evaluation: 'MANAGER_REVIEW', submitted: '14 Sep 2026',
    performanceNote: 'Ready for final club acceptance after passing all operational reviews.',
    checklist: [
      { id: 'e1', label: 'Identity and registration checked', done: true }, { id: 'e2', label: 'Pedigree verified with registry', done: true },
      { id: 'e3', label: 'Veterinary initial examination', done: true }, { id: 'e4', label: 'Conformation assessment', done: true }, { id: 'e5', label: 'Racing readiness assessment created', done: true },
    ],
  },
  {
    id: 'cand-6',
    name: 'Harbour Light',
    dateOfBirth: '2022-06-04', registrationNumber: 'GB2022000000006', registryName: 'Stud Book',
    documents: sampleDocuments('cand-6'),
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    owner: 'Marlowe Racing Ltd.',
    breed: 'Thoroughbred', sex: 'Gelding', ageYears: 4, sire: 'Harbour Master', dam: 'Light Years',
    pedigreeVerification: 'Verified', healthScreening: 'Pending', evaluation: 'WAITING_FOR_STALL', submitted: '20 Sep 2026',
    performanceNote: 'Groom intake is complete; a suitable stall is required before veterinary screening.',
    checklist: [
      { id: 'e1', label: 'Identity and registration checked', done: true }, { id: 'e2', label: 'Pedigree verified with registry', done: true },
      { id: 'e3', label: 'Veterinary initial examination', done: false }, { id: 'e4', label: 'Conformation assessment', done: false }, { id: 'e5', label: 'Racing readiness assessment created', done: false },
    ],
  },
  {
    id: 'cand-7',
    name: 'Marlowe Comet',
    dateOfBirth: '2024-05-09', registrationNumber: 'GB2024000000007', registryName: 'Stud Book',
    documents: sampleDocuments('cand-7'),
    image: 'https://images.unsplash.com/photo-1534567110243-8875d64ca8ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    owner: 'Marlowe Racing Ltd.', breed: 'Thoroughbred', sex: 'Colt', ageYears: 2, sire: 'Stellar Path', dam: 'Comet Trail',
    pedigreeVerification: 'Unverified', healthScreening: 'Not started', evaluation: 'GROOM_REVIEW', submitted: '18 Sep 2026',
    performanceNote: 'Awaiting Groom intake review.',
    checklist: [
      { id: 'e1', label: 'Identity and registration checked', done: false }, { id: 'e2', label: 'Pedigree verified with registry', done: false },
      { id: 'e3', label: 'Veterinary initial examination', done: false }, { id: 'e4', label: 'Conformation assessment', done: false }, { id: 'e5', label: 'Racing readiness assessment created', done: false },
    ],
  },
];

