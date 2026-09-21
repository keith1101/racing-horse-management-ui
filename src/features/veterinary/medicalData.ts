export type InjurySeverity = 'Mild' | 'Moderate' | 'Severe';

export type AnatomicalRegion =
  | 'Head'
  | 'Neck'
  | 'Shoulder'
  | 'Chest'
  | 'Back'
  | 'Abdomen'
  | 'Left Front Leg'
  | 'Right Front Leg'
  | 'Left Hind Leg'
  | 'Right Hind Leg'
  | 'Left Front Hoof'
  | 'Right Front Hoof'
  | 'Left Hind Hoof'
  | 'Right Hind Hoof';

export const ANATOMICAL_REGIONS: AnatomicalRegion[] = [
  'Head',
  'Neck',
  'Shoulder',
  'Chest',
  'Back',
  'Abdomen',
  'Left Front Leg',
  'Right Front Leg',
  'Left Hind Leg',
  'Right Hind Leg',
  'Left Front Hoof',
  'Right Front Hoof',
  'Left Hind Hoof',
  'Right Hind Hoof',
];

export interface Examination {
  id: string;
  date: string;
  vet: string;
  type: 'Routine' | 'Lameness' | 'Emergency' | 'Follow-up' | 'Pre-race';
  symptoms: string[]; // reported by grooms/handlers
  findings: string[]; // clinical, professional
  diagnosis: string;
  recommendation: string;
  injuryRegion?: AnatomicalRegion;
  injuryType?: string;
  severity?: InjurySeverity;
  reason?: string;
}

export type TreatmentStatus = 'Planned' | 'Active' | 'Completed' | 'Discontinued';

export interface Medication {
  name: string;
  dose: string;
  route: string;
  frequency: string;
}

export interface TreatmentTask {
  id: string;
  date: string;
  time: string;
  task: string;
  by: string;
  done: boolean;
}

export interface TreatmentPlan {
  id: string;
  title: string;
  status: TreatmentStatus;
  started: string;
  expectedEnd: string;
  vet: string;
  medications: Medication[];
  schedule: TreatmentTask[];
}

export interface MedicalRecord {
  horseId: string;
  restriction?: string; // human-readable restriction summary if under vet restriction
  examinations: Examination[];
  treatment?: TreatmentPlan;
}

