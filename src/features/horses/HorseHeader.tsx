import { Button } from '../../components/Button';
import { HealthBadge, TrainingBadge } from '../../components/StatusBadge';
import { TrainingLockBanner } from '../../components/TrainingLockBanner';
import { HorseAvatar } from './HorseAvatar';
import type { Horse } from './horseData';

interface HorseHeaderProps {
  horse: Horse;
  onTrainingPlan?: () => void;
  onViewRestriction?: () => void;
}

export function HorseHeader({ horse, onTrainingPlan, onViewRestriction }: HorseHeaderProps) {
  return (
    <div className="space-y-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5">
      <div className="flex items-start gap-3.5">
        <HorseAvatar name={horse.name} image={horse.image} size={56} rounded="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[18px] font-semibold leading-tight tracking-tight text-[var(--color-text-primary)]">
              {horse.name}
            </h2>
            <HealthBadge status={horse.health} />
            <TrainingBadge status={horse.training} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-[var(--color-text-secondary)]">
            <span>
              {horse.sex} · {horse.breed} · {horse.ageYears} yrs
            </span>
            <span className="text-[var(--color-border-strong)]">|</span>
            <span>
              {horse.stable} · Stall {horse.stall}
            </span>
            <span className="text-[var(--color-border-strong)]">|</span>
            <span>Owner: {horse.owner}</span>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {onTrainingPlan && <Button variant="primary" size="sm" onClick={onTrainingPlan}>Training plan</Button>}
        </div>
      </div>

      {horse.lock && (
        <TrainingLockBanner
          reason={horse.lock.reason}
          reviewDate={horse.lock.reviewDate}
          veterinarian={horse.lock.veterinarian}
          onView={onViewRestriction}
        />
      )}
    </div>
  );
}
