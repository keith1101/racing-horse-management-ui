export type ContractStatus = 'Active' | 'Pending' | 'Expired' | 'Terminated';

export interface Contract {
  id: string;
  owner: string;
  horseId: string;
  horseName: string;
  startDate: string;
  endDate: string;
  monthlyFee: string;
  status: ContractStatus;
  notes: string;
}

export type InvoiceStatus = 'Paid' | 'Unpaid' | 'Overdue' | 'Draft';

export interface InvoiceLineItem {
  label: string;
  amount: string;
}

export interface Invoice {
  id: string;
  owner: string;
  amount: string;
  issued: string;
  dueDate: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
}

export const CONTRACTS: Contract[] = [
  {
    id: 'con-1',
    owner: 'Marlowe Racing Ltd.',
    horseId: 'h-thunderbolt',
    horseName: 'Thunder Bolt',
    startDate: '01 Jan 2026',
    endDate: '31 Dec 2026',
    monthlyFee: '£2,400',
    status: 'Active',
    notes: 'Full training and stabling package. Includes farrier and routine veterinary at cost.',
  },
  {
    id: 'con-2',
    owner: 'Ashgrove Stud',
    horseId: 'h-wintersolstice',
    horseName: 'Winter Solstice',
    startDate: '01 Mar 2026',
    endDate: '28 Feb 2027',
    monthlyFee: '£2,150',
    status: 'Active',
    notes: 'Standard training agreement. Owner requests weekly progress reports.',
  },
  {
    id: 'con-3',
    owner: 'Marlowe Racing Ltd.',
    horseId: 'h-silvercomet',
    horseName: 'Silver Comet',
    startDate: '15 Oct 2026',
    endDate: '14 Oct 2027',
    monthlyFee: '£2,600',
    status: 'Pending',
    notes: 'Awaiting countersignature. Premium spelling paddock included pending confirmation.',
  },
  {
    id: 'con-4',
    owner: 'Hollowbrook Partners',
    horseId: 'h-royalcadence',
    horseName: 'Royal Cadence',
    startDate: '01 Jun 2025',
    endDate: '31 May 2026',
    monthlyFee: '£1,950',
    status: 'Expired',
    notes: 'Term completed. Renewal discussion scheduled with owner for next season.',
  },
  {
    id: 'con-5',
    owner: 'Crescent Bloodstock',
    horseId: 'h-ironwill',
    horseName: 'Iron Will',
    startDate: '01 Feb 2026',
    endDate: '31 Jul 2026',
    monthlyFee: '£2,300',
    status: 'Terminated',
    notes: 'Ended early at owner request following relocation. No outstanding balance.',
  },
];

export const INVOICES: Invoice[] = [
  {
    id: 'INV-2026-011',
    owner: 'Marlowe Racing Ltd.',
    amount: '£3,120',
    issued: '01 Aug 2026',
    dueDate: '31 Aug 2026',
    status: 'Paid',
    lineItems: [
      { label: 'Training fee — Thunder Bolt (Aug)', amount: '£2,400' },
      { label: 'Farrier services', amount: '£180' },
      { label: 'Veterinary — routine check', amount: '£540' },
    ],
  },
  {
    id: 'INV-2026-012',
    owner: 'Ashgrove Stud',
    amount: '£2,150',
    issued: '01 Sep 2026',
    dueDate: '30 Sep 2026',
    status: 'Unpaid',
    lineItems: [
      { label: 'Training fee — Winter Solstice (Sep)', amount: '£2,150' },
    ],
  },
  {
    id: 'INV-2026-013',
    owner: 'Hollowbrook Partners',
    amount: '£2,610',
    issued: '20 Jul 2026',
    dueDate: '19 Aug 2026',
    status: 'Overdue',
    lineItems: [
      { label: 'Training fee — Royal Cadence (Jul)', amount: '£1,950' },
      { label: 'Transport to trial', amount: '£360' },
      { label: 'Physiotherapy sessions', amount: '£300' },
    ],
  },
  {
    id: 'INV-2026-014',
    owner: 'Marlowe Racing Ltd.',
    amount: '£2,400',
    issued: '01 Sep 2026',
    dueDate: '30 Sep 2026',
    status: 'Unpaid',
    lineItems: [
      { label: 'Training fee — Thunder Bolt (Sep)', amount: '£2,400' },
    ],
  },
  {
    id: 'INV-2026-015',
    owner: 'Crescent Bloodstock',
    amount: '£2,300',
    issued: '01 Jul 2026',
    dueDate: '31 Jul 2026',
    status: 'Paid',
    lineItems: [
      { label: 'Training fee — Iron Will (Jul)', amount: '£2,300' },
    ],
  },
  {
    id: 'INV-2026-016',
    owner: 'Marlowe Racing Ltd.',
    amount: '£2,600',
    issued: '15 Sep 2026',
    dueDate: '15 Oct 2026',
    status: 'Draft',
    lineItems: [
      { label: 'Training fee — Silver Comet (Oct, provisional)', amount: '£2,600' },
    ],
  },
];

/** Parse a '£2,400' style string into a number for aggregation. */
export function parseMoney(value: string): number {
  return Number(value.replace(/[^0-9.]/g, '')) || 0;
}

/** Format a number back into the '£2,400' display convention. */
export function formatMoney(value: number): string {
  return '£' + value.toLocaleString('en-GB');
}
