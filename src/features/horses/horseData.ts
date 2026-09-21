import type { HealthStatus, TrainingStatus } from '../../components/StatusBadge';

export interface TrainingLock {
  reason: string;
  reviewDate: string;
  veterinarian: string;
}

export interface ActivityEntry {
  time: string;
  actor: string;
  event: string;
}

export interface ScheduleEntry {
  time: string;
  type: 'Training' | 'Treatment' | 'Preventive care' | 'Groom task' | 'Race';
  title: string;
  staff: string;
}

export interface Horse {
  id: string;
  name: string;
  image: string;
  sex: 'Colt' | 'Filly' | 'Gelding' | 'Mare' | 'Stallion';
  breed: string;
  foaled: string; // ISO date
  ageYears: number;
  microchip: string;
  sire: string;
  dam: string;
  health: HealthStatus;
  healthNote: string;
  stable: string;
  stall: string;
  assignedGroom?: string;
  approvedFeedRation?: string;
  owner: string;
  trainer: string;
  training: TrainingStatus;
  activePlan: string;
  phase: string;
  nextWorkout: string;
  readiness: 'Ready' | 'Building' | 'Restricted' | 'Resting';
  weightKg: number;
  restingHrBpm: number;
  lock?: TrainingLock;
  schedule: ScheduleEntry[];
  activity: ActivityEntry[];
}

const IMG = {
  gray: 'https://images.unsplash.com/photo-1513966007261-5a86a5284471?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  brown1:
    'https://images.unsplash.com/photo-1573751055635-a0ad5937fd37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  brown2:
    'https://images.unsplash.com/photo-1504020853563-338d87e28a89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  brown3:
    'https://images.unsplash.com/photo-1586582637679-deb3489d68c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  brown4:
    'https://images.unsplash.com/photo-1573751055879-03af1f628e29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  ridden:
    'https://images.unsplash.com/photo-1633110664667-d6f7be9709d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  blackwhite:
    'https://images.unsplash.com/photo-1727207833249-2e447fe04632?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  head: 'https://images.unsplash.com/photo-1645767006495-0136265e26c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  field:
    'https://images.unsplash.com/photo-1686841763882-6cd8fa6081e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  brownwhite:
    'https://images.unsplash.com/photo-1594069033313-8920df9150b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  white:
    'https://images.unsplash.com/photo-1765046067408-d56b4a46fb4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  trees:
    'https://images.unsplash.com/photo-1653224705149-028d21371faa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  grass:
    'https://images.unsplash.com/photo-1629912018961-74e19001b2df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  headbw:
    'https://images.unsplash.com/photo-1756680402403-58b2b91c802a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  whitefield:
    'https://images.unsplash.com/photo-1417686597246-b99b258b2aa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  strap:
    'https://images.unsplash.com/photo-1602028325735-bd3ca3252395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
};

