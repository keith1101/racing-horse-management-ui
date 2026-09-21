import { useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { DataTable, type Column } from '../../components/DataTable';
import { Select } from '../../components/Select';
import { Pill } from '../../components/StatusBadge';
import { Drawer } from '../../components/Drawer';
import { HorseAvatar } from '../horses/HorseAvatar';
import { useRtms } from '../../app/RtmsContext';
import { CONTRACTS, type Contract, type ContractStatus, parseMoney, formatMoney } from './managementData';

const statusTone: Record<ContractStatus, 'success' | 'info' | 'neutral' | 'danger'> = {
  Active: 'success',
  Pending: 'info',
  Expired: 'neutral',
  Terminated: 'danger',
};

export function ContractsSection() {
  const { navigate, getHorse, currentUser } = useRtms();
  const [ownerFilter, setOwnerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const scopedContracts = useMemo(
    () => currentUser.role === 'HORSE_OWNER' ? CONTRACTS.filter((contract) => contract.owner === currentUser.owner) : CONTRACTS,
    [currentUser.owner, currentUser.role],
  );
  const owners = useMemo(() => Array.from(new Set(scopedContracts.map((c) => c.owner))), [scopedContracts]);

  const rows = useMemo(
    () =>
      scopedContracts.filter(
        (c) => (!ownerFilter || c.owner === ownerFilter) && (!statusFilter || c.status === statusFilter),
      ),
    [ownerFilter, scopedContracts, statusFilter],
  );

  const active = scopedContracts.filter((c) => c.status === 'Active').length;
  const pending = scopedContracts.filter((c) => c.status === 'Pending').length;
  const monthlyValue = scopedContracts.filter((c) => c.status === 'Active').reduce((s, c) => s + parseMoney(c.monthlyFee), 0);

  const selected = scopedContracts.find((c) => c.id === selectedId) ?? null;
  const hasFilters = !!ownerFilter || !!statusFilter;

  const columns: Column<Contract>[] = [
    { key: 'owner', header: 'Owner', render: (c) => <span className="text-[13px] font-medium">{c.owner}</span>, sortValue: (c) => c.owner },
    {
      key: 'horse',
      header: 'Horse',
      render: (c) => {
        const horse = getHorse(c.horseId);
        return (
          <div className="flex items-center gap-2">
            <HorseAvatar name={c.horseName} image={horse?.image} size={26} />
            <button
              onClick={(e) => { e.stopPropagation(); navigate('horses', { horseId: c.horseId }); }}
              className="text-[13px] font-medium hover:underline"
            >
              {c.horseName}
            </button>
          </div>
        );
      },
      sortValue: (c) => c.horseName,
    },
    { key: 'start', header: 'Start', width: '100px', render: (c) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{c.startDate}</span>, sortValue: (c) => c.startDate },
    { key: 'end', header: 'End', width: '100px', render: (c) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{c.endDate}</span>, sortValue: (c) => c.endDate },
    { key: 'fee', header: 'Monthly fee', align: 'right', render: (c) => <span className="font-metric text-[13px] font-semibold">{c.monthlyFee}</span>, sortValue: (c) => parseMoney(c.monthlyFee) },
    { key: 'status', header: 'Status', align: 'right', render: (c) => <Pill tone={statusTone[c.status]} size="sm">{c.status}</Pill>, sortValue: (c) => c.status },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <MetricCard label="Active contracts" value={active} unit="running" icon="file-text" tone="success" />
        <MetricCard label="Pending" value={pending} unit="awaiting sign" icon="clock" tone="info" />
        <MetricCard label="Monthly value" value={formatMoney(monthlyValue)} unit="active / mo" icon="trending-up" />
      </div>

      <Panel padded className="mt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>Contracts</SectionTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              label="Filter by owner"
              placeholder="All owners"
              value={ownerFilter}
              onChange={setOwnerFilter}
              options={owners.map((o) => ({ value: o, label: o }))}
            />
            <Select
              label="Filter by status"
              placeholder="All statuses"
              value={statusFilter}
              onChange={setStatusFilter}
              options={['Active', 'Pending', 'Expired', 'Terminated'].map((s) => ({ value: s, label: s }))}
            />
            {hasFilters && (
              <Button variant="tertiary" size="sm" icon="x" onClick={() => { setOwnerFilter(''); setStatusFilter(''); }}>
                Clear
              </Button>
            )}
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(c) => c.id}
          selectedKey={selectedId ?? undefined}
          onRowClick={(c) => setSelectedId(c.id)}
        />
      </Panel>

      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.horseName : 'Contract detail'}
        subtitle={selected ? `${selected.owner} · ${selected.id.toUpperCase()}` : undefined}
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <HorseAvatar name={selected.horseName} image={getHorse(selected.horseId)?.image} size={48} rounded="md" />
              <div className="min-w-0">
                <button onClick={() => navigate('horses', { horseId: selected.horseId })} className="text-[15px] font-semibold text-[var(--color-text-primary)] hover:underline">
                  {selected.horseName}
                </button>
                <div className="mt-1"><Pill tone={statusTone[selected.status]} size="sm">{selected.status}</Pill></div>
              </div>
            </div>

            <Panel padded>
              <SectionTitle>Terms</SectionTitle>
              <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2">
                <DetailField label="Owner" value={selected.owner} />
                <DetailField label="Monthly fee" value={selected.monthlyFee} metric />
                <DetailField label="Start date" value={selected.startDate} metric />
                <DetailField label="End date" value={selected.endDate} metric />
              </div>
            </Panel>

            <Panel padded>
              <SectionTitle>Notes</SectionTitle>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">{selected.notes}</p>
            </Panel>
          </div>
        )}
      </Drawer>
    </>
  );
}

function DetailField({ label, value, metric }: { label: string; value: string; metric?: boolean }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className={'mt-0.5 text-[13px] text-[var(--color-text-primary)] ' + (metric ? 'font-metric' : '')}>{value}</div>
    </div>
  );
}
