import type { IconName } from '../../components/Icon';

export type CareTaskType =
  | 'Feeding'
  | 'Water'
  | 'Grooming'
  | 'Stall cleaning'
  | 'Exercise preparation'
  | 'Medication assistance'
  | 'Hoof inspection'
  | 'Health observation';

export type CareTaskStatus = 'Pending' | 'In progress' | 'Completed' | 'Issue reported';

export interface CareTask {
  id: string;
  time: string;
  horseId: string;
  horseName: string;
  stable: string;
  type: CareTaskType;
  detail: string;
  assignedTo: string;
  status: CareTaskStatus;
}

export const CARE_TASK_ICON: Record<CareTaskType, IconName> = {
  Feeding: 'utensils',
  Water: 'droplet',
  Grooming: 'scissors',
  'Stall cleaning': 'building',
  'Exercise preparation': 'activity',
  'Medication assistance': 'pill',
  'Hoof inspection': 'shield',
  'Health observation': 'heart-pulse',
};

export const CARE_TASK_TYPES: CareTaskType[] = [
  'Feeding',
  'Water',
  'Grooming',
  'Stall cleaning',
  'Exercise preparation',
  'Medication assistance',
  'Hoof inspection',
  'Health observation',
];

export const CARE_STAFF = ['D. Okafor', 'P. Aziz', 'L. Mbeki'];

export const CARE_TASKS: CareTask[] = [
  { id: 'c-1', time: '05:30', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', stable: 'Barn A', type: 'Feeding', detail: 'Morning feed — performance mix', assignedTo: 'D. Okafor', status: 'Completed' },
  { id: 'c-2', time: '05:45', horseId: 'h-emberqueen', horseName: 'Ember Queen', stable: 'Barn A', type: 'Water', detail: 'Refill & check automatic drinker', assignedTo: 'D. Okafor', status: 'Completed' },
  { id: 'c-3', time: '06:00', horseId: 'h-silvercomet', horseName: 'Silver Comet', stable: 'Barn B', type: 'Exercise preparation', detail: 'Tack up for 06:00 breeze', assignedTo: 'P. Aziz', status: 'Completed' },
  { id: 'c-4', time: '07:00', horseId: 'h-crimsonlegacy', horseName: 'Crimson Legacy', stable: 'Barn A', type: 'Grooming', detail: 'Full groom & mane pull', assignedTo: 'L. Mbeki', status: 'In progress' },
  { id: 'c-5', time: '08:00', horseId: 'h-midnightreign', horseName: 'Midnight Reign', stable: 'Barn B', type: 'Medication assistance', detail: 'Assist vet with cold therapy — left fore', assignedTo: 'P. Aziz', status: 'In progress' },
  { id: 'c-6', time: '08:30', horseId: 'h-royalcadence', horseName: 'Royal Cadence', stable: 'Barn C', type: 'Stall cleaning', detail: 'Muck out & fresh bedding', assignedTo: 'L. Mbeki', status: 'Pending' },
  { id: 'c-7', time: '09:00', horseId: 'h-shadowdancer', horseName: 'Shadow Dancer', stable: 'Barn C', type: 'Hoof inspection', detail: 'Pre-farrier hoof check', assignedTo: 'P. Aziz', status: 'Pending' },
  { id: 'c-8', time: '09:15', horseId: 'h-goldenharbor', horseName: 'Golden Harbor', stable: 'Barn C', type: 'Health observation', detail: 'Monitor feed intake post-colic', assignedTo: 'D. Okafor', status: 'Issue reported' },
  { id: 'c-9', time: '10:00', horseId: 'h-desertmirage', horseName: 'Desert Mirage', stable: 'Isolation', type: 'Stall cleaning', detail: 'Isolation protocol — dedicated tools', assignedTo: 'D. Okafor', status: 'Pending' },
  { id: 'c-10', time: '11:00', horseId: 'h-ironwill', horseName: 'Iron Will', stable: 'Barn B', type: 'Feeding', detail: 'Mid-day feed — reduced grain', assignedTo: 'P. Aziz', status: 'Pending' },
  { id: 'c-11', time: '11:30', horseId: 'h-northernstar', horseName: 'Northern Star', stable: 'Barn B', type: 'Grooming', detail: 'Handling & desensitisation', assignedTo: 'L. Mbeki', status: 'Pending' },
  { id: 'c-12', time: '16:00', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', stable: 'Barn A', type: 'Feeding', detail: 'Evening feed & hay net', assignedTo: 'D. Okafor', status: 'Pending' },
];

export interface CareChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export const CARE_CHECKLIST: CareChecklistItem[] = [
  { id: 'ck-1', label: 'Fresh water available', done: true },
  { id: 'ck-2', label: 'Feed given per ration plan', done: true },
  { id: 'ck-3', label: 'Stall clean & dry bedding', done: false },
  { id: 'ck-4', label: 'Coat, mane and tail groomed', done: false },
  { id: 'ck-5', label: 'Legs & hooves checked for heat/swelling', done: false },
  { id: 'ck-6', label: 'General demeanour normal', done: false },
];

export const ISSUE_CATEGORIES = ['Digestive', 'Lameness', 'Respiratory', 'Skin/coat', 'Behaviour', 'Appetite', 'Other'];
