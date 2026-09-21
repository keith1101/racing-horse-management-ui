export interface RaceEntry {
  horseId: string;
  horseName: string;
  jockey: string;
  draw: number;
  weightKg: number;
}

export interface RaceEvent {
  id: string;
  date: string;
  time: string;
  name: string;
  course: string;
  distance: string;
  surface: 'Turf' | 'Dirt' | 'All-weather';
  grade: string;
  purse: string;
  status: 'Declared' | 'Entries open' | 'Confirmed';
  entries: RaceEntry[];
}

export interface RaceProposal {
  id: string;
  raceId: string;
  raceName: string;
  horseId: string;
  horseName: string;
  proposedBy: string;
  proposedDate: string;
  requestedBudget: number;
  approvedBudget?: number;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  notes?: string;
  managerNotes?: string;
}

export interface RaceResult {
  id: string;
  date: string;
  horseId: string;
  horseName: string;
  race: string;
  course: string;
  distance: string;
  finish: number;
  field: number;
  time: string;
  margin: string;
  jockey: string;
}

export const UPCOMING_RACES: RaceEvent[] = [
  {
    id: 'rc-1',
    date: '05 Oct 2026',
    time: '15:40',
    name: 'Riverside Spring Classic',
    course: 'Riverside Park',
    distance: '1,600 m',
    surface: 'Turf',
    grade: 'Group 2',
    purse: '£120,000',
    status: 'Declared',
    entries: [
      { horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', jockey: 'M. Fontaine', draw: 4, weightKg: 57 },
      { horseId: 'h-crimsonlegacy', horseName: 'Crimson Legacy', jockey: 'A. Serrano', draw: 7, weightKg: 58 },
    ],
  },
  {
    id: 'rc-2',
    date: '28 Sep 2026',
    time: '14:10',
    name: 'Ashford Sprint Handicap',
    course: 'Ashford Downs',
    distance: '1,000 m',
    surface: 'All-weather',
    grade: 'Listed',
    purse: '£45,000',
    status: 'Confirmed',
    entries: [
      { horseId: 'h-silvercomet', horseName: 'Silver Comet', jockey: 'J. Okonkwo', draw: 2, weightKg: 56 },
    ],
  },
  {
    id: 'rc-3',
    date: '19 Oct 2026',
    time: '16:05',
    name: 'Meridian Distance Cup',
    course: 'Meridian Racecourse',
    distance: '2,400 m',
    surface: 'Turf',
    grade: 'Group 3',
    purse: '£80,000',
    status: 'Entries open',
    entries: [
      { horseId: 'h-shadowdancer', horseName: 'Shadow Dancer', jockey: 'M. Fontaine', draw: 5, weightKg: 55 },
      { horseId: 'h-ironwill', horseName: 'Iron Will', jockey: 'P. Duval', draw: 9, weightKg: 57 },
    ],
  },
];

export const RACE_HISTORY: RaceResult[] = [
  { id: 'rh-1', date: '31 Aug 2026', horseId: 'h-crimsonlegacy', horseName: 'Crimson Legacy', race: 'Late Summer Feature', course: 'Riverside Park', distance: '1,600 m', finish: 1, field: 11, time: '1:36.42', margin: '¾ length', jockey: 'A. Serrano' },
  { id: 'rh-2', date: '24 Aug 2026', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', race: 'Prep Stakes', course: 'Ashford Downs', distance: '1,400 m', finish: 2, field: 9, time: '1:23.10', margin: 'neck', jockey: 'M. Fontaine' },
  { id: 'rh-3', date: '17 Aug 2026', horseId: 'h-silvercomet', horseName: 'Silver Comet', race: 'Sprint Trial', course: 'Ashford Downs', distance: '1,000 m', finish: 1, field: 8, time: '0:57.88', margin: '1¼ lengths', jockey: 'J. Okonkwo' },
  { id: 'rh-4', date: '10 Aug 2026', horseId: 'h-shadowdancer', horseName: 'Shadow Dancer', race: 'Distance Handicap', course: 'Meridian Racecourse', distance: '2,000 m', finish: 3, field: 12, time: '2:04.31', margin: '2 lengths', jockey: 'M. Fontaine' },
  { id: 'rh-5', date: '03 Aug 2026', horseId: 'h-royalcadence', horseName: 'Royal Cadence', race: 'Maiden Plate', course: 'Riverside Park', distance: '1,200 m', finish: 4, field: 10, time: '1:11.55', margin: '3½ lengths', jockey: 'P. Duval' },
  { id: 'rh-6', date: '27 Jul 2026', horseId: 'h-thunderbolt', horseName: 'Thunder Bolt', race: 'Handicap', course: 'Riverside Park', distance: '1,600 m', finish: 1, field: 10, time: '1:35.90', margin: '2 lengths', jockey: 'M. Fontaine' },
];

export const INITIAL_RACE_PROPOSALS: RaceProposal[] = [
  {
    id: 'prop-1',
    raceId: 'rc-1',
    raceName: 'Riverside Spring Classic',
    horseId: 'h-royalcadence',
    horseName: 'Royal Cadence',
    proposedBy: 'Elena Cardoso',
    proposedDate: '19 Sep 2026',
    requestedBudget: 1800,
    status: 'PENDING',
    notes: 'Strong sectionals in gallop trials. Soundness cleared for Group 2 mile contest.',
  },
];

