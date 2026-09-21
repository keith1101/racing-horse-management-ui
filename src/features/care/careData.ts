import type { IconName } from '../../components/Icon';

export type GroomTaskType =
  | 'FEEDING'
  | 'MUCKING_OUT'
  | 'GROOMING'
  | 'HOOF_CARE'
  | 'WORKOUT_ASSIST'
  | 'VET_ASSIST'
  | 'SPECIAL_CARE';

export type CareTaskType = GroomTaskType;

export type CareTaskStatus = 'Pending' | 'In progress' | 'Completed' | 'Issue reported';

export interface CareTask {
  id: string;
  time: string;
  horseId: string;
  horseName: string;
  stable: string;
  stall: string;
  type: GroomTaskType;
  detail: string;
  notes?: string;
  assignedTo: string;
  status: CareTaskStatus;
  completedAt?: string;
}

export const GROOM_TASK_LABELS: Record<GroomTaskType, string> = {
  FEEDING: 'Feeding',
  MUCKING_OUT: 'Mucking out',
  GROOMING: 'Grooming',
  HOOF_CARE: 'Hoof care',
  WORKOUT_ASSIST: 'Workout assist',
  VET_ASSIST: 'Vet assist',
  SPECIAL_CARE: 'Special care',
};

export const GROOM_TASK_ICONS: Record<GroomTaskType, IconName> = {
  FEEDING: 'utensils',
  MUCKING_OUT: 'building',
  GROOMING: 'scissors',
  HOOF_CARE: 'shield',
  WORKOUT_ASSIST: 'activity',
  VET_ASSIST: 'stethoscope',
  SPECIAL_CARE: 'heart-pulse',
};

export const CARE_TASK_ICON: Record<string, IconName> = {
  ...GROOM_TASK_ICONS,
  Feeding: 'utensils',
  Water: 'droplet',
  Grooming: 'scissors',
  'Stall cleaning': 'building',
  'Exercise preparation': 'activity',
  'Medication assistance': 'pill',
  'Hoof inspection': 'shield',
  'Health observation': 'heart-pulse',
};

export const CARE_TASK_TYPES: GroomTaskType[] = [
  'FEEDING',
  'MUCKING_OUT',
  'GROOMING',
  'HOOF_CARE',
  'WORKOUT_ASSIST',
  'VET_ASSIST',
  'SPECIAL_CARE',
];

export const CARE_STAFF = ['Damilola Okafor', 'Patrick Aziz', 'Luke Mbeki'];

