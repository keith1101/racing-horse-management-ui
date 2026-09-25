import { Panel, SectionTitle } from '../../../../components/Panel';
import { HealthBadge, Pill } from '../../../../components/StatusBadge';
import { Icon } from '../../../../components/Icon';
import { HorseAvatar } from '../../../horses/HorseAvatar';
import { useRtms } from '../../../../app/RtmsContext';

function getHighLevelStatusNote(health: string, isLocked: boolean) {
  if (isLocked) return 'Training restriction active';
  if (health === 'INJURED') return 'Veterinary follow-up required';
  if (health === 'ISOLATED') return 'Biosecurity quarantine active';
  if (health === 'MONITOR') return 'Observation & vital monitoring active';
  return 'Normal stabling protocol';
}

export function ManagerAttentionCard() {
  const { horses, isLocked, can, navigate } = useRtms();

  const canViewPrivateMedical = can('medical.private.view');
  const attentionHorses = horses.filter(
    (h) => h.health === 'INJURED' || h.health === 'ISOLATED' || h.health === 'MONITOR' || isLocked(h.id),
  );

  return (
    <Panel padded>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="alert-triangle" size={15} className="text-[var(--color-danger)]" />
          <SectionTitle>Requires attention</SectionTitle>
        </div>
        <span className="rounded-full bg-[var(--color-danger-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-danger)]">
          {attentionHorses.length} alerts
        </span>
      </div>

      <p className="mb-3 text-[12px] text-[var(--color-text-secondary)]">
        Horses requiring administrative awareness due to injury, quarantine, or training restrictions.
      </p>

      {attentionHorses.length === 0 ? (
        <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] p-4 text-center">
          <Icon name="check" size={18} className="mx-auto text-[var(--color-success)]" />
          <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
            All horses cleared. No active clinical or quarantine restrictions.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {attentionHorses.map((h) => {
            const locked = isLocked(h.id);
            const statusSummary = canViewPrivateMedical
              ? h.healthNote
              : getHighLevelStatusNote(h.health, locked);

            return (
              <button
                key={h.id}
                onClick={() => navigate('horses', { horseId: h.id })}
                className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-left outline-none transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <HorseAvatar name={h.name} image={h.image} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[13px] font-medium text-[var(--color-text-primary)]">
                      {h.name}
                    </span>
                    {locked && (
                      <Pill tone="danger" size="sm" icon="lock">
                        Restricted
                      </Pill>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)]">
                    <span>{h.stable} · {h.stall}</span>
                    <span>·</span>
                    <span className="truncate">{statusSummary}</span>
                  </div>
                </div>
                <HealthBadge status={h.health} size="sm" />
              </button>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
