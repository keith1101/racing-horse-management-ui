/** Canonical lifecycle from the admission workflow in the business notes. */
export type CandidateStatus =
  | 'SUBMITTED'
  | 'GROOM_REVIEW'
  | 'WAITING_FOR_STALL'
  | 'VET_REVIEW'
  | 'TRAINER_REVIEW'
  | 'MANAGER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ADDITIONAL_INFORMATION_REQUIRED';

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
  /** Assigned by Groom before clinical review. */
  stable?: string;
  stall?: string;
}

export const CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Coastal Sovereign',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    owner: 'Marlowe Racing Ltd.',
    breed: 'Thoroughbred',
    sex: 'Colt',
    ageYears: 3,
    sire: 'Storm Cat’s Legacy',
    dam: 'Coastal Breeze',
    pedigreeVerification: 'Verified',
    healthScreening: 'Passed',
    evaluation: 'VET_REVIEW',
    submitted: '16 Sep 2026',
    performanceNote: 'Two barrier trials, both promising; strong sectional in the second.',
    checklist: [
      { id: 'e1', label: 'Identity & microchip confirmed', done: true },
      { id: 'e2', label: 'Pedigree verified with registry', done: true },
      { id: 'e3', label: 'Veterinary pre-purchase exam', done: true },
      { id: 'e4', label: 'Conformation assessment', done: false },
      { id: 'e5', label: 'Trainer trial evaluation', done: false },
    ],
  },
  {
    id: 'cand-2',
    name: 'Amber Ridge',
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
      { id: 'e1', label: 'Identity & microchip confirmed', done: true },
      { id: 'e2', label: 'Pedigree verified with registry', done: false },
      { id: 'e3', label: 'Veterinary pre-purchase exam', done: false },
      { id: 'e4', label: 'Conformation assessment', done: false },
      { id: 'e5', label: 'Trainer trial evaluation', done: false },
    ],
  },
  {
    id: 'cand-3',
    name: 'Granite Star',
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
      { id: 'e1', label: 'Identity & microchip confirmed', done: true },
      { id: 'e2', label: 'Pedigree verified with registry', done: true },
      { id: 'e3', label: 'Veterinary pre-purchase exam', done: true },
      { id: 'e4', label: 'Conformation assessment', done: true },
      { id: 'e5', label: 'Trainer trial evaluation', done: false },
    ],
  },
  {
    id: 'cand-4',
    name: 'Velvet Horizon',
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
      { id: 'e1', label: 'Identity & microchip confirmed', done: false },
      { id: 'e2', label: 'Pedigree verified with registry', done: false },
      { id: 'e3', label: 'Veterinary pre-purchase exam', done: false },
      { id: 'e4', label: 'Conformation assessment', done: false },
      { id: 'e5', label: 'Trainer trial evaluation', done: false },
    ],
  },
  {
    id: 'cand-5',
    name: 'Northern Ember',
    image: 'https://images.unsplash.com/photo-1566251037378-5e04e3bec343?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    owner: 'Marlowe Racing Ltd.',
    breed: 'Thoroughbred', sex: 'Filly', ageYears: 3, sire: 'Northern Dancer II', dam: 'Ember Sky',
    pedigreeVerification: 'Verified', healthScreening: 'Passed', evaluation: 'MANAGER_REVIEW', submitted: '14 Sep 2026',
    performanceNote: 'Ready for final club acceptance after passing all operational reviews.',
    checklist: [
      { id: 'e1', label: 'Identity & microchip confirmed', done: true }, { id: 'e2', label: 'Pedigree verified with registry', done: true },
      { id: 'e3', label: 'Veterinary pre-purchase exam', done: true }, { id: 'e4', label: 'Conformation assessment', done: true }, { id: 'e5', label: 'Trainer trial evaluation', done: true },
    ], stable: 'Barn C', stall: 'C11',
  },
  {
    id: 'cand-6',
    name: 'Harbour Light',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    owner: 'Marlowe Racing Ltd.',
    breed: 'Thoroughbred', sex: 'Gelding', ageYears: 4, sire: 'Harbour Master', dam: 'Light Years',
    pedigreeVerification: 'Verified', healthScreening: 'Pending', evaluation: 'WAITING_FOR_STALL', submitted: '20 Sep 2026',
    performanceNote: 'Groom intake is complete; a suitable stall is required before veterinary screening.',
    checklist: [
      { id: 'e1', label: 'Identity & microchip confirmed', done: true }, { id: 'e2', label: 'Pedigree verified with registry', done: true },
      { id: 'e3', label: 'Veterinary pre-purchase exam', done: false }, { id: 'e4', label: 'Conformation assessment', done: false }, { id: 'e5', label: 'Trainer trial evaluation', done: false },
    ],
  },
  {
    id: 'cand-7',
    name: 'Marlowe Comet',
    image: 'https://images.unsplash.com/photo-1534567110243-8875d64ca8ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    owner: 'Marlowe Racing Ltd.', breed: 'Thoroughbred', sex: 'Colt', ageYears: 2, sire: 'Stellar Path', dam: 'Comet Trail',
    pedigreeVerification: 'Unverified', healthScreening: 'Not started', evaluation: 'ADDITIONAL_INFORMATION_REQUIRED', submitted: '18 Sep 2026',
    performanceNote: 'Owner needs to provide the registry certificate before the pending Groom review continues.',
    checklist: [
      { id: 'e1', label: 'Identity & microchip confirmed', done: false }, { id: 'e2', label: 'Pedigree verified with registry', done: false },
      { id: 'e3', label: 'Veterinary pre-purchase exam', done: false }, { id: 'e4', label: 'Conformation assessment', done: false }, { id: 'e5', label: 'Trainer trial evaluation', done: false },
    ],
  },
];