export const MEDICAL_RECORDS: Record<string, MedicalRecord> = {
  'h-midnightreign': {
    horseId: 'h-midnightreign',
    restriction: 'Training locked — no ridden work. Controlled hand-walking only.',
    examinations: [
      {
        id: 'ex-mr-1',
        date: '20 Sep 2026, 07:55',
        vet: 'Dr. Haines',
        type: 'Lameness',
        symptoms: ['Heat in left foreleg reported by groom', 'Shortened stride on hard ground'],
        findings: ['Grade 2/5 lameness left fore', 'Localised swelling over SDFT', 'Positive response to flexion'],
        diagnosis: 'Superficial digital flexor tendon (SDFT) strain — left fore',
        recommendation: 'Box rest, cold therapy, controlled hand-walking. Re-scan in 3 days.',
        injuryRegion: 'Left Front Leg',
        injuryType: 'Tendon inflammation',
        severity: 'Moderate',
      },
      {
        id: 'ex-mr-2',
        date: '12 Aug 2026, 09:10',
        vet: 'Dr. Haines',
        type: 'Routine',
        symptoms: [],
        findings: ['Sound on all limbs', 'Clear cardiac and respiratory exam'],
        diagnosis: 'No abnormalities detected',
        recommendation: 'Continue foundation training plan.',
      },
    ],
    treatment: {
      id: 'tr-mr',
      title: 'SDFT strain management',
      status: 'Active',
      started: '20 Sep 2026',
      expectedEnd: '18 Oct 2026',
      vet: 'Dr. Haines',
      medications: [
        { name: 'Phenylbutazone', dose: '2.0 g', route: 'Oral', frequency: 'Once daily · 5 days' },
        { name: 'Cold therapy (cryo-wrap)', dose: '20 min', route: 'Topical', frequency: 'Twice daily' },
      ],
      schedule: [
        { id: 'ts-mr-1', date: '20 Sep', time: '09:00', task: 'Initial tendon assessment', by: 'Dr. Haines', done: true },
        { id: 'ts-mr-2', date: '20 Sep', time: '13:00', task: 'Hand walk · 15 min', by: 'P. Aziz', done: true },
        { id: 'ts-mr-3', date: '21 Sep', time: '09:00', task: 'Cold therapy · left fore', by: 'P. Aziz', done: false },
        { id: 'ts-mr-4', date: '23 Sep', time: '10:30', task: 'Re-scan ultrasound', by: 'Dr. Haines', done: false },
      ],
    },
  },
  'h-desertmirage': {
    horseId: 'h-desertmirage',
    restriction: 'Respiratory isolation — no shared airspace. Training suspended.',
    examinations: [
      {
        id: 'ex-dm-1',
        date: '18 Sep 2026, 08:30',
        vet: 'Dr. Haines',
        type: 'Emergency',
        symptoms: ['Nasal discharge reported by groom', 'Reduced appetite', 'Intermittent cough'],
        findings: ['Pyrexia 39.4°C', 'Bilateral mucopurulent nasal discharge', 'Enlarged submandibular lymph nodes'],
        diagnosis: 'Suspected equine influenza — awaiting PCR confirmation',
        recommendation: 'Isolation, supportive care, monitor temperature q12h. Barn biosecurity protocol.',
      },
    ],
    treatment: {
      id: 'tr-dm',
      title: 'Respiratory infection support',
      status: 'Active',
      started: '18 Sep 2026',
      expectedEnd: '28 Sep 2026',
      vet: 'Dr. Haines',
      medications: [
        { name: 'NSAID (flunixin)', dose: '1.1 mg/kg', route: 'IV', frequency: 'Once daily' },
        { name: 'Electrolyte support', dose: 'Per feed', route: 'Oral', frequency: 'Twice daily' },
      ],
      schedule: [
        { id: 'ts-dm-1', date: '18 Sep', time: '08:00', task: 'Move to isolation', by: 'D. Okafor', done: true },
        { id: 'ts-dm-2', date: '20 Sep', time: '08:00', task: 'Temperature check', by: 'Dr. Haines', done: true },
        { id: 'ts-dm-3', date: '21 Sep', time: '08:00', task: 'PCR result review', by: 'Dr. Haines', done: false },
      ],
    },
  },
  'h-goldenharbor': {
    horseId: 'h-goldenharbor',
    examinations: [
      {
        id: 'ex-gh-1',
        date: '19 Sep 2026, 21:10',
        vet: 'Dr. Haines',
        type: 'Follow-up',
        symptoms: ['Left roughly half of evening feed (groom report)', 'Mild restlessness in stall'],
        findings: ['Normal gut sounds all quadrants', 'Heart rate 40 bpm', 'No abdominal distension'],
        diagnosis: 'Resolving mild spasmodic colic',
        recommendation: 'Resume light work gradually. Small frequent feeds, monitor intake.',
      },
    ],
    treatment: {
      id: 'tr-gh',
      title: 'Digestive recovery',
      status: 'Completed',
      started: '18 Sep 2026',
      expectedEnd: '20 Sep 2026',
      vet: 'Dr. Haines',
      medications: [{ name: 'Buscopan', dose: '0.3 mg/kg', route: 'IV', frequency: 'Single dose' }],
      schedule: [
        { id: 'ts-gh-1', date: '18 Sep', time: '23:40', task: 'Colic assessment', by: 'Dr. Haines', done: true },
        { id: 'ts-gh-2', date: '19 Sep', time: '21:10', task: 'Recovery re-check', by: 'Dr. Haines', done: true },
      ],
    },
  },
  'h-ironwill': {
    horseId: 'h-ironwill',
    examinations: [
      {
        id: 'ex-iw-1',
        date: '19 Sep 2026, 12:00',
        vet: 'Dr. Haines',
        type: 'Follow-up',
        symptoms: ['Slow recovery after work (trainer report)'],
        findings: ['Resting HR 44 bpm (elevated from 34 baseline)', 'No murmur on auscultation'],
        diagnosis: 'Elevated resting heart rate — under investigation',
        recommendation: 'Continuous cardiac telemetry during next 3 sessions. Bloodwork pending.',
      },
    ],
    treatment: {
      id: 'tr-iw',
      title: 'Cardiac monitoring',
      status: 'Active',
      started: '19 Sep 2026',
      expectedEnd: '26 Sep 2026',
      vet: 'Dr. Haines',
      medications: [],
      schedule: [
        { id: 'ts-iw-1', date: '20 Sep', time: '11:30', task: 'Telemetry review', by: 'Dr. Haines', done: true },
        { id: 'ts-iw-2', date: '22 Sep', time: '11:30', task: 'Bloodwork panel', by: 'Dr. Haines', done: false },
      ],
    },
  },
  'h-wintersolstice': {
    horseId: 'h-wintersolstice',
    examinations: [
      {
        id: 'ex-ws-1',
        date: '20 Sep 2026, 10:15',
        vet: 'Dr. Haines',
        type: 'Lameness',
        symptoms: ['Mild filling noticed by groom after work'],
        findings: ['Mild effusion left fore fetlock', 'Sound in straight line', 'No heat'],
        diagnosis: 'Mild fetlock synovitis — low grade',
        recommendation: 'Cold therapy, reduce load to controlled canter, re-check in 5 days.',
      },
    ],
    treatment: {
      id: 'tr-ws',
      title: 'Fetlock management',
      status: 'Active',
      started: '20 Sep 2026',
      expectedEnd: '27 Sep 2026',
      vet: 'Dr. Haines',
      medications: [{ name: 'Cold therapy', dose: '15 min', route: 'Topical', frequency: 'Twice daily' }],
      schedule: [
        { id: 'ts-ws-1', date: '20 Sep', time: '10:30', task: 'Cold therapy — left fore', by: 'Dr. Haines', done: true },
        { id: 'ts-ws-2', date: '25 Sep', time: '10:00', task: 'Re-check fetlock', by: 'Dr. Haines', done: false },
      ],
    },
  },
};

export function getMedicalRecord(horseId: string): MedicalRecord {
  return (
    MEDICAL_RECORDS[horseId] ?? {
      horseId,
      examinations: [
        {
          id: `ex-${horseId}`,
          date: 'No recent examination',
          vet: '—',
          type: 'Routine',
          symptoms: [],
          findings: ['No active findings on record'],
          diagnosis: 'Fit — cleared at last examination',
          recommendation: 'Continue current programme.',
        },
      ],
    }
  );
}
