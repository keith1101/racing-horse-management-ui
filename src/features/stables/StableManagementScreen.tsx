import { useMemo } from "react"
import { Button } from "../../components/Button"
import { Icon } from "../../components/Icon"
import { MetricCard } from "../../components/MetricCard"
import { Panel, SectionTitle } from "../../components/Panel"
import { ProgressBar } from "../../components/ProgressBar"
import { EmptyState } from "../../components/states"
import { HealthBadge, Pill } from "../../components/StatusBadge"
import { Screen } from "../../components/Screen"
import { HorseAvatar } from "../horses/HorseAvatar"
import type { Horse } from "../horses/horseData"
import {
  MEDICAL_ISOLATION_STABLE,
  QUARANTINE_STALLS,
  REGULAR_STALLS,
  type StallSlot,
} from "./stableData"

type HorseCurrentStatus = NonNullable<Horse["currentStatus"]>

export interface StableManagementScreenProps {
  /** Includes active horses and candidate horse records created after Groom review. */
  horses: readonly Horse[]
  /** Opens the horse profile or candidate detail for the selected record. */
  onOpenHorse?: (horse: Horse) => void
  /** Pass only when the current role can open Manager admissions review. */
  onOpenAdmissions?: () => void
}

interface SlotOccupancy extends StallSlot {
  horses: Horse[]
}

const BARN_NAMES = ["Barn A", "Barn B", "Barn C", "Barn D"]

const BARN_SUBTITLES: Record<string, string> = {
  "Barn A": "Active racing & high performance",
  "Barn B": "Conditioning & maintenance",
  "Barn C": "Recovery & young horses",
  "Barn D": "General stabling",
}

function currentStatus(horse: Horse): HorseCurrentStatus {
  // Existing official horses predate this optional lifecycle marker, so they remain eligible.
  return horse.currentStatus ?? "ELIGIBLE"
}

function makeOccupancies(
  slots: readonly StallSlot[],
  horses: readonly Horse[],
): SlotOccupancy[] {
  return slots.map((slot) => ({
    ...slot,
    horses: horses.filter(
      (horse) => horse.stable === slot.stable && horse.stall === slot.stall,
    ),
  }))
}

function HorseIdentity({
  horse,
  onOpenHorse,
  compact = false,
}: {
  horse: Horse
  onOpenHorse?: (horse: Horse) => void
  compact?: boolean
}) {
  const content = (
    <>
      <HorseAvatar
        name={horse.name}
        image={horse.image}
        size={compact ? 28 : 38}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] font-semibold text-[var(--color-text-primary)]">
          {horse.name}
        </span>
        {!compact && (
          <span className="block truncate text-[11px] text-[var(--color-text-secondary)]">
            {horse.owner} · {horse.ageYears}yo {horse.sex} · {horse.breed}
          </span>
        )}
      </span>
      {onOpenHorse && (
        <Icon
          name="chevron-right"
          size={13}
          className="shrink-0 text-[var(--color-text-muted)]"
        />
      )}
    </>
  )

  if (onOpenHorse) {
    return (
      <button
        type="button"
        onClick={() => onOpenHorse(horse)}
        className="flex min-w-0 items-center gap-2 rounded-[var(--radius-xs)] text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
      >
        {content}
      </button>
    )
  }

  return <div className="flex min-w-0 items-center gap-2">{content}</div>
}

function StallSlotCard({
  occupancy,
  onOpenHorse,
}: {
  occupancy: SlotOccupancy
  onOpenHorse?: (horse: Horse) => void
}) {
  const { horses, stall } = occupancy
  const conflict = horses.length > 1

  return (
    <div
      className={`min-w-0 rounded-[var(--radius-sm)] border p-2 ${
        conflict
          ? "border-[var(--color-warning)] bg-[var(--color-warning-soft)]"
          : horses.length > 0
            ? "border-[var(--color-border)] bg-[var(--color-surface)]"
            : "border-dashed border-[var(--color-border)] bg-[var(--color-surface-subtle)]"
      }`}
    >
      <div className="mb-1 flex items-center justify-between gap-1">
        <span className="font-metric text-[11px] font-semibold text-[var(--color-text-primary)]">
          {stall}
        </span>
        <Pill
          tone={
            conflict ? "warning" : horses.length > 0 ? "success" : "neutral"
          }
          size="sm"
        >
          {conflict ? "Conflict" : horses.length > 0 ? "Occupied" : "Available"}
        </Pill>
      </div>
      {horses.length === 0 ? (
        <span className="text-[11px] text-[var(--color-text-muted)]">
          No horse assigned
        </span>
      ) : conflict ? (
        <div className="space-y-1">
          {horses.map((horse) => (
            <HorseIdentity
              key={horse.id}
              horse={horse}
              onOpenHorse={onOpenHorse}
              compact
            />
          ))}
        </div>
      ) : (
        <HorseIdentity horse={horses[0]} onOpenHorse={onOpenHorse} compact />
      )}
    </div>
  )
}

