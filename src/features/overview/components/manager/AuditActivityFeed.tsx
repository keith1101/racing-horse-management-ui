import { Panel, SectionTitle } from '../../../../components/Panel';
import { Icon, type IconName } from '../../../../components/Icon';
import { Pill } from '../../../../components/StatusBadge';
import { useRtms } from '../../../../app/RtmsContext';
import type { Role } from '../../../../app/access';

function getRoleTone(role: Role): 'primary' | 'info' | 'warning' | 'neutral' {
  switch (role) {
    case 'HEAD_TRAINER':
      return 'info';
    case 'VETERINARIAN':
      return 'warning';
    case 'CLUB_MANAGER':
      return 'primary';
    case 'GROOM':
      return 'neutral';
    case 'HORSE_OWNER':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getActionIcon(action: string): IconName {
  const lower = action.toLowerCase();
  if (lower.includes('workout') || lower.includes('training')) return 'activity';
  if (lower.includes('exam') || lower.includes('medical') || lower.includes('lock')) return 'stethoscope';
  if (lower.includes('care') || lower.includes('feed') || lower.includes('stall')) return 'building';
  if (lower.includes('race') || lower.includes('propos')) return 'flag';
  if (lower.includes('candidate') || lower.includes('admission')) return 'clipboard';
  return 'bell';
}

export function AuditActivityFeed() {
  const { auditEvents, can, navigate } = useRtms();

  const recentEvents = auditEvents.slice(0, 6);
  const canViewAudit = can('audit.view');

  return (
    <Panel padded>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="clipboard" size={15} className="text-[var(--color-primary)]" />
          <SectionTitle>Recent System Activity</SectionTitle>
        </div>
        {canViewAudit && (
          <button
            onClick={() => navigate('management')}
            className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
          >
            Audit log
          </button>
        )}
      </div>

      <p className="mb-3 text-[12px] text-[var(--color-text-secondary)]">
        Cross-departmental operational timeline recorded across trainer, vet, groom, and management workflows.
      </p>

      {recentEvents.length === 0 ? (
        <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] p-4 text-center">
          <p className="text-[12px] text-[var(--color-text-muted)]">
            No system activity recorded yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {recentEvents.map((evt) => {
            const icon = getActionIcon(evt.action);
            const roleTone = getRoleTone(evt.role);

            return (
              <div
                key={evt.id}
                className="flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-2.5 text-[12px]"
              >
                <div className="mt-0.5 rounded-[var(--radius-xs)] bg-[var(--color-surface-subtle)] p-1 text-[var(--color-text-secondary)]">
                  <Icon name={icon} size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="truncate font-medium text-[var(--color-text-primary)]">
                        {evt.actor}
                      </span>
                      <Pill tone={roleTone} size="sm">
                        {evt.role.replace('_', ' ')}
                      </Pill>
                    </div>
                    <span className="shrink-0 font-metric text-[10px] text-[var(--color-text-muted)]">
                      {evt.time}
                    </span>
                  </div>
                  <div className="mt-0.5 font-medium text-[var(--color-text-primary)]">
                    {evt.action}
                  </div>
                  {evt.detail && (
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--color-text-secondary)]">
                      {evt.detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
