import { useState } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Tabs, type TabItem } from '../../components/Tabs';
import { useRtms } from '../../app/RtmsContext';
import { CandidatesSection } from './CandidatesSection';
import { ContractsSection } from './ContractsSection';
import { InvoicesSection } from './InvoicesSection';
import { AccessControlSection } from './AccessControlSection';
import { AuditLogSection } from './AuditLogSection';
import { CandidateIntakeDrawer } from './CandidateIntakeDrawer';
import { CONTRACTS, INVOICES } from './managementData';

export type ManagementSection = 'candidates' | 'contracts' | 'invoices' | 'access' | 'audit';

const activeContracts = CONTRACTS.filter((c) => c.status === 'Active').length;
const openInvoices = INVOICES.filter((inv) => inv.status === 'Unpaid' || inv.status === 'Overdue').length;

export function ManagementScreen() {
  const { can, currentUser, candidates, getCandidateStatus } = useRtms();
  const [section, setSection] = useState<ManagementSection>('candidates');
  const [intakeOpen, setIntakeOpen] = useState(false);

  const pendingCandidates = candidates.filter((candidate) => !['APPROVED', 'REJECTED'].includes(getCandidateStatus(candidate))).length;

  const tabs: TabItem[] = [
    ...(can('admission.view') ? [{ id: 'candidates', label: 'Admission', icon: 'users' as const, count: pendingCandidates }] : []),
    ...(can('contract.view') ? [{ id: 'contracts', label: 'Contracts', icon: 'file-text' as const, count: activeContracts }] : []),
    ...(can('invoice.view') ? [{ id: 'invoices', label: 'Invoices', icon: 'gauge' as const, count: openInvoices }] : []),
    ...(can('access.manage') ? [{ id: 'access', label: 'Access control', icon: 'shield' as const }] : []),
    ...(can('audit.view') ? [{ id: 'audit', label: 'Audit log', icon: 'clipboard' as const }] : []),
  ];

  const primary = section === 'candidates' && can('admission.submit') ? (
      <Button variant="primary" icon="plus" onClick={() => setIntakeOpen(true)}>
        Submit admission
     </Button>
    ) : undefined;

  return (
    <Screen title={currentUser.role === 'CLUB_MANAGER' ? 'Management' : 'Admissions'} primary={primary}>
      <div className="mb-4">
        <Tabs tabs={tabs} active={section} onChange={(id) => setSection(id as ManagementSection)} />
      </div>

      {section === 'candidates' && <CandidatesSection />}
      {section === 'contracts' && <ContractsSection />}
      {section === 'invoices' && <InvoicesSection />}
      {section === 'access' && <AccessControlSection />}
      {section === 'audit' && <AuditLogSection />}
      <CandidateIntakeDrawer open={intakeOpen} onClose={() => setIntakeOpen(false)} />
    </Screen>
  );
}
