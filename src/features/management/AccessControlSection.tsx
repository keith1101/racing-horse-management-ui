import { Panel, SectionTitle } from '../../components/Panel';
import { Pill } from '../../components/StatusBadge';
import { Icon } from '../../components/Icon';
import { useRtms } from '../../app/RtmsContext';
import { getVisibleModules, PERMISSION_LABELS, ROLE_LABELS, ROLE_PERMISSIONS, type Role } from '../../app/access';

const roles = Object.keys(ROLE_LABELS) as Role[];

export function AccessControlSection() {
  const { currentUser } = useRtms();
  return (
    <div className="space-y-4">
      <Panel padded>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <SectionTitle>Role-based access control</SectionTitle>
          </div>
          <Pill tone="info" icon="shield">Current: {currentUser.roleLabel}</Pill>
        </div>
      </Panel>

      <Panel className="overflow-hidden p-0">
        <div className="grid grid-cols-[180px_minmax(0,1fr)] border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          <span>Role</span>
          <span>Visible modules</span>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {roles.map((role) => (
            <div key={role} className={`grid grid-cols-[180px_minmax(0,1fr)] gap-3 px-3 py-3 ${role === currentUser.role ? 'bg-[var(--color-primary-subtle)]' : ''}`}>
              <div>
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-text-primary)]">
                  {role === currentUser.role && <Icon name="check" size={13} className="text-[var(--color-primary)]" />}
                  {ROLE_LABELS[role]}
                </div>
                <div className="mt-0.5 text-[10px] font-mono text-[var(--color-text-muted)]">{role}</div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getVisibleModules(role).map((module) => (
                  <Pill key={module} tone="neutral" size="sm">{module.replace('-', ' ')}</Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel padded>
        <SectionTitle>Permission model</SectionTitle>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {Array.from(new Set(Object.values(ROLE_PERMISSIONS).flat())).map((permission) => (
            <div key={permission} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2.5 py-2">
              <div className="text-[12px] font-medium text-[var(--color-text-primary)]">{PERMISSION_LABELS[permission]}</div>
              <div className="mt-0.5 font-mono text-[10px] text-[var(--color-text-muted)]">{permission}</div>
              <div className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                {roles.filter((role) => ROLE_PERMISSIONS[role].includes(permission)).map((role) => ROLE_LABELS[role]).join(' · ')}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
