import type { Horse } from './horseData';

export type RegistryStatus = 'Verified' | 'Unverified' | 'Verification pending' | 'Registry unavailable';

export interface Ancestor {
  name: string;
  role: string; // Sire, Dam, Paternal grandsire, etc.
  line: 'paternal' | 'maternal' | 'self';
  yearFoaled?: string;
  notable?: string; // e.g. "G1 winner"
  registry: RegistryStatus;
}

export interface PedigreeTree {
  horse: Ancestor;
  sire: Ancestor;
  dam: Ancestor;
  paternalGrandsire: Ancestor;
  paternalGranddam: Ancestor;
  maternalGrandsire: Ancestor;
  maternalGranddam: Ancestor;
}

export interface RegistryInfo {
  status: RegistryStatus;
  registryName: string;
  registrationNo?: string;
  studbook?: string;
  lastSynced?: string;
  note: string;
}

/** Explicit grandparent data for horses where it is known. */
const GRANDPARENTS: Record<
  string,
  {
    ps: string; // paternal grandsire
    pd: string; // paternal granddam
    ms: string; // maternal grandsire
    md: string; // maternal granddam
    notable?: Partial<Record<'sire' | 'dam' | 'ps' | 'pd' | 'ms' | 'md', string>>;
  }
> = {
  'h-thunderbolt': { ps: 'Thunderstruck', pd: 'Silken Cat', ms: 'Velvet King', md: 'Dawn Chorus', notable: { sire: 'G1 sire', ps: 'Champion sire' } },
  'h-midnightreign': { ps: 'Total Eclipse', pd: 'Regal Star', ms: 'Nocturne', md: 'Sonata Rose', notable: { dam: 'G2 winner' } },
  'h-wintersolstice': { ps: 'Aurora Borealis', pd: 'North Wind', ms: 'Winter King', md: 'Lily of the Valley' },
  'h-silvercomet': { ps: 'Mercury Rising', pd: 'Silver Lining', ms: 'Halley', md: "Comet's Wake" },
  'h-emberqueen': { ps: 'Wildfire', pd: 'Cinder Belle', ms: 'Graceland', md: 'Amber Light', notable: { ps: 'G1 winner' } },
};

function ancestor(name: string, role: string, line: Ancestor['line'], registry: RegistryStatus, notable?: string): Ancestor {
  return { name, role, line, registry, notable };
}

export function buildPedigree(horse: Horse): PedigreeTree {
  const g = GRANDPARENTS[horse.id];
  // Registry reliability degrades further back and for non-Thoroughbreds.
  const base: RegistryStatus = horse.breed === 'Thoroughbred' ? 'Verified' : 'Registry unavailable';
  const gp: RegistryStatus = base === 'Verified' ? (g ? 'Verified' : 'Verification pending') : 'Unverified';
  const n = g?.notable ?? {};

  return {
    horse: ancestor(horse.name, 'Subject', 'self', base),
    sire: ancestor(horse.sire, 'Sire', 'paternal', base, n.sire),
    dam: ancestor(horse.dam, 'Dam', 'maternal', base, n.dam),
    paternalGrandsire: ancestor(g?.ps ?? 'Unrecorded', 'Paternal grandsire', 'paternal', g ? gp : 'Registry unavailable', n.ps),
    paternalGranddam: ancestor(g?.pd ?? 'Unrecorded', 'Paternal granddam', 'paternal', g ? gp : 'Registry unavailable', n.pd),
    maternalGrandsire: ancestor(g?.ms ?? 'Unrecorded', 'Maternal grandsire', 'maternal', g ? gp : 'Registry unavailable', n.ms),
    maternalGranddam: ancestor(g?.md ?? 'Unrecorded', 'Maternal granddam', 'maternal', g ? gp : 'Registry unavailable', n.md),
  };
}

export function registryInfo(horse: Horse): RegistryInfo {
  if (horse.breed === 'Thoroughbred') {
    return {
      status: 'Verified',
      registryName: 'General Stud Book',
      registrationNo: `GSB-${horse.microchip.slice(-6).replace(/\s/g, '')}`,
      studbook: 'Weatherbys',
      lastSynced: '18 Sep 2026',
      note: 'Identity and parentage confirmed against the studbook. Ready for future SIRE / Équidés integration.',
    };
  }
  if (horse.breed === 'Arabian') {
    return {
      status: 'Registry unavailable',
      registryName: 'WAHO Studbook',
      note: 'No matching record returned on last lookup. Parentage shown is owner-declared and awaiting external verification.',
    };
  }
  return {
    status: 'Verification pending',
    registryName: 'National Studbook',
    note: 'Verification request submitted; awaiting registry confirmation.',
  };
}