function BarnOccupancy({
  name,
  slots,
  horses,
  onOpenHorse,
}: {
  name: string
  slots: readonly StallSlot[]
  horses: readonly Horse[]
  onOpenHorse?: (horse: Horse) => void
}) {
  const occupancies = useMemo(
    () => makeOccupancies(slots, horses),
    [slots, horses],
  )
  const occupiedCount = occupancies.filter(
    (slot) => slot.horses.length > 0,
  ).length
  const capacity = slots.length
  const fillPct =
    capacity > 0 ? Math.round((occupiedCount / capacity) * 100) : 0

  return (
    <section className="rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)]">
            {name}
          </h3>
          <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
            {BARN_SUBTITLES[name]}
          </p>
        </div>
        <span className="shrink-0 font-metric text-[12px] font-semibold text-[var(--color-text-primary)]">
          {occupiedCount} / {capacity}
        </span>
      </div>
      <ProgressBar
        value={fillPct}
        tone={fillPct >= 90 ? "warning" : "primary"}
        size="sm"
      />
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {occupancies.map((occupancy) => (
          <StallSlotCard
            key={occupancy.stall}
            occupancy={occupancy}
            onOpenHorse={onOpenHorse}
          />
        ))}
      </div>
    </section>
  )
}

function QuarantineSlotCard({
  occupancy,
  onOpenHorse,
}: {
  occupancy: SlotOccupancy
  onOpenHorse?: (horse: Horse) => void
}) {
  const { horses, stall } = occupancy
  const conflict = horses.length > 1

  return (
    <div
      className={`rounded-[var(--radius-sm)] border p-2.5 ${
        conflict
          ? "border-[var(--color-warning)] bg-[var(--color-warning-soft)]"
          : horses.length > 0
            ? "border-[var(--color-isolated)] bg-[var(--color-isolated-soft)]"
            : "border-dashed border-[var(--color-border)] bg-[var(--color-surface-subtle)]"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-metric text-[12px] font-semibold text-[var(--color-text-primary)]">
          {stall}
        </span>
        <Pill
          tone={
            conflict ? "warning" : horses.length > 0 ? "isolated" : "neutral"
          }
          size="sm"
        >
          {conflict
            ? "Conflict"
            : horses.length > 0
              ? "Quarantined"
              : "Available"}
        </Pill>
      </div>
      {horses.length === 0 ? (
        <span className="text-[11px] text-[var(--color-text-muted)]">
          No candidate assigned
        </span>
      ) : (
        <div className="space-y-2">
          {horses.map((horse) => (
            <div key={horse.id} className="min-w-0">
              <HorseIdentity horse={horse} onOpenHorse={onOpenHorse} />
              <div className="mt-1 flex flex-wrap items-center gap-1.5 pl-[46px]">
                <Pill tone="isolated" size="sm">
                  Candidate
                </Pill>
                <HealthBadge status={horse.health} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function QuarantineSection({
  horses,
  onOpenHorse,
  onOpenAdmissions,
}: {
  horses: readonly Horse[]
  onOpenHorse?: (horse: Horse) => void
  onOpenAdmissions?: () => void
}) {
  const slotOccupancies = useMemo(
    () => makeOccupancies(QUARANTINE_STALLS, horses),
    [horses],
  )
  const assignedIds = new Set(
    slotOccupancies.flatMap((slot) => slot.horses.map((horse) => horse.id)),
  )
  const withoutSlot = horses.filter((horse) => !assignedIds.has(horse.id))
  const usedSlots = slotOccupancies.filter(
    (slot) => slot.horses.length > 0,
  ).length

  return (
    <Panel padded>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-isolated-soft)] text-[var(--color-isolated)]">
            <Icon name="shield" size={15} />
          </span>
          <div className="min-w-0">
            <SectionTitle>Admission quarantine</SectionTitle>
            <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
              Candidate horse records stay here until Manager approval.
            </p>
          </div>
        </div>
        <span className="shrink-0 font-metric text-[12px] font-semibold text-[var(--color-text-primary)]">
          {usedSlots} / {QUARANTINE_STALLS.length}
        </span>
      </div>

      <div className="mb-3 rounded-[var(--radius-sm)] border border-[var(--color-isolated)] bg-[var(--color-isolated-soft)] p-2.5">
        <div className="flex items-start gap-2 text-[11px] leading-relaxed text-[var(--color-isolated)]">
          <Icon name="lock" size={13} className="mt-0.5 shrink-0" />
          <p>
            Quarantine stalls Q01–Q04 are reserved for horses already created
            after Groom review. Open applications are not counted as physically
            stabled horses.
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {slotOccupancies.map((occupancy) => (
          <QuarantineSlotCard
            key={occupancy.stall}
            occupancy={occupancy}
            onOpenHorse={onOpenHorse}
          />
        ))}
      </div>

      {withoutSlot.length > 0 && (
        <div className="mt-3 rounded-[var(--radius-sm)] border border-[var(--color-warning)] bg-[var(--color-warning-soft)] p-3">
          <p className="mb-2 text-[11px] font-semibold text-[var(--color-warning)]">
            Candidate records without a Q01–Q04 assignment
          </p>
          <div className="space-y-2">
            {withoutSlot.map((horse) => (
              <div
                key={horse.id}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <HorseIdentity
                  horse={horse}
                  onOpenHorse={onOpenHorse}
                  compact
                />
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  Recorded at {horse.stable || "no stable"}
                  {horse.stall ? ` · ${horse.stall}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {horses.length === 0 && (
        <div className="mt-2 border-t border-[var(--color-border)] pt-1">
          <EmptyState
            icon="shield"
            title="No candidate horses in quarantine"
            description="Applications enter this area after Groom review creates a candidate horse record."
            action={
              onOpenAdmissions ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onOpenAdmissions}
                >
                  Open admissions
                </Button>
              ) : undefined
            }
          />
        </div>
      )}

      {horses.length > 0 && onOpenAdmissions && (
        <div className="mt-3 border-t border-[var(--color-border)] pt-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenAdmissions}
            icon="users"
          >
            Review admissions
          </Button>
        </div>
      )}
    </Panel>
  )
}