export const HORSES: Horse[] = [
  {
    id: 'h-thunderbolt',
    name: 'Thunder Bolt',
    image: IMG.brown1,
    sex: 'Stallion',
    breed: 'Thoroughbred',
    foaled: '2020-04-12',
    ageYears: 6,
    microchip: '985 141 000 482 771',
    sire: "Storm Cat's Legacy",
    dam: 'Velvet Dawn',
    health: 'FIT',
    healthNote: 'Cleared at last examination',
    stable: 'Barn A',
    stall: 'A03',
    assignedGroom: 'Damilola Okafor',
    approvedFeedRation: '4.5 kg/day Performance Mix (oats, barley, sweet feed) + 8 kg timothy hay & electrolytes',
    owner: 'Marlowe Racing Ltd.',
    trainer: 'Elena Cardoso',
    training: 'ACTIVE',
    activePlan: 'Spring Classic Prep',
    phase: 'Race prep',
    nextWorkout: '21 Sep, 06:30 · 1,400 m gallop',
    readiness: 'Ready',
    weightKg: 512,
    restingHrBpm: 34,
    schedule: [
      { time: '06:30', type: 'Training', title: '1,400 m gallop', staff: 'E. Cardoso' },
      { time: '11:00', type: 'Groom task', title: 'Ice bath · recovery', staff: 'D. Okafor' },
      { time: '15:00', type: 'Preventive care', title: 'Farrier check', staff: 'R. Nilsson' },
    ],
    activity: [
      { time: '20 Sep, 07:10', actor: 'E. Cardoso', event: 'Logged workout — 49.2 km/h avg' },
      { time: '19 Sep, 16:40', actor: 'D. Okafor', event: 'Completed evening feed' },
      { time: '18 Sep, 09:20', actor: 'Dr. Haines', event: 'Recorded medical clearance' },
    ],
  },
  {
    id: 'h-wintersolstice',
    name: 'Winter Solstice',
    image: IMG.white,
    sex: 'Mare',
    breed: 'Thoroughbred',
    foaled: '2019-02-28',
    ageYears: 7,
    microchip: '985 141 000 391 006',
    sire: 'Northern Aurora',
    dam: 'Frost Lily',
    health: 'MONITOR',
    healthNote: 'Mild fetlock swelling — under observation',
    stable: 'Barn A',
    stall: 'A07',
    assignedGroom: 'Patrick Aziz',
    approvedFeedRation: '3.8 kg/day Conditioning Pellet + 7 kg meadow hay',
    owner: 'Ashgrove Stud',
    trainer: 'Elena Cardoso',
    training: 'SCHEDULED',
    activePlan: 'Autumn Conditioning',
    phase: 'Conditioning',
    nextWorkout: '22 Sep, 07:00 · 900 m canter',
    readiness: 'Building',
    weightKg: 486,
    restingHrBpm: 36,
    schedule: [
      { time: '07:00', type: 'Training', title: '900 m controlled canter', staff: 'E. Cardoso' },
      { time: '10:30', type: 'Treatment', title: 'Cold therapy — left fore', staff: 'Dr. Haines' },
    ],
    activity: [
      { time: '20 Sep, 10:15', actor: 'Dr. Haines', event: 'Flagged fetlock for monitoring' },
      { time: '19 Sep, 06:50', actor: 'E. Cardoso', event: 'Logged workout — 41.0 km/h avg' },
    ],
  },
  {
    id: 'h-midnightreign',
    name: 'Midnight Reign',
    image: IMG.blackwhite,
    sex: 'Colt',
    breed: 'Thoroughbred',
    foaled: '2022-03-05',
    ageYears: 4,
    microchip: '985 141 000 552 118',
    sire: 'Eclipse Sovereign',
    dam: 'Moonlit Sonata',
    health: 'INJURED',
    healthNote: 'Tendon inflammation — left front',
    stable: 'Barn B',
    stall: 'B02',
    assignedGroom: 'Patrick Aziz',
    approvedFeedRation: '3.5 kg/day Low-starch anti-inflammatory mash + soaked beet pulp & timothy hay',
    owner: 'Hollowbrook Partners',
    trainer: 'Tomas Reyes',
    training: 'BLOCKED',
    activePlan: 'Foundation Build',
    phase: 'Foundation',
    nextWorkout: 'Blocked by training lock',
    readiness: 'Restricted',
    weightKg: 468,
    restingHrBpm: 38,
    lock: {
      reason: 'Superficial digital flexor tendon strain',
      reviewDate: '23 Sep 2026',
      veterinarian: 'Dr. Haines',
    },
    schedule: [
      { time: '09:00', type: 'Treatment', title: 'Tendon assessment', staff: 'Dr. Haines' },
      { time: '13:00', type: 'Groom task', title: 'Hand walk · 15 min', staff: 'P. Aziz' },
    ],
    activity: [
      { time: '20 Sep, 08:05', actor: 'Dr. Haines', event: 'Applied training lock' },
      { time: '20 Sep, 07:55', actor: 'Dr. Haines', event: 'Diagnosed tendon strain' },
      { time: '19 Sep, 18:20', actor: 'P. Aziz', event: 'Reported heat in left foreleg' },
    ],
  },
  {
    id: 'h-silvercomet',
    name: 'Silver Comet',
    image: IMG.gray,
    sex: 'Gelding',
    breed: 'Thoroughbred',
    foaled: '2021-05-19',
    ageYears: 5,
    microchip: '985 141 000 447 903',
    sire: 'Quicksilver Run',
    dam: 'Comet Tail',
    health: 'FIT',
    healthNote: 'Cleared at last examination',
    stable: 'Barn B',
    stall: 'B05',
    assignedGroom: 'Patrick Aziz',
    approvedFeedRation: '4.8 kg/day Sprint Energy Mix + alfalfa flakes & hydration booster',
    owner: 'Marlowe Racing Ltd.',
    trainer: 'Tomas Reyes',
    training: 'ACTIVE',
    activePlan: 'Sprint Series',
    phase: 'Race prep',
    nextWorkout: '21 Sep, 06:00 · 1,000 m breeze',
    readiness: 'Ready',
    weightKg: 498,
    restingHrBpm: 33,
    schedule: [
      { time: '06:00', type: 'Training', title: '1,000 m breeze', staff: 'T. Reyes' },
      { time: '12:00', type: 'Groom task', title: 'Bathing & grooming', staff: 'P. Aziz' },
    ],
    activity: [
      { time: '20 Sep, 06:40', actor: 'T. Reyes', event: 'Logged workout — 51.8 km/h max' },
      { time: '18 Sep, 14:00', actor: 'R. Nilsson', event: 'Completed farrier visit' },
    ],
  },
  {
    id: 'h-emberqueen',
    name: 'Ember Queen',
    image: IMG.brown3,
    sex: 'Filly',
    breed: 'Thoroughbred',
    foaled: '2023-04-02',
    ageYears: 3,
    microchip: '985 141 000 610 224',
    sire: 'Firebrand',
    dam: 'Amber Grace',
    health: 'FIT',
    healthNote: 'Cleared at last examination',
    stable: 'Barn A',
    stall: 'A01',
    assignedGroom: 'Damilola Okafor',
    approvedFeedRation: '3.8 kg/day Juvenile Growth Formula + lucerne chaff & calcium booster',
    owner: 'Ashgrove Stud',
    trainer: 'Elena Cardoso',
    training: 'ACTIVE',
    activePlan: 'Juvenile Development',
    phase: 'Conditioning',
    nextWorkout: '21 Sep, 07:30 · 800 m canter',
    readiness: 'Building',
    weightKg: 452,
    restingHrBpm: 37,
    schedule: [
      { time: '07:30', type: 'Training', title: '800 m canter', staff: 'E. Cardoso' },
      { time: '16:00', type: 'Preventive care', title: 'Vaccination — influenza', staff: 'Dr. Haines' },
    ],
    activity: [
      { time: '20 Sep, 07:45', actor: 'E. Cardoso', event: 'Logged workout — 38.4 km/h avg' },
      { time: '17 Sep, 11:00', actor: 'Dr. Haines', event: 'Scheduled influenza booster' },
    ],
  },
  {
    id: 'h-desertmirage',
    name: 'Desert Mirage',
    image: IMG.brown2,
    sex: 'Mare',
    breed: 'Arabian',
    foaled: '2018-06-11',
    ageYears: 8,
    microchip: '985 141 000 208 559',
    sire: 'Sahara Wind',
    dam: 'Oasis Dream',
    health: 'ISOLATED',
    healthNote: 'Respiratory quarantine — 5 days remaining',
    stable: 'Isolation',
    stall: 'IS1',
    assignedGroom: 'Damilola Okafor',
    approvedFeedRation: '3.2 kg/day Respiratory Support Mash + steamed timothy hay',
    owner: 'Crescent Bloodstock',
    trainer: 'Tomas Reyes',
    training: 'CANCELLED',
    activePlan: 'On hold',
    phase: '—',
    nextWorkout: 'Suspended during isolation',
    readiness: 'Resting',
    weightKg: 441,
    restingHrBpm: 40,
    schedule: [
      { time: '08:00', type: 'Treatment', title: 'Respiratory check', staff: 'Dr. Haines' },
      { time: '14:00', type: 'Groom task', title: 'Isolation stall clean', staff: 'D. Okafor' },
    ],
    activity: [
      { time: '18 Sep, 08:30', actor: 'Dr. Haines', event: 'Moved to isolation' },
      { time: '18 Sep, 08:00', actor: 'D. Okafor', event: 'Reported nasal discharge' },
    ],
  },
  {
    id: 'h-royalcadence',
    name: 'Royal Cadence',
    image: IMG.brownwhite,
    sex: 'Colt',
    breed: 'Thoroughbred',
    foaled: '2022-01-22',
    ageYears: 4,
    microchip: '985 141 000 533 470',
    sire: 'Regal Anthem',
    dam: 'Cadenza',
    health: 'FIT',
    healthNote: 'Cleared at last examination',
    stable: 'Barn C',
    stall: 'C04',
    assignedGroom: 'Luke Mbeki',
    approvedFeedRation: '4.6 kg/day Classic Mile Grain Mix + flaxseed oil & orchard grass',
    owner: 'Hollowbrook Partners',
    trainer: 'Elena Cardoso',
    training: 'ACTIVE',
    activePlan: 'Mile Campaign',
    phase: 'Conditioning',
    nextWorkout: '21 Sep, 06:45 · 1,200 m gallop',
    readiness: 'Ready',
    weightKg: 505,
    restingHrBpm: 35,
    schedule: [
      { time: '06:45', type: 'Training', title: '1,200 m gallop', staff: 'E. Cardoso' },
      { time: '17:30', type: 'Groom task', title: 'Evening feed', staff: 'P. Aziz' },
    ],
    activity: [
      { time: '20 Sep, 07:00', actor: 'E. Cardoso', event: 'Logged workout — 46.7 km/h avg' },
    ],
  },
  {
    id: 'h-goldenharbor',
    name: 'Golden Harbor',
    image: IMG.field,
    sex: 'Gelding',
    breed: 'Thoroughbred',
    foaled: '2020-09-08',
    ageYears: 6,
    microchip: '985 141 000 471 882',
    sire: 'Harbormaster',
    dam: 'Golden Reef',
    health: 'MONITOR',
    healthNote: 'Recovering from mild colic episode',
    stable: 'Barn C',
    stall: 'C08',
    assignedGroom: 'Luke Mbeki',
    approvedFeedRation: '3.2 kg/day Post-Colic Digestive Mash + probiotic gut balancer & soaked hay',
    owner: 'Crescent Bloodstock',
    trainer: 'Tomas Reyes',
    training: 'SCHEDULED',
    activePlan: 'Return to Work',
    phase: 'Foundation',
    nextWorkout: '23 Sep, 07:15 · 600 m trot',
    readiness: 'Building',
    weightKg: 489,
    restingHrBpm: 38,
    schedule: [
      { time: '07:15', type: 'Training', title: '600 m trot', staff: 'T. Reyes' },
      { time: '12:30', type: 'Treatment', title: 'Digestive follow-up', staff: 'Dr. Haines' },
    ],
    activity: [
      { time: '19 Sep, 21:10', actor: 'Dr. Haines', event: 'Colic resolved — resuming light work' },
      { time: '18 Sep, 23:40', actor: 'D. Okafor', event: 'Reported signs of colic' },
    ],
  },
  {
    id: 'h-crimsonlegacy',
    name: 'Crimson Legacy',
    image: IMG.head,
    sex: 'Stallion',
    breed: 'Thoroughbred',
    foaled: '2019-07-30',
    ageYears: 7,
    microchip: '985 141 000 355 219',
    sire: 'Scarlet Baron',
    dam: 'Legacy Line',
    health: 'FIT',
    healthNote: 'Cleared at last examination',
    stable: 'Barn A',
    stall: 'A11',
    assignedGroom: 'Damilola Okafor',
    approvedFeedRation: '5.0 kg/day High-Energy Race Ration + amino acid supplement & meadow hay',
    owner: 'Marlowe Racing Ltd.',
    trainer: 'Elena Cardoso',
    training: 'COMPLETED',
    activePlan: 'Autumn Feature Prep',
    phase: 'Taper',
    nextWorkout: '24 Sep, 06:30 · Light stretch',
    readiness: 'Ready',
    weightKg: 520,
    restingHrBpm: 32,
    schedule: [
      { time: '06:30', type: 'Training', title: 'Light stretch gallop', staff: 'E. Cardoso' },
      { time: '15:30', type: 'Race', title: 'Race declaration review', staff: 'E. Cardoso' },
    ],
    activity: [
      { time: '20 Sep, 06:35', actor: 'E. Cardoso', event: 'Completed final prep workout' },
      { time: '16 Sep, 15:00', actor: 'E. Cardoso', event: 'Marked race-ready' },
    ],
  },
  {
    id: 'h-northernstar',
    name: 'Northern Star',
    image: IMG.whitefield,
    sex: 'Filly',
    breed: 'Thoroughbred',
    foaled: '2023-02-14',
    ageYears: 3,
    microchip: '985 141 000 628 741',
    sire: 'Polaris Prime',
    dam: 'Starlet',
    health: 'FIT',
    healthNote: 'Cleared at last examination',
    stable: 'Barn B',
    stall: 'B09',
    assignedGroom: 'Patrick Aziz',
    approvedFeedRation: '3.6 kg/day Maiden Intake Formula + pasture turnout ration',
    owner: 'Ashgrove Stud',
    trainer: 'Tomas Reyes',
    training: 'DRAFT',
    activePlan: 'Intake Assessment',
    phase: 'Draft plan',
    nextWorkout: 'Plan pending trainer review',
    readiness: 'Building',
    weightKg: 447,
    restingHrBpm: 39,
    schedule: [
      { time: '10:00', type: 'Groom task', title: 'Groundwork familiarisation', staff: 'P. Aziz' },
    ],
    activity: [
      { time: '20 Sep, 09:30', actor: 'T. Reyes', event: 'Started intake assessment' },
    ],
  },
  {
    id: 'h-shadowdancer',
    name: 'Shadow Dancer',
    image: IMG.headbw,
    sex: 'Mare',
    breed: 'Thoroughbred',
    foaled: '2020-11-03',
    ageYears: 5,
    microchip: '985 141 000 489 337',
    sire: 'Nightfall',
    dam: 'Dancing Shadow',
    health: 'FIT',
    healthNote: 'Cleared at last examination',
    stable: 'Barn C',
    stall: 'C02',
    assignedGroom: 'Luke Mbeki',
    approvedFeedRation: '4.4 kg/day Distance Endurance Ration + vitamin E & timothy hay',
    owner: 'Hollowbrook Partners',
    trainer: 'Elena Cardoso',
    training: 'ACTIVE',
    activePlan: 'Distance Series',
    phase: 'Conditioning',
    nextWorkout: '21 Sep, 07:00 · 1,600 m gallop',
    readiness: 'Ready',
    weightKg: 481,
    restingHrBpm: 34,
    schedule: [
      { time: '07:00', type: 'Training', title: '1,600 m gallop', staff: 'E. Cardoso' },
      { time: '13:30', type: 'Groom task', title: 'Recovery walk', staff: 'D. Okafor' },
    ],
    activity: [
      { time: '20 Sep, 07:20', actor: 'E. Cardoso', event: 'Logged workout — 44.9 km/h avg' },
    ],
  },
  {
    id: 'h-ironwill',
    name: 'Iron Will',
    image: IMG.strap,
    sex: 'Gelding',
    breed: 'Thoroughbred',
    foaled: '2019-04-25',
    ageYears: 7,
    microchip: '985 141 000 361 550',
    sire: 'Ironclad',
    dam: 'Willow Song',
    health: 'MONITOR',
    healthNote: 'Elevated resting heart rate — under watch',
    stable: 'Barn B',
    stall: 'B12',
    assignedGroom: 'Luke Mbeki',
    approvedFeedRation: '4.2 kg/day Low-glycemic stamina mix + heart telemetry supplements',
    owner: 'Crescent Bloodstock',
    trainer: 'Tomas Reyes',
    training: 'ACTIVE',
    activePlan: 'Stamina Block',
    phase: 'Conditioning',
    nextWorkout: '21 Sep, 06:15 · 2,000 m steady',
    readiness: 'Building',
    weightKg: 511,
    restingHrBpm: 44,
    schedule: [
      { time: '06:15', type: 'Training', title: '2,000 m steady', staff: 'T. Reyes' },
      { time: '11:30', type: 'Treatment', title: 'Cardiac telemetry review', staff: 'Dr. Haines' },
    ],
    activity: [
      { time: '20 Sep, 06:30', actor: 'T. Reyes', event: 'Logged workout — recovery HR high' },
      { time: '19 Sep, 12:00', actor: 'Dr. Haines', event: 'Requested telemetry monitoring' },
    ],
  },
];

export const GROOMS = ['Damilola Okafor', 'Patrick Aziz', 'Luke Mbeki'];
export const MAX_STALLS_PER_GROOM = 3;

export const STABLES = ['Barn A', 'Barn B', 'Barn C', 'Isolation'];
export const TRAINERS = ['Elena Cardoso', 'Tomas Reyes'];
export const OWNERS = [
  'Marlowe Racing Ltd.',
  'Ashgrove Stud',
  'Hollowbrook Partners',
  'Crescent Bloodstock',
];

export const HEALTH_ORDER: HealthStatus[] = ['FIT', 'MONITOR', 'INJURED', 'ISOLATED'];
