import { FieldLabel } from "../../components/Panel"
import { Icon } from "../../components/Icon"
import { Horse3DCanvas } from "./Horse3DCanvas"
import {
  ANATOMICAL_REGIONS,
  type AnatomicalRegion,
  type InjurySeverity,
} from "./medicalData"

interface Injury3DViewerProps {
  hasInjury: boolean
  onHasInjuryChange: (value: boolean) => void
  selectedRegion: AnatomicalRegion
  onRegionChange: (region: AnatomicalRegion) => void
  injuryType: string
  onInjuryTypeChange: (value: string) => void
  severity: InjurySeverity
  onSeverityChange: (severity: InjurySeverity) => void
  applyRestriction: boolean
  onRestrictionChange: (value: boolean) => void
}

const INJURY_TYPES = [
  "Soft tissue / lameness",
  "Tendon inflammation",
  "Joint swelling",
  "Wound / skin lesion",
  "Fracture concern",
  "Other",
]

const SEVERITIES: InjurySeverity[] = ["Mild", "Moderate", "Severe"]

function severityClasses(value: InjurySeverity, selected: boolean) {
  const base =
    "rounded-[var(--radius-xs)] border px-2 py-2 text-[12px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-55"
  if (!selected)
    return `${base} border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]`
  if (value === "Severe")
    return `${base} border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]`
  if (value === "Moderate")
    return `${base} border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]`
  return `${base} border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]`
}

export function Injury3DViewer({
  hasInjury,
  onHasInjuryChange,
  selectedRegion,
  onRegionChange,
  injuryType,
  onInjuryTypeChange,
  severity,
  onSeverityChange,
  applyRestriction,
  onRestrictionChange,
}: Injury3DViewerProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(250px,0.75fr)]">
      <div className="min-w-0">
        {hasInjury ? (
          <Horse3DCanvas
            selectedRegion={selectedRegion}
            onRegionChange={onRegionChange}
          />
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] p-6 text-center">
            <Icon
              name="target"
              size={24}
              className="text-[var(--color-text-muted)]"
            />
            <p className="mt-2 text-[13px] font-medium text-[var(--color-text-primary)]">
              No injury location recorded
            </p>
            <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
              Enable injury mapping to load the 3D horse and select one of the
              fourteen anatomical regions.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <label className="flex cursor-pointer items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
          <input
            type="checkbox"
            checked={hasInjury}
            onChange={(event) => onHasInjuryChange(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-text-primary)]">
              <Icon name="target" size={13} />
              Record injury location
            </span>
            <span className="mt-1 block text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
              Use the GLB model or the region selector to record a high-level
              anatomical location.
            </span>
          </span>
        </label>

        <div>
          <FieldLabel>Selected anatomical region</FieldLabel>
          <select
            value={selectedRegion}
            disabled={!hasInjury}
            onChange={(event) =>
              onRegionChange(event.target.value as AnatomicalRegion)
            }
            className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none disabled:cursor-not-allowed disabled:opacity-55 focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
            aria-label="Selected anatomical region"
          >
            {ANATOMICAL_REGIONS.map((region) => (
              <option key={region}>{region}</option>
            ))}
          </select>
          <p
            className="mt-1 text-[11px] text-[var(--color-text-secondary)]"
            aria-live="polite"
          >
            {hasInjury
              ? `Selected: ${selectedRegion}`
              : "No injury location selected."}
          </p>
        </div>

        <div>
          <FieldLabel>Injury type</FieldLabel>
          <select
            value={injuryType}
            disabled={!hasInjury}
            onChange={(event) => onInjuryTypeChange(event.target.value)}
            className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none disabled:cursor-not-allowed disabled:opacity-55 focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
            aria-label="Injury type"
          >
            {INJURY_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel>Severity</FieldLabel>
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            {SEVERITIES.map((value) => (
              <button
                key={value}
                type="button"
                disabled={!hasInjury}
                onClick={() => onSeverityChange(value)}
                className={severityClasses(value, severity === value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
          <input
            type="checkbox"
            checked={applyRestriction}
            onChange={(event) => onRestrictionChange(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-text-primary)]">
              <Icon name="lock" size={13} />
              Apply training restriction
            </span>
            <span className="mt-1 block text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
              Blocks training scheduling until the next veterinary review.
            </span>
          </span>
        </label>

        <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
          <FieldLabel>Recorded location</FieldLabel>
          <p className="mt-1 text-[14px] font-semibold text-[var(--color-text-primary)]">
            {hasInjury ? selectedRegion : "No injury location"}
          </p>
        </div>
      </div>
    </div>
  )
}