function MedicalIsolationSection({
  horses,
  onOpenHorse,
}: {
  horses: readonly Horse[]
  onOpenHorse?: (horse: Horse) => void
}) {
  if (horses.length === 0) return null

  return (
    <Panel padded>
      <div className="mb-3 flex items-start gap-2">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-info-soft)] text-[var(--color-info)]">
          <Icon name="heart-pulse" size={15} />
        </span>
        <div>
          <SectionTitle>Medical isolation</SectionTitle>
          <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
            Existing horses isolated for health reasons remain separate from
            admission quarantine.
          </p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {horses.map((horse) => (
          <div
            key={horse.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3"
          >
            <HorseIdentity horse={horse} onOpenHorse={onOpenHorse} />
            <div className="flex items-center gap-2">
              <HealthBadge status={horse.health} size="sm" />
              <Pill tone="info" size="sm">
                {horse.stall || "No stall"}
              </Pill>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export function StableManagementScreen({
  horses,
  onOpenHorse,
  onOpenAdmissions,
}: StableManagementScreenProps) {
  const {
    eligibleHorses,
    candidateHorses,
    regularHorses,
    medicalIsolationHorses,
    barnSlots,
  } = useMemo(() => {
    const eligible = horses.filter(
      (horse) => currentStatus(horse) === "ELIGIBLE",
    )
    const candidates = horses.filter(
      (horse) => currentStatus(horse) === "CANDIDATE",
    )
    const barns = REGULAR_STALLS.reduce((names, slot) => {
      if (!names.includes(slot.stable)) names.push(slot.stable)
      return names
    }, [] as string[])
    return {
      eligibleHorses: eligible,
      candidateHorses: candidates,
      regularHorses: eligible.filter((horse) => barns.includes(horse.stable)),
      medicalIsolationHorses: eligible.filter(
        (horse) => horse.stable === MEDICAL_ISOLATION_STABLE,
      ),
      barnSlots: barns.map((stable) => ({
        name: stable,
        slots: REGULAR_STALLS.filter((slot) => slot.stable === stable),
      })),
    }
  }, [horses])

  const regularOccupancies = useMemo(
    () => makeOccupancies(REGULAR_STALLS, regularHorses),
    [regularHorses],
  )
  const occupiedRegularSlots = regularOccupancies.filter(
    (slot) => slot.horses.length > 0,
  ).length
  const slotConflicts = regularOccupancies.filter(
    (slot) => slot.horses.length > 1,
  )
  const occupiedQuarantineSlots = useMemo(
    () =>
      makeOccupancies(QUARANTINE_STALLS, candidateHorses).filter(
        (slot) => slot.horses.length > 0,
      ).length,
    [candidateHorses],
  )
  const capacityPct =
    REGULAR_STALLS.length > 0
      ? Math.round((occupiedRegularSlots / REGULAR_STALLS.length) * 100)
      : 0

  const knownBarnNames = new Set(BARN_NAMES)
  const unlistedEligibleHorses = eligibleHorses.filter(
    (horse) =>
      !knownBarnNames.has(horse.stable) &&
      horse.stable !== MEDICAL_ISOLATION_STABLE,
  )
  const unmappedBarnHorses = regularHorses.filter(
    (horse) =>
      !REGULAR_STALLS.some(
        (slot) => slot.stable === horse.stable && slot.stall === horse.stall,
      ),
  )

  return (
    <Screen
      title="Stable Management"
      context="Monitor permanent stall capacity, candidate quarantine, and medical isolation."
      primary={
        onOpenAdmissions ? (
          <Button variant="secondary" icon="users" onClick={onOpenAdmissions}>
            Open admissions
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricCard
            label="Eligible horses"
            value={eligibleHorses.length}
            icon="horse"
            hint="Official horses in stable operations"
          />
          <MetricCard
            label="Permanent stalls in use"
            value={`${occupiedRegularSlots} / ${REGULAR_STALLS.length}`}
            icon="building"
            tone={capacityPct >= 90 ? "warning" : "default"}
            hint={`${REGULAR_STALLS.length - occupiedRegularSlots} regular slots available`}
          />
          <MetricCard
            label="Admission quarantine"
            value={`${occupiedQuarantineSlots} / ${QUARANTINE_STALLS.length}`}
            icon="shield"
            tone={candidateHorses.length > 0 ? "warning" : "default"}
            hint={`${candidateHorses.length} candidate horse records; approvals are reviewed in Admissions`}
          />
        </div>

        <div className="grid items-start gap-4 2xl:grid-cols-[minmax(0,2fr)_minmax(350px,1fr)]">
          <Panel padded>
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Icon name="building" size={15} />
                </span>
                <div>
                  <SectionTitle>Permanent stall occupancy</SectionTitle>
                  <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
                    One eligible horse record occupies each system stall slot.
                    Candidate horses are excluded.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-metric text-[12px] font-semibold text-[var(--color-text-primary)]">
                  {occupiedRegularSlots} / {REGULAR_STALLS.length}
                </span>
                <Pill
                  tone={capacityPct >= 90 ? "warning" : "success"}
                  size="sm"
                >
                  {capacityPct}% used
                </Pill>
              </div>
            </div>

            <div className="mb-4">
              <ProgressBar
                value={capacityPct}
                tone={capacityPct >= 90 ? "warning" : "primary"}
                size="sm"
              />
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {barnSlots.map(({ name, slots }) => (
                <BarnOccupancy
                  key={name}
                  name={name}
                  slots={slots}
                  horses={regularHorses}
                  onOpenHorse={onOpenHorse}
                />
              ))}
            </div>

            {slotConflicts.length > 0 && (
              <div className="mt-3 flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-warning)] bg-[var(--color-warning-soft)] p-3 text-[11px] text-[var(--color-warning)]">
                <Icon
                  name="alert-triangle"
                  size={14}
                  className="mt-0.5 shrink-0"
                />
                <p>
                  {slotConflicts.length} stall{" "}
                  {slotConflicts.length === 1 ? "slot has" : "slots have"} more
                  than one eligible horse assigned. Review the highlighted
                  slots.
                </p>
              </div>
            )}

            {unmappedBarnHorses.length > 0 && (
              <div className="mt-3 rounded-[var(--radius-sm)] border border-[var(--color-warning)] bg-[var(--color-warning-soft)] p-3">
                <p className="mb-2 text-[11px] font-semibold text-[var(--color-warning)]">
                  Eligible horses assigned to a stall outside A01–D12
                </p>
                <div className="space-y-2">
                  {unmappedBarnHorses.map((horse) => (
                    <div
                      key={horse.id}
                      className="flex flex-wrap items-center justify-between gap-2"
                    >
                      <HorseIdentity
                        horse={horse}
                        onOpenHorse={onOpenHorse}
                        compact
                      />
                      <span className="font-metric text-[10px] text-[var(--color-text-secondary)]">
                        {horse.stable} · {horse.stall || "No stall"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {unlistedEligibleHorses.length > 0 && (
              <div className="mt-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                <p className="mb-2 text-[11px] font-semibold text-[var(--color-text-secondary)]">
                  Eligible horses in other stable areas
                </p>
                <div className="space-y-2">
                  {unlistedEligibleHorses.map((horse) => (
                    <div
                      key={horse.id}
                      className="flex flex-wrap items-center justify-between gap-2"
                    >
                      <HorseIdentity
                        horse={horse}
                        onOpenHorse={onOpenHorse}
                        compact
                      />
                      <span className="font-metric text-[10px] text-[var(--color-text-secondary)]">
                        {horse.stable || "No stable"} ·{" "}
                        {horse.stall || "No stall"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Panel>

          <QuarantineSection
            horses={candidateHorses}
            onOpenHorse={onOpenHorse}
            onOpenAdmissions={onOpenAdmissions}
          />
        </div>

        <MedicalIsolationSection
          horses={medicalIsolationHorses}
          onOpenHorse={onOpenHorse}
        />
      </div>
    </Screen>
  )
}
