export interface StallSlot {
  stable: string
  stall: string
}

export const QUARANTINE_STABLE = "Quarantine"
export const MEDICAL_ISOLATION_STABLE = "Isolation"

const BARN_CODES = ["A", "B", "C", "D"] as const
const REGULAR_STALL_COUNT = 12
const QUARANTINE_STALL_COUNT = 4

export const REGULAR_STALLS: StallSlot[] = BARN_CODES.flatMap((code) =>
  Array.from({ length: REGULAR_STALL_COUNT }, (_, index) => ({
    stable: `Barn ${code}`,
    stall: `${code}${String(index + 1).padStart(2, "0")}`,
  })),
)

export const QUARANTINE_STALLS: StallSlot[] = Array.from(
  { length: QUARANTINE_STALL_COUNT },
  (_, index) => ({
    stable: QUARANTINE_STABLE,
    stall: `Q${String(index + 1).padStart(2, "0")}`,
  }),
)
