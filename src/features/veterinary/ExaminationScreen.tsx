import { lazy, Suspense, useState } from "react"
import { useRtms } from "../../app/RtmsContext"
import { Screen } from "../../components/Screen"
import { Panel, FieldLabel, SectionTitle } from "../../components/Panel"
import { Button } from "../../components/Button"
import { Icon } from "../../components/Icon"
import { Select } from "../../components/Select"
import { HorseAvatar } from "../horses/HorseAvatar"
import { HealthBadge } from "../../components/StatusBadge"
import type {
  AnatomicalRegion,
  Examination,
  InjurySeverity,
} from "./medicalData"

const Injury3DViewer = lazy(() =>
  import("./Injury3DViewer").then(({ Injury3DViewer: component }) => ({
    default: component,
  })),
)

export function ExaminationScreen() {
  const {
    route,
    navigate,
    toast,
    horses,
    getHorse,
    can,
    recordExamination,
    isLocked,
    lockTraining,
  } = useRtms()

  const [horseId, setHorseId] = useState(route.horseId || horses[0]?.id || "")
  const [examType, setExamType] = useState("Routine")
  const [date, setDate] = useState("20 Sep 2026, 09:00")
  const [vet, setVet] = useState("Dr. Haines")
  const [reason, setReason] = useState("Scheduled clinical assessment")

  const [symptoms, setSymptoms] = useState<string[]>([])
  const [symptomInput, setSymptomInput] = useState("")

  const [findings, setFindings] = useState<string[]>([
    "Heart rhythm regular and sound",
    "Clear respiratory sounds bilaterally",
  ])
  const [findingInput, setFindingInput] = useState("")

  const [temp, setTemp] = useState("38.1")
  const [hr, setHr] = useState("36")
  const [rr, setRr] = useState("14")
  const [weight, setWeight] = useState("505")

  const [diagnosis, setDiagnosis] = useState("Sound for full training duties")
  const [hasInjury, setHasInjury] = useState(false)
  const [injuryRegion, setInjuryRegion] =
    useState<AnatomicalRegion>("Left Front Leg")
  const [injuryType, setInjuryType] = useState("Soft tissue / lameness")
  const [severity, setSeverity] = useState<InjurySeverity>("Mild")
  const [applyRestriction, setApplyRestriction] = useState(false)
  const [recommendation, setRecommendation] = useState(
    "Maintain current training program and hydration regimen.",
  )

  const selectedHorse = getHorse(horseId) || horses[0]

  const handleAddSymptom = () => {
    if (symptomInput.trim()) {
      setSymptoms([...symptoms, symptomInput.trim()])
      setSymptomInput("")
    }
  }

  const handleRemoveSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index))
  }

  const handleAddFinding = () => {
    if (findingInput.trim()) {
      setFindings([...findings, findingInput.trim()])
      setFindingInput("")
    }
  }

  const handleRemoveFinding = (index: number) => {
    setFindings(findings.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!selectedHorse || !can("medical.record")) return
    const examination: Examination = {
      id: `ex-${selectedHorse.id}-${Date.now()}`,
      date,
      vet,
      type: examType as Examination["type"],
      symptoms,
      findings,
      diagnosis,
      recommendation,
      reason,
      ...(hasInjury ? { injuryRegion, injuryType, severity } : {}),
    }
    recordExamination(selectedHorse.id, examination)
    if (applyRestriction && !isLocked(selectedHorse.id)) {
      lockTraining(selectedHorse.id, {
        reason: hasInjury ? `${injuryType} — ${injuryRegion}` : diagnosis,
        reviewDate: "27 Sep 2026",
        veterinarian: vet,
      })
    }
    toast("Examination recorded successfully", "success")
    if (route.horseId) {
      navigate("veterinary", { view: "record", horseId: route.horseId })
    } else {
      navigate("veterinary")
    }
  }

  const handleCancel = () => {
    if (route.horseId) {
      navigate("veterinary", { view: "record", horseId: route.horseId })
    } else {
      navigate("veterinary")
    }
  }

  return (
    <Screen
      title="Record examination"
      context={
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-1 text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline"
        >
          <Icon name="arrow-left" size={13} /> Back to veterinary
        </button>
      }
      primary={
        can("medical.record") ? (
          <Button variant="primary" icon="check" onClick={handleSave}>
            Save examination
          </Button>
        ) : undefined
      }
    >
      <div className="mx-auto max-w-4xl flex flex-col gap-4 pb-8">
        {/* Horse Selection Panel */}
        <Panel padded>
          <SectionTitle>Subject horse</SectionTitle>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            {selectedHorse ? (
              <div className="flex items-center gap-3">
                <HorseAvatar
                  name={selectedHorse.name}
                  image={selectedHorse.image}
                  size={48}
                  rounded="md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-[var(--color-text-primary)]">
                      {selectedHorse.name}
                    </span>
                    <HealthBadge status={selectedHorse.health} size="sm" />
                  </div>
                  <div className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">
                    {selectedHorse.stable} · Stall {selectedHorse.stall} ·{" "}
                    {selectedHorse.breed} · {selectedHorse.ageYears} yrs{" "}
                    {selectedHorse.sex}
                  </div>
                </div>
              </div>
            ) : null}
            <div className="w-full sm:w-auto">
              <Select
                label="Choose horse"
                value={horseId}
                onChange={setHorseId}
                options={horses.map((h) => ({
                  value: h.id,
                  label: `${h.name} (${h.stable})`,
                }))}
              />
            </div>
          </div>
        </Panel>

        <Panel padded>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <SectionTitle>3D injury examination</SectionTitle>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
              <Icon name="target" size={12} />
              Clinical mapping
            </span>
          </div>
          <div className="mt-4">
            <Suspense
              fallback={
                <div className="rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6 text-sm text-[var(--color-text-secondary)]">
                  Loading injury viewer…
                </div>
              }
            >
              <Injury3DViewer
                hasInjury={hasInjury}
                onHasInjuryChange={setHasInjury}
                selectedRegion={injuryRegion}
                onRegionChange={setInjuryRegion}
                injuryType={injuryType}
                onInjuryTypeChange={setInjuryType}
                severity={severity}
                onSeverityChange={setSeverity}
                applyRestriction={applyRestriction}
                onRestrictionChange={setApplyRestriction}
              />
            </Suspense>
          </div>
        </Panel>

        {/* Examination Details */}
        <Panel padded>
          <SectionTitle>Examination details</SectionTitle>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Examination Type</FieldLabel>
              <div className="mt-1">
                <Select
                  label="Examination Type"
                  value={examType}
                  onChange={setExamType}
                  options={[
                    { value: "Routine", label: "Routine" },
                    { value: "Lameness", label: "Lameness" },
                    { value: "Emergency", label: "Emergency" },
                    { value: "Follow-up", label: "Follow-up" },
                    { value: "Pre-race", label: "Pre-race" },
                  ]}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Date & Time</FieldLabel>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none font-metric focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
              />
            </div>
            <div>
              <FieldLabel>Veterinarian</FieldLabel>
              <div className="mt-1">
                <Select
                  label="Veterinarian"
                  value={vet}
                  onChange={setVet}
                  options={[
                    {
                      value: "Dr. Haines",
                      label: "Dr. Haines (Senior Equine Practitioner)",
                    },
                    {
                      value: "Dr. Al Mansoor",
                      label: "Dr. Al Mansoor (Orthopedic Specialist)",
                    },
                  ]}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Reason for examination</FieldLabel>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason or trigger for examination..."
                className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
              />
            </div>
          </div>
        </Panel>

        {/* Symptoms Reported Section */}
        <Panel padded>
          <div className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
            <Icon
              name="user"
              size={14}
              className="text-[var(--color-text-muted)]"
            />
            <SectionTitle>Symptoms (reported by handler/groom)</SectionTitle>
          </div>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddSymptom()
                }
              }}
              placeholder="e.g. Mild swelling in left fetlock noticed during morning grooming..."
              className="h-9 flex-1 rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
            />
            <Button variant="secondary" icon="plus" onClick={handleAddSymptom}>
              Add
            </Button>
          </div>

          <div className="mt-3 space-y-1.5">
            {symptoms.length === 0 ? (
              <p className="text-[12px] text-[var(--color-text-muted)] italic">
                No symptoms reported by handlers.
              </p>
            ) : (
              symptoms.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-3 py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      name="user"
                      size={13}
                      className="text-[var(--color-text-muted)]"
                    />
                    <span className="text-[13px] text-[var(--color-text-primary)]">
                      {s}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveSymptom(idx)}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] outline-none"
                  >
                    <Icon name="x" size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </Panel>

        {/* Clinical Findings Section */}
        <Panel padded>
          <div className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
            <Icon
              name="stethoscope"
              size={14}
              className="text-[var(--color-primary)]"
            />
            <SectionTitle>
              Clinical findings (professional evaluation)
            </SectionTitle>
          </div>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={findingInput}
              onChange={(e) => setFindingInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddFinding()
                }
              }}
              placeholder="e.g. Tendon palpation sound, clean flexion test Grade 0/5..."
              className="h-9 flex-1 rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
            />
            <Button variant="secondary" icon="plus" onClick={handleAddFinding}>
              Add
            </Button>
          </div>

          <div className="mt-3 space-y-1.5">
            {findings.length === 0 ? (
              <p className="text-[12px] text-[var(--color-text-muted)] italic">
                No findings recorded yet.
              </p>
            ) : (
              findings.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-3 py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      name="stethoscope"
                      size={13}
                      className="text-[var(--color-primary)]"
                    />
                    <span className="text-[13px] text-[var(--color-text-primary)]">
                      {f}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveFinding(idx)}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] outline-none"
                  >
                    <Icon name="x" size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </Panel>

        {/* Measurements */}
        <Panel padded>
          <SectionTitle>Biometric measurements</SectionTitle>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <FieldLabel>Temperature</FieldLabel>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  placeholder="38.0"
                  className="font-metric h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 pr-8 text-[13px] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
                />
                <span className="pointer-events-none absolute right-2.5 top-2 text-[12px] text-[var(--color-text-muted)]">
                  °C
                </span>
              </div>
            </div>
            <div>
              <FieldLabel>Heart Rate</FieldLabel>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={hr}
                  onChange={(e) => setHr(e.target.value)}
                  placeholder="36"
                  className="font-metric h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 pr-11 text-[13px] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
                />
                <span className="pointer-events-none absolute right-2.5 top-2 text-[12px] text-[var(--color-text-muted)]">
                  bpm
                </span>
              </div>
            </div>
            <div>
              <FieldLabel>Respiratory Rate</FieldLabel>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={rr}
                  onChange={(e) => setRr(e.target.value)}
                  placeholder="14"
                  className="font-metric h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 pr-11 text-[13px] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
                />
                <span className="pointer-events-none absolute right-2.5 top-2 text-[12px] text-[var(--color-text-muted)]">
                  /min
                </span>
              </div>
            </div>
            <div>
              <FieldLabel>Weight</FieldLabel>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="490"
                  className="font-metric h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 pr-8 text-[13px] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
                />
                <span className="pointer-events-none absolute right-2.5 top-2 text-[12px] text-[var(--color-text-muted)]">
                  kg
                </span>
              </div>
            </div>
          </div>
        </Panel>

        {/* Assessment */}
        <Panel padded>
          <SectionTitle>Diagnosis & recommendations</SectionTitle>
          <div className="mt-3 space-y-4">
            <div>
              <FieldLabel>Clinical Diagnosis</FieldLabel>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 py-2 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              />
            </div>

            <div>
              <FieldLabel>Recommendations / Treatment Direction</FieldLabel>
              <textarea
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 py-2 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              />
            </div>
          </div>
        </Panel>
      </div>
    </Screen>
  )
}
