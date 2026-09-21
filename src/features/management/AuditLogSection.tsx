import { Panel, SectionTitle } from '../../components/Panel';
import { Pill } from '../../components/StatusBadge';
import { useRtms } from '../../app/RtmsContext';
import { ROLE_LABELS } from '../../app/access';

export function AuditLogSection() {
  const { auditEvents } = useRtms();
  return (
    <Panel padded>
      <div className="flex items-center justify-between gap-2">
        <SectionTitle>Audit log</SectionTitle>
        <Pill tone="neutral" size="sm">{auditEvents.length} events</Pill>
      </div>
      <div className="mt-4 divide-y divide-[var(--color-border)]">
        {auditEvents.map((event) => (
          <div key={event.id} className="flex flex-wrap items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium text-[var(--color-text-primary)]">{event.action}</div>
              <div className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">{event.detail}</div>
            </div>
            <div className="text-right">
              <div className="text-[12px] text-[var(--color-text-primary)]">{event.actor}</div>
              <div className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{ROLE_LABELS[event.role]} · {event.time}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