export const CARE_TASKS: CareTask[] = [
  {
    id: 'c-1',
    time: '05:30',
    horseId: 'h-thunderbolt',
    horseName: 'Thunder Bolt',
    stable: 'Barn A',
    stall: 'A03',
    type: 'FEEDING',
    detail: 'Morning feed — 4.5kg performance mix & fresh water bucket refill',
    assignedTo: 'Damilola Okafor',
    status: 'Completed',
    completedAt: '05:38',
  },
  {
    id: 'c-2',
    time: '05:30',
    horseId: 'h-emberqueen',
    horseName: 'Ember Queen',
    stable: 'Barn A',
    stall: 'A01',
    type: 'FEEDING',
    detail: 'Morning ration — 3.8kg juvenile growth mix & automatic drinker check',
    assignedTo: 'Damilola Okafor',
    status: 'Completed',
    completedAt: '05:44',
  },
  {
    id: 'c-3',
    time: '06:00',
    horseId: 'h-thunderbolt',
    horseName: 'Thunder Bolt',
    stable: 'Barn A',
    stall: 'A03',
    type: 'MUCKING_OUT',
    detail: 'Dọn chuồng đợt 1: Strip wet patches, disinfect rubber mats & fresh straw',
    assignedTo: 'Damilola Okafor',
    status: 'Completed',
    completedAt: '06:18',
  },
  {
    id: 'c-4',
    time: '06:00',
    horseId: 'h-crimsonlegacy',
    horseName: 'Crimson Legacy',
    stable: 'Barn A',
    stall: 'A11',
    type: 'MUCKING_OUT',
    detail: 'Dọn chuồng đợt 1: Remove droppings, air out stall & fresh shavings',
    assignedTo: 'Damilola Okafor',
    status: 'Completed',
    completedAt: '06:25',
  },
  {
    id: 'c-5',
    time: '06:30',
    horseId: 'h-thunderbolt',
    horseName: 'Thunder Bolt',
    stable: 'Barn A',
    stall: 'A03',
    type: 'WORKOUT_ASSIST',
    detail: 'Dắt ngựa đi tập Khung Giờ Vàng: Tack up for 06:30 gallop & hand over to Trainer',
    assignedTo: 'Damilola Okafor',
    status: 'In progress',
  },
  {
    id: 'c-6',
    time: '07:15',
    horseId: 'h-emberqueen',
    horseName: 'Ember Queen',
    stable: 'Barn A',
    stall: 'A01',
    type: 'WORKOUT_ASSIST',
    detail: 'Fit protective boots, bridle & lead to arena for 800m canter',
    assignedTo: 'Damilola Okafor',
    status: 'Pending',
  },
  {
    id: 'c-7',
    time: '09:30',
    horseId: 'h-thunderbolt',
    horseName: 'Thunder Bolt',
    stable: 'Barn A',
    stall: 'A03',
    type: 'GROOMING',
    detail: 'Tắm rửa & bôi dầu móng: Wash down, sweat scraper, apply hoof dressing & fly sheet',
    assignedTo: 'Damilola Okafor',
    status: 'Pending',
  },
  {
    id: 'c-8',
    time: '09:30',
    horseId: 'h-crimsonlegacy',
    horseName: 'Crimson Legacy',
    stable: 'Barn A',
    stall: 'A11',
    type: 'HOOF_CARE',
    detail: 'Pick hooves, check shoe tightness & dress coronet band with conditioner',
    assignedTo: 'Damilola Okafor',
    status: 'Pending',
  },
  {
    id: 'c-9',
    time: '11:30',
    horseId: 'h-thunderbolt',
    horseName: 'Thunder Bolt',
    stable: 'Barn A',
    stall: 'A03',
    type: 'FEEDING',
    detail: 'Cho ăn trưa: Midday hay net (5kg timothy hay) & electrolyte replenishment',
    assignedTo: 'Damilola Okafor',
    status: 'Pending',
  },
  {
    id: 'c-10',
    time: '11:30',
    horseId: 'h-emberqueen',
    horseName: 'Ember Queen',
    stable: 'Barn A',
    stall: 'A01',
    type: 'FEEDING',
    detail: 'Cho ăn trưa: High-fibre lucerne chaff & clean water bucket check',
    assignedTo: 'Damilola Okafor',
    status: 'Pending',
  },
  {
    id: 'c-11',
    time: '14:00',
    horseId: 'h-desertmirage',
    horseName: 'Desert Mirage',
    stable: 'Isolation',
    stall: 'IS1',
    type: 'SPECIAL_CARE',
    detail: 'Isolation protocol check: Disinfect boots, clean feed tub & respiratory check',
    assignedTo: 'Damilola Okafor',
    status: 'Pending',
  },
  {
    id: 'c-12',
    time: '16:30',
    horseId: 'h-thunderbolt',
    horseName: 'Thunder Bolt',
    stable: 'Barn A',
    stall: 'A03',
    type: 'FEEDING',
    detail: 'Cho ăn chiều & dọn chuồng đợt 2: Evening ration, vitamin pellets & evening muck out',
    assignedTo: 'Damilola Okafor',
    status: 'Pending',
  },
  {
    id: 'c-13',
    time: '16:30',
    horseId: 'h-crimsonlegacy',
    horseName: 'Crimson Legacy',
    stable: 'Barn A',
    stall: 'A11',
    type: 'FEEDING',
    detail: 'Cho ăn chiều: 5.0kg race ration, amino acid supplement & night straw bedding top-up',
    assignedTo: 'Damilola Okafor',
    status: 'Pending',
  },
  // Other staff tasks for global overview
  {
    id: 'c-14',
    time: '06:00',
    horseId: 'h-silvercomet',
    horseName: 'Silver Comet',
    stable: 'Barn B',
    stall: 'B05',
    type: 'WORKOUT_ASSIST',
    detail: 'Tack up for 08:00 breeze with Tomas Reyes',
    assignedTo: 'Patrick Aziz',
    status: 'Completed',
    completedAt: '06:05',
  },
  {
    id: 'c-15',
    time: '08:00',
    horseId: 'h-midnightreign',
    horseName: 'Midnight Reign',
    stable: 'Barn B',
    stall: 'B02',
    type: 'VET_ASSIST',
    detail: 'Assist Dr. Haines with cold hosing & tendon wrap on left foreleg',
    assignedTo: 'Patrick Aziz',
    status: 'In progress',
  },
  {
    id: 'c-16',
    time: '08:30',
    horseId: 'h-royalcadence',
    horseName: 'Royal Cadence',
    stable: 'Barn C',
    stall: 'C04',
    type: 'MUCKING_OUT',
    detail: 'Muck out & fresh bedding',
    assignedTo: 'Luke Mbeki',
    status: 'Pending',
  },
  {
    id: 'c-17',
    time: '09:15',
    horseId: 'h-goldenharbor',
    horseName: 'Golden Harbor',
    stable: 'Barn C',
    stall: 'C08',
    type: 'SPECIAL_CARE',
    detail: 'Post-colic digestive observation & gut sounds check',
    assignedTo: 'Luke Mbeki',
    status: 'Issue reported',
  },
];

export interface CareChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export const CARE_CHECKLIST: CareChecklistItem[] = [
  { id: 'ck-1', label: 'Fresh water available in automatic drinkers & clean buckets', done: true },
  { id: 'ck-2', label: 'Approved feed ration weighed and fed per plan (05:30 & 16:30)', done: true },
  { id: 'ck-3', label: 'Stall mucked out (round 1) & dry bedding laid', done: true },
  { id: 'ck-4', label: 'Morning workout assistance completed (Golden Hour 06:30-09:30)', done: false },
  { id: 'ck-5', label: 'Legs and hooves inspected for heat, pulse, swelling, or missing shoes', done: false },
  { id: 'ck-6', label: 'Coat, mane, and tail brushed; post-workout sweat washed off', done: false },
  { id: 'ck-7', label: 'General demeanor, alertness, and appetite recorded', done: false },
];

export const ISSUE_CATEGORIES = [
  'Lameness / Leg Swelling',
  'Digestive / Colic signs',
  'Respiratory / Cough / Discharge',
  'Skin / Coat / Wounds',
  'Appetite / Water intake',
  'Behaviour / Temperament',
  'Other',
];

export const INCIDENT_SEVERITY_LEVELS = [
  { value: 'LOW', label: 'LOW', tone: 'neutral' as const, description: 'Minor observation (minor scrape, slight feed left)' },
  { value: 'MEDIUM', label: 'MEDIUM', tone: 'warning' as const, description: 'Requires veterinarian review today (mild stiffness, reduced appetite)' },
  { value: 'HIGH', label: 'HIGH', tone: 'danger' as const, description: 'Urgent attention required (visible lameness, localized heat)' },
  { value: 'CRITICAL', label: 'CRITICAL', tone: 'danger' as const, description: 'Emergency response (colic signs, severe bleeding, acute distress)' },
];

