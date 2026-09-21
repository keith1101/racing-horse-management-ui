import { useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle } from '../../components/Panel';
import { DataTable, type Column } from '../../components/DataTable';
import { Select } from '../../components/Select';
import { Pill } from '../../components/StatusBadge';
import { Drawer } from '../../components/Drawer';
import { useRtms } from '../../app/RtmsContext';
import { INVOICES, type Invoice, type InvoiceStatus, parseMoney, formatMoney } from './managementData';

const statusTone: Record<InvoiceStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  Paid: 'success',
  Unpaid: 'warning',
  Overdue: 'danger',
  Draft: 'neutral',
};

export function InvoicesSection() {
  const { toast, currentUser, can } = useRtms();
  const [overrides, setOverrides] = useState<Record<string, InvoiceStatus>>({});
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const scopedInvoices = useMemo(
    () => currentUser.role === 'HORSE_OWNER' ? INVOICES.filter((invoice) => invoice.owner === currentUser.owner) : INVOICES,
    [currentUser.owner, currentUser.role],
  );
  const status = (inv: Invoice) => overrides[inv.id] ?? inv.status;
  const invoices = useMemo(() => scopedInvoices.map((inv) => ({ ...inv, status: status(inv) })), [overrides, scopedInvoices]);

  const rows = useMemo(
    () => invoices.filter((inv) => !statusFilter || inv.status === statusFilter),
    [invoices, statusFilter],
  );

  const unpaid = invoices.filter((inv) => inv.status === 'Unpaid').length;
  const overdue = invoices.filter((inv) => inv.status === 'Overdue').length;
  const outstanding = invoices
    .filter((inv) => inv.status === 'Unpaid' || inv.status === 'Overdue')
    .reduce((s, inv) => s + parseMoney(inv.amount), 0);

  const selected = invoices.find((inv) => inv.id === selectedId) ?? null;

  const columns: Column<Invoice>[] = [
    { key: 'id', header: 'Invoice #', width: '128px', render: (inv) => <span className="font-metric text-[12px] font-medium">{inv.id}</span>, sortValue: (inv) => inv.id },
    { key: 'owner', header: 'Owner', render: (inv) => <span className="text-[13px] font-medium">{inv.owner}</span>, sortValue: (inv) => inv.owner },
    { key: 'amount', header: 'Amount', align: 'right', render: (inv) => <span className="font-metric text-[13px] font-semibold">{inv.amount}</span>, sortValue: (inv) => parseMoney(inv.amount) },
    { key: 'issued', header: 'Issued', width: '100px', render: (inv) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{inv.issued}</span>, sortValue: (inv) => inv.issued },
    { key: 'due', header: 'Due date', width: '100px', render: (inv) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{inv.dueDate}</span>, sortValue: (inv) => inv.dueDate },
    { key: 'status', header: 'Status', align: 'right', render: (inv) => <Pill tone={statusTone[inv.status]} size="sm">{inv.status}</Pill>, sortValue: (inv) => inv.status },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <MetricCard label="Unpaid" value={unpaid} unit="invoices" icon="clock" tone="warning" />
        <MetricCard label="Overdue" value={overdue} unit="invoices" icon="alert-triangle" tone="danger" />
        <MetricCard label="Outstanding" value={formatMoney(outstanding)} unit="to collect" icon="file-text" />
      </div>

      <Panel padded className="mt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>Invoices</SectionTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              label="Filter by status"
              placeholder="All statuses"
              value={statusFilter}
              onChange={setStatusFilter}
              options={['Paid', 'Unpaid', 'Overdue', 'Draft'].map((s) => ({ value: s, label: s }))}
            />
            {statusFilter && (
              <Button variant="tertiary" size="sm" icon="x" onClick={() => setStatusFilter('')}>
                Clear
              </Button>
            )}
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(inv) => inv.id}
          selectedKey={selectedId ?? undefined}
          onRowClick={(inv) => setSelectedId(inv.id)}
        />
      </Panel>

      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.id : 'Invoice detail'}
        subtitle={selected ? `${selected.owner} · due ${selected.dueDate}` : undefined}
        footer={
          selected && selected.status !== 'Paid' && can('invoice.manage') && (
            <Button variant="primary" icon="check" onClick={() => { setOverrides((p) => ({ ...p, [selected.id]: 'Paid' })); toast(`${selected.id} marked as paid`, 'success'); }}>
              Mark paid
            </Button>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)]">Total due</div>
                <div className="font-metric text-[22px] font-semibold text-[var(--color-text-primary)]">{selected.amount}</div>
              </div>
              <Pill tone={statusTone[selected.status]}>{selected.status}</Pill>
            </div>

            <Panel className="overflow-hidden">
              <div className="border-b border-[var(--color-border)] px-3 py-2.5">
                <SectionTitle>Line items</SectionTitle>
              </div>
              <ul className="divide-y divide-[var(--color-border)]">
                {selected.lineItems.map((li, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <span className="text-[13px] text-[var(--color-text-primary)]">{li.label}</span>
                    <span className="font-metric text-[13px] font-medium text-[var(--color-text-secondary)]">{li.amount}</span>
                  </li>
                ))}
                <li className="flex items-center justify-between gap-3 bg-[var(--color-surface-subtle)] px-3 py-2.5">
                  <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">Total</span>
                  <span className="font-metric text-[13px] font-semibold text-[var(--color-text-primary)]">{selected.amount}</span>
                </li>
              </ul>
            </Panel>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
              <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Issued</span><span className="font-metric text-[var(--color-text-primary)]">{selected.issued}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Due</span><span className="font-metric text-[var(--color-text-primary)]">{selected.dueDate}</span></div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
