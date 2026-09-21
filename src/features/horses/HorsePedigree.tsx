import type { ReactNode } from 'react';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import type { Horse } from './horseData';
import { buildPedigree, registryInfo, type Ancestor, type RegistryStatus } from './pedigreeData';

const registryTone: Record<RegistryStatus, 'success' | 'neutral' | 'info' | 'warning'> = {
  Verified: 'success',
  Unverified: 'neutral',
  'Verification pending': 'info',
  'Registry unavailable': 'warning',
};

const registryIcon: Record<RegistryStatus, Parameters<typeof Pill>[0]['icon']> = {
  Verified: 'check',
  Unverified: 'minus',
  'Verification pending': 'clock',
  'Registry unavailable': 'alert-triangle',
};

export function HorsePedigree({ horse }: { horse: Horse }) {
  const tree = buildPedigree(horse);
  const info = registryInfo(horse);

  return (
    <div className="space-y-4">
      <Panel padded>
        <div className="flex items-center justify-between">
          <SectionTitle>Pedigree — three generations</SectionTitle>
          <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-1"><Icon name="git-branch" size={12} /> Paternal line</span>
            <span className="inline-flex items-center gap-1"><Icon name="git-branch" size={12} className="rotate-90" /> Maternal line</span>
          </div>
        </div>

        {/* 3-column generation grid: subject | parents | grandparents */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_1fr_1fr]">
          {/* Gen 1 — subject */}
          <div className="flex md:items-center">
            <AncestorCard a={tree.horse} subject image={horse.image} />
          </div>

          {/* Gen 2 — parents */}
          <div className="flex flex-col justify-center gap-3">
            <LineGroup label="Sire line (paternal)" line="paternal">
              <AncestorCard a={tree.sire} />
            </LineGroup>
            <LineGroup label="Dam line (maternal)" line="maternal">
              <AncestorCard a={tree.dam} />
            </LineGroup>
          </div>

          {/* Gen 3 — grandparents */}
          <div className="flex flex-col justify-center gap-3">
            <LineGroup label="Paternal grandparents" line="paternal">
              <AncestorCard a={tree.paternalGrandsire} compact />
              <AncestorCard a={tree.paternalGranddam} compact />
            </LineGroup>
            <LineGroup label="Maternal grandparents" line="maternal">
              <AncestorCard a={tree.maternalGrandsire} compact />
              <AncestorCard a={tree.maternalGranddam} compact />
            </LineGroup>
          </div>
        </div>
      </Panel>

      {/* Registry info */}
      <Panel padded>
        <SectionTitle>Registry verification</SectionTitle>
        <div className="mt-2 flex items-center gap-2">
          <Pill tone={registryTone[info.status]} icon={registryIcon[info.status]}>{info.status}</Pill>
          <span className="text-[12px] text-[var(--color-text-secondary)]">{info.registryName}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          <Meta label="Registration no." value={info.registrationNo ?? '—'} />
          <Meta label="Studbook" value={info.studbook ?? '—'} />
          <Meta label="Microchip" value={horse.microchip} mono />
          <Meta label="Last synced" value={info.lastSynced ?? 'Not synced'} />
        </div>
        <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-relaxed text-[var(--color-text-muted)]">
          <Icon name="shield" size={13} className="mt-0.5 shrink-0" />
          {info.note}
        </p>
      </Panel>
    </div>
  );
}

function LineGroup({ label, line, children }: { label: string; line: 'paternal' | 'maternal'; children: ReactNode }) {
  return (
    <div
      className={
        'rounded-[var(--radius-md)] border-l-2 pl-3 ' +
        (line === 'paternal' ? 'border-[var(--color-primary)]' : 'border-[var(--color-info)]')
      }
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon name="git-branch" size={11} className={line === 'maternal' ? 'rotate-90 text-[var(--color-info)]' : 'text-[var(--color-primary)]'} />
        <FieldLabel>{label}</FieldLabel>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function AncestorCard({ a, subject, compact, image }: { a: Ancestor; subject?: boolean; compact?: boolean; image?: string }) {
  const unknown = a.name === 'Unrecorded';
  return (
    <div
      className={
        'rounded-[var(--radius-md)] border bg-[var(--color-surface)] ' +
        (subject ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] p-3' : 'border-[var(--color-border)] p-2.5') +
        (unknown ? ' border-dashed opacity-70' : '')
      }
    >
      <div className="flex items-center gap-2">
        {subject && image && (
          <img src={image} alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-[var(--radius-sm)] object-cover" />
        )}
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">{a.role}</div>
          <div className={'truncate font-medium text-[var(--color-text-primary)] ' + (subject ? 'text-[14px]' : compact ? 'text-[12px]' : 'text-[13px]')}>
            {a.name}
          </div>
        </div>
      </div>
      {!unknown && (a.notable || !subject) && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <Pill tone={registryTone[a.registry]} icon={registryIcon[a.registry]} size="sm">{a.registry}</Pill>
          {a.notable && <span className="text-[10px] text-[var(--color-text-muted)]">{a.notable}</span>}
        </div>
      )}
    </div>
  );
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">{label}</div>
      <div className={'text-[12px] text-[var(--color-text-primary)] ' + (mono ? 'font-metric' : '')}>{value}</div>
    </div>
  );
}
