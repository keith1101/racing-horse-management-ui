import type { IconName } from '../../components/Icon';

export type DocStatus = 'Verified' | 'Pending' | 'Expired' | 'Missing';
export type DocCategory = 'Registration' | 'Medical' | 'Ownership' | 'Insurance';

export interface HorseDocument {
  id: string;
  name: string;
  category: DocCategory;
  status: DocStatus;
  updated: string;
  addedBy: string;
  size: string;
}

export const DOC_CATEGORY_ICON: Record<DocCategory, IconName> = {
  Registration: 'file-text',
  Medical: 'stethoscope',
  Ownership: 'clipboard',
  Insurance: 'shield',
};

/** Per-horse documents; falls back to a standard baseline set. */
const DOCS: Record<string, HorseDocument[]> = {
  'h-midnightreign': [
    { id: 'd-mr-1', name: 'Passport & registration', category: 'Registration', status: 'Verified', updated: '02 Mar 2024', addedBy: 'Registry sync', size: '1.2 MB' },
    { id: 'd-mr-2', name: 'SDFT ultrasound report', category: 'Medical', status: 'Verified', updated: '20 Sep 2026', addedBy: 'Dr. Haines', size: '3.4 MB' },
    { id: 'd-mr-3', name: 'Training restriction notice', category: 'Medical', status: 'Verified', updated: '20 Sep 2026', addedBy: 'Dr. Haines', size: '84 KB' },
    { id: 'd-mr-4', name: 'Ownership agreement', category: 'Ownership', status: 'Verified', updated: '15 Jan 2025', addedBy: 'S. Okafor', size: '512 KB' },
    { id: 'd-mr-5', name: 'Mortality insurance', category: 'Insurance', status: 'Pending', updated: '10 Sep 2026', addedBy: 'Finance', size: '640 KB' },
  ],
  'h-desertmirage': [
    { id: 'd-dm-1', name: 'Passport & registration', category: 'Registration', status: 'Pending', updated: '18 Sep 2026', addedBy: 'Registry sync', size: '1.0 MB' },
    { id: 'd-dm-2', name: 'Influenza PCR result', category: 'Medical', status: 'Pending', updated: '21 Sep 2026', addedBy: 'Dr. Haines', size: '220 KB' },
    { id: 'd-dm-3', name: 'Import health certificate', category: 'Registration', status: 'Expired', updated: '01 Feb 2025', addedBy: 'S. Okafor', size: '780 KB' },
  ],
};

const BASELINE = (id: string): HorseDocument[] => [
  { id: `d-${id}-1`, name: 'Passport & registration', category: 'Registration', status: 'Verified', updated: '12 Jun 2024', addedBy: 'Registry sync', size: '1.1 MB' },
  { id: `d-${id}-2`, name: 'Latest examination report', category: 'Medical', status: 'Verified', updated: '18 Sep 2026', addedBy: 'Dr. Haines', size: '2.1 MB' },
  { id: `d-${id}-3`, name: 'Ownership agreement', category: 'Ownership', status: 'Verified', updated: '20 Feb 2025', addedBy: 'S. Okafor', size: '498 KB' },
  { id: `d-${id}-4`, name: 'Mortality insurance', category: 'Insurance', status: 'Verified', updated: '05 Jan 2026', addedBy: 'Finance', size: '602 KB' },
  { id: `d-${id}-5`, name: 'Vaccination record', category: 'Medical', status: 'Missing', updated: '—', addedBy: '—', size: '—' },
];

export function getDocuments(horseId: string): HorseDocument[] {
  return DOCS[horseId] ?? BASELINE(horseId);
}
