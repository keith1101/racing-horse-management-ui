import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { BrandLogo } from '../../components/BrandLogo';

interface LandingScreenProps {
  onSignIn: () => void;
}

type RoleTabKey = 'TRAINER' | 'VET' | 'GROOM' | 'OWNER' | 'MANAGER';

interface RoleTabInfo {
  key: RoleTabKey;
  label: string;
  roleTitle: string;
  badge: string;
  tone: string;
  icon: 'activity' | 'heart-pulse' | 'utensils' | 'horse' | 'building';
  summary: string;
  features: string[];
  metricLabel: string;
  metricValue: string;
}

const ROLE_TABS: RoleTabInfo[] = [
  {
    key: 'TRAINER',
    label: 'Head Trainer',
    roleTitle: 'Training Command & Campaign Strategy',
    badge: 'Training Command',
    tone: 'var(--color-training)',
    icon: 'activity',
    summary: 'Direct authority over conditioning curricula, sectional pace analytics, daily workouts, and racing campaigns.',
    features: [
      'Standardized Course Catalog with automated calendar workout projections',
      'Enforced invariant: Strict single active training plan per thoroughbred',
      'Real-time sectional speed, peak heart rate, and cardiovascular recovery tracking',
      'Race entry proposals with requested budget allocation submitted to Club Manager',
    ],
    metricLabel: 'Curriculum target adherence',
    metricValue: '84.2%',
  },
  {
    key: 'VET',
    label: 'Veterinarian',
    roleTitle: 'Clinical Governance & Biosecurity Authority',
    badge: 'Clinical Governance',
    tone: 'var(--color-medical)',
    icon: 'heart-pulse',
    summary: 'Direct oversight of equine health, biosecurity quarantine, and supreme authority to enforce clinical training locks.',
    features: [
      'Exclusive authority to enforce Training Locks across all modules upon injury detection',
      'Strict clinical data privacy: diagnoses, notes, and medication formulas restricted from unauthorized roles',
      'Treatment plans, preventative vaccination calendars, and quarantine isolation protocols',
      'Comprehensive multi-system physical examinations during candidate admissions',
    ],
    metricLabel: 'Injury prevention compliance',
    metricValue: '100%',
  },
  {
    key: 'GROOM',
    label: 'Groom / Stable Hand',
    roleTitle: 'Stable Operations & Daily Equine Care',
    badge: 'Stable Operations',
    tone: 'var(--color-grooming)',
    icon: 'utensils',
    summary: 'Frontline care across active barns, maintaining nutritional regimens, stall sanitation, and physical observations.',
    features: [
      'Shift-based care checklists: feeds, fresh bedding, hand-walking, and grooming routines',
      'Instant observation and incident reporting routed directly to the Veterinarian queue',
      'Microchip intake verification and physical condition logging for arriving candidates',
      'Continuous monitoring of hydration, feeding enthusiasm, and behavioral temperament',
    ],
    metricLabel: 'Shift checklist completion',
    metricValue: '98.6%',
  },
  {
    key: 'OWNER',
    label: 'Horse Owner',
    roleTitle: 'Transparency & Ownership Command',
    badge: 'Owner Portal',
    tone: 'var(--color-racing)',
    icon: 'horse',
    summary: 'Dedicated owner portal providing complete visibility into equine welfare, racing records, and financial accounts.',
    features: [
      'Row-level data isolation: Owners access only thoroughbreds under their registered ownership',
      'Pedigree lineage details (Sire/Dam), registration badges, and designated stall locations',
      'Official race records, finishing margins, sectional splits, and prize purse statements',
      'Self-service admission application submission with certificate uploads',
    ],
    metricLabel: 'Transparency satisfaction',
    metricValue: '99.1%',
  },
  {
    key: 'MANAGER',
    label: 'Club Manager',
    roleTitle: 'Executive Oversight & Club Governance',
    badge: 'Executive Oversight',
    tone: 'var(--color-finance)',
    icon: 'building',
    summary: 'Executive leadership overseeing facility capacity, operational budget authorizations, and regulatory compliance.',
    features: [
      'Final gatekeeper for horse admissions: approves official club entry and assigns permanent stalls',
      'Review and approve/decline racing proposals with allocated budget authorizations',
      'Barn and stall capacity utilization management across all club facilities',
      'Comprehensive tamper-evident audit trail tracking all cross-department actions',
    ],
    metricLabel: 'Facility stall occupancy',
    metricValue: '28/32',
  },
];

interface AdmissionStep {
  stepNumber: number;
  stageName: string;
  roleBadge: string;
  roleTone: string;
  title: string;
  description: string;
  deliverables: string[];
}

const ADMISSION_STEPS: AdmissionStep[] = [
  {
    stepNumber: 1,
    stageName: 'Initial Submission',
    roleBadge: 'Horse Owner',
    roleTone: 'var(--color-racing)',
    title: 'Candidate Dossier & Pedigree Upload',
    description: 'The registered owner submits candidate thoroughbred identity, foaling date, pedigree lineage (Sire/Dam), vaccination passport, and Stud Book certificates.',
    deliverables: ['Vaccination & microchip passport', 'Stud Book pedigree certificate', 'Proof of ownership transfer'],
  },
  {
    stepNumber: 2,
    stageName: 'Intake & Identification',
    roleBadge: 'Groom / Stable Hand',
    roleTone: 'var(--color-grooming)',
    title: 'Staging Inspection & Microchip Scan',
    description: 'The stable hand receives the horse at the intake bay, scans the 15-digit microchip to verify physical identity against the digital dossier, and logs baseline physical markings.',
    deliverables: ['15-digit microchip verification', 'Quarantine stall intake receipt', 'Dermatology & physical marking log'],
  },
  {
    stepNumber: 3,
    stageName: 'Clinical & Biosecurity Exam',
    roleBadge: 'Veterinarian',
    roleTone: 'var(--color-medical)',
    title: 'Veterinary Soundness & Quarantine Clearance',
    description: 'The attending veterinarian conducts flexion tests, biosecurity screening, blood panels, and cardiac assessments to clear the horse for athletic training.',
    deliverables: ['Clinical physical examination report', 'Biosecurity quarantine sign-off', 'Preventive vaccination & care schedule'],
  },
  {
    stepNumber: 4,
    stageName: 'Conformation & Track Trial',
    roleBadge: 'Head Trainer',
    roleTone: 'var(--color-training)',
    title: 'Stride Analysis & Conformation Assessment',
    description: 'The head trainer evaluates structural conformation, stride kinematics during a timed track trial, breathing recovery, and athletic potential.',
    deliverables: ['Conformation & gait trial report', 'Stride sectional timing evaluation', 'Initial course curriculum recommendation'],
  },
  {
    stepNumber: 5,
    stageName: 'Final Approval & Allocation',
    roleBadge: 'Club Manager',
    roleTone: 'var(--color-finance)',
    title: 'Official Induction & Stall Allocation',
    description: 'The club manager reviews combined departmental recommendations, authorizes the boarding contract, assigns a permanent Barn & Stall, and promotes the horse to the active roster.',
    deliverables: ['Final club admission authorization', 'Permanent Barn & Stall assignment', 'Active boarding contract activation'],
  },
];

export function LandingScreen({ onSignIn }: LandingScreenProps) {
  const [selectedRole, setSelectedRole] = useState<RoleTabKey>('TRAINER');
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const activeRoleData = ROLE_TABS.find((r) => r.key === selectedRole) || ROLE_TABS[0];
  const activeStepData = ADMISSION_STEPS.find((s) => s.stepNumber === selectedStep) || ADMISSION_STEPS[0];

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-9 w-9 border border-[var(--color-border)] shadow-xs" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold tracking-tight text-[var(--color-text-primary)]">RTMS</span>
                <span className="hidden rounded-xs bg-[var(--color-primary-soft)] px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-[var(--color-primary)] uppercase sm:inline-block">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] font-medium tracking-wide text-[var(--color-text-muted)]">
                Riverside Training & Racing Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 text-[12px] text-[var(--color-text-secondary)] md:flex">
              <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
              <span>Operational command active</span>
            </div>
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--color-text-primary)] shadow-xs transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <Icon name="user" size={14} />
              <span>Sign in</span>
            </button>
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-4 py-1.5 text-[13px] font-semibold text-[var(--color-text-inverse)] shadow-xs transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <span>Access RTMS</span>
              <Icon name="chevron-right" size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH LIVE PRODUCT PREVIEW */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface)_0%,var(--color-background)_100%)] py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Hero Content */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] px-3 py-1 text-[11px] font-semibold tracking-wider text-[var(--color-primary)] uppercase">
                <Icon name="shield" size={13} />
                <span>Thoroughbred Racing & Operations Platform</span>
              </div>

              <h1 className="mt-5 text-[36px] font-bold leading-[1.12] tracking-tight text-[var(--color-text-primary)] sm:text-[46px] lg:text-[50px]">
                Peak performance. <br />
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[#8572ea] bg-clip-text text-transparent">
                  Uncompromised
                </span>{' '}
                clinical oversight.
              </h1>

              <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-[16px]">
                RTMS unifies 5 operational roles: from ownership admissions and veterinary biosecurity to progressive
                training curricula and racing nominations — all within a single synchronized real-time data ecosystem.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={onSignIn}
                  className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-5 text-[14px] font-semibold text-[var(--color-text-inverse)] shadow-md shadow-[var(--color-primary)]/20 transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                >
                  <Icon name="gauge" size={16} />
                  <span>Launch RTMS Command</span>
                </button>

                <a
                  href="#admission-flow"
                  className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[13px] font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)]"
                >
                  <span>Explore admission pipeline</span>
                  <Icon name="chevron-down" size={14} />
                </a>
              </div>

              {/* Quick Trust Badges */}
              <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[var(--color-border)] pt-6 text-[12px] text-[var(--color-text-muted)]">
                <div className="flex items-center gap-2">
                  <Icon name="check" size={15} className="text-[var(--color-success)]" />
                  <span>5-Tier Strict RBAC Governance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="lock" size={14} className="text-[var(--color-danger)]" />
                  <span>Automated Clinical Training Locks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="activity" size={15} className="text-[var(--color-training)]" />
                  <span>Sub-second Speed & HR Telemetry</span>
                </div>
              </div>
            </div>

            {/* Right: Live Product Preview (Live Thoroughbred Telemetry Card) */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xl shadow-black/5 sm:p-6">
                {/* Simulated Terminal Header */}
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
                    </span>
                    <span className="font-metric text-[11px] font-medium tracking-wide text-[var(--color-text-secondary)] uppercase">
                      RTC LIVE TELEMETRY · SENSOR BAND #SB-08
                    </span>
                  </div>
                  <span className="rounded-xs bg-[var(--color-surface-muted)] px-2 py-0.5 font-metric text-[10px] text-[var(--color-text-muted)]">
                    TRACK A · TURF OVAL
                  </span>
                </div>

                {/* Horse Identity Banner */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-primary)]/40 bg-[var(--color-surface-muted)] shadow-xs">
                      <img
                        src="https://images.unsplash.com/photo-1513966007261-5a86a5284471?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                        alt="Silver Comet"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[17px] font-bold text-[var(--color-text-primary)]">Silver Comet</h3>
                        <span className="rounded-full bg-[var(--color-success-soft)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--color-success)]">
                          FIT · CLEARED
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                        4yo Colt · Thoroughbred · Stall B-04 · Marlowe Racing Ltd.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Telemetry Metric Grid */}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                      <Icon name="gauge" size={13} className="text-[var(--color-training)]" />
                      <span className="text-[10px] font-medium tracking-wide uppercase">Sprint Speed</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-metric text-[22px] font-bold text-[var(--color-text-primary)]">51.8</span>
                      <span className="text-[11px] text-[var(--color-text-secondary)]">km/h</span>
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--color-success)] font-medium">On breeze target</p>
                  </div>

                  <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                      <Icon name="heart-pulse" size={13} className="text-[var(--color-danger)]" />
                      <span className="text-[10px] font-medium tracking-wide uppercase">Peak Heart Rate</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-metric text-[22px] font-bold text-[var(--color-text-primary)]">178</span>
                      <span className="text-[11px] text-[var(--color-text-secondary)]">bpm</span>
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">Target Zone 4</p>
                  </div>

                  <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                      <Icon name="clock" size={13} className="text-[var(--color-info)]" />
                      <span className="text-[10px] font-medium tracking-wide uppercase">HR Recovery</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-metric text-[22px] font-bold text-[var(--color-text-primary)]">11</span>
                      <span className="text-[11px] text-[var(--color-text-secondary)]">min</span>
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--color-success)] font-medium">Optimal (&lt;15m)</p>
                  </div>

                  <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                      <Icon name="target" size={13} className="text-[var(--color-primary)]" />
                      <span className="text-[10px] font-medium tracking-wide uppercase">Distance</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-metric text-[22px] font-bold text-[var(--color-text-primary)]">1,000</span>
                      <span className="text-[11px] text-[var(--color-text-secondary)]">m</span>
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">Firm turf surface</p>
                  </div>
                </div>

                {/* Simulated Heart Rate Waveform Curve */}
                <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[var(--color-text-secondary)]">
                      Real-time sectional pace &amp; telemetry ECG
                    </span>
                    <span className="font-metric text-[10px] text-[var(--color-success)]">
                      Rhythm stable · No arrhythmia
                    </span>
                  </div>
                  <div className="mt-2 flex h-12 items-end gap-1 px-1">
                    {[32, 38, 42, 45, 50, 58, 65, 78, 92, 98, 95, 84, 68, 52, 42, 36, 34].map((val, idx) => (
                      <div
                        key={idx}
                        className="flex-1 rounded-t-xs transition-all duration-300"
                        style={{
                          height: `${val}%`,
                          backgroundColor: val > 80 ? 'var(--color-primary)' : 'var(--color-border-strong)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Active Plan & Invariant Status */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] px-3 py-2.5 text-[12px]">
                  <div className="flex items-center gap-2">
                    <Icon name="activity" size={15} className="text-[var(--color-primary)]" />
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Active Curriculum: Sprint Campaign Preparation (Phase 3)
                    </span>
                  </div>
                  <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--color-primary)] shadow-xs">
                    Progress: 82%
                  </span>
                </div>

                {/* Clinical Clearance Pill */}
                <div className="mt-3 flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-success)]/30 bg-[var(--color-success-soft)] px-3 py-2 text-[11px]">
                  <div className="flex items-center gap-2 text-[var(--color-success)]">
                    <Icon name="check" size={14} />
                    <span className="font-medium">Clinical &amp; Biosecurity Clearance: PASS</span>
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)]">Attending: Dr. Amelia Haines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: CLOSED-LOOP ADMISSION & INTAKE PIPELINE */}
      <section id="admission-flow" className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-3 py-1 text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase">
              <Icon name="git-branch" size={13} />
              <span>Core Business Flow · SWP391</span>
            </span>
            <h2 className="mt-3 text-[28px] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[36px]">
              Closed-Loop Admission &amp; Intake Pipeline
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              Candidate thoroughbreds must clear 5 sequential gatekeeping reviews across departments before official
              promotion to the active club roster.
            </p>
          </div>

          {/* Pipeline Stepper Buttons */}
          <div className="mt-12 grid grid-cols-1 gap-2 sm:grid-cols-5">
            {ADMISSION_STEPS.map((step) => {
              const isCurrent = step.stepNumber === selectedStep;
              return (
                <button
                  key={step.stepNumber}
                  onClick={() => setSelectedStep(step.stepNumber)}
                  className={`group relative flex flex-col rounded-[var(--radius-md)] border p-4 text-left transition-all ${
                    isCurrent
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]/50 shadow-md ring-1 ring-[var(--color-primary)]'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
                        isCurrent
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <span
                      className="rounded-xs px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                      style={{ color: step.roleTone, backgroundColor: 'var(--color-surface)' }}
                    >
                      {step.roleBadge.split('/')[0]}
                    </span>
                  </div>
                  <h4 className="mt-3 text-[13px] font-bold text-[var(--color-text-primary)]">{step.stageName}</h4>
                  <p className="mt-1 line-clamp-1 text-[11px] text-[var(--color-text-muted)]">{step.title}</p>
                </button>
              );
            })}
          </div>

          {/* Active Step Details Panel */}
          <div className="mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2">
                  <span className="font-metric text-[12px] font-bold text-[var(--color-primary)]">
                    STEP {activeStepData.stepNumber} OF 5
                  </span>
                  <span className="text-[var(--color-text-muted)]">·</span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{ backgroundColor: 'var(--color-surface)', color: activeStepData.roleTone }}
                  >
                    Responsible Authority: {activeStepData.roleBadge}
                  </span>
                </div>

                <h3 className="mt-2 text-[22px] font-bold text-[var(--color-text-primary)]">{activeStepData.title}</h3>

                <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
                  {activeStepData.description}
                </p>

                <div className="mt-6">
                  <h5 className="text-[12px] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
                    Mandatory Dossier Deliverables:
                  </h5>
                  <ul className="mt-3 space-y-2">
                    {activeStepData.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-[13px] text-[var(--color-text-primary)]">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)]">
                          <Icon name="check" size={12} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Status Outcomes Visual Card */}
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:col-span-5">
                <h4 className="text-[13px] font-bold text-[var(--color-text-primary)]">
                  Sequential Review &amp; Decision Authority
                </h4>
                <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                  At this evaluation gate, the assigned department exercises 3 formal workflow decisions:
                </p>

                <div className="mt-4 space-y-2.5">
                  <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--color-success)]/30 bg-[var(--color-success-soft)]/50 p-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)] text-white">
                      ✓
                    </span>
                    <div>
                      <span className="text-[12px] font-bold text-[var(--color-success)]">Approve &amp; Advance</span>
                      <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
                        Advances the dossier to the next departmental gatekeeper in the intake pipeline.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)]/50 p-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-warning)] text-white">
                      !
                    </span>
                    <div>
                      <span className="text-[12px] font-bold text-[var(--color-warning)]">
                        Request Additional Information
                      </span>
                      <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
                        Reverts application to candidate owner to clarify documentation or submit missing records.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)]/50 p-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-danger)] text-white">
                      ✕
                    </span>
                    <div>
                      <span className="text-[12px] font-bold text-[var(--color-danger)]">Reject &amp; Terminate</span>
                      <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
                        Terminates application if the horse fails soundness, biosecurity, or pedigree standards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: PURPOSE-BUILT FOR 5 OPERATIONAL ROLES (ROLE-BASED TABS) */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-background)] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--color-primary)] uppercase">
              <Icon name="users" size={13} />
              <span>Equine Operations Architecture</span>
            </span>
            <h2 className="mt-3 text-[28px] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[36px]">
              Purpose-Built for 5 Operational Roles
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              Every club stakeholder operates with a role-tailored interface designed for their specific duties while
              preserving real-time cross-departmental synchronization.
            </p>
          </div>

          {/* Role Tabs Header */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {ROLE_TABS.map((role) => {
              const isActive = role.key === selectedRole;
              return (
                <button
                  key={role.key}
                  onClick={() => setSelectedRole(role.key)}
                  className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-[13px] font-semibold transition-all ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-md'
                      : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Icon name={role.icon} size={15} />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>

          {/* Role Showcase Content Card */}
          <div className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase"
                    style={{ backgroundColor: 'var(--color-primary-soft)', color: activeRoleData.tone }}
                  >
                    {activeRoleData.badge}
                  </span>
                  <span className="text-[12px] text-[var(--color-text-muted)]">· Core Role</span>
                </div>

                <h3 className="mt-3 text-[24px] font-bold text-[var(--color-text-primary)]">
                  {activeRoleData.roleTitle}
                </h3>

                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
                  {activeRoleData.summary}
                </p>

                <div className="mt-6 space-y-3">
                  {activeRoleData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span
                        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: activeRoleData.tone }}
                      >
                        <Icon name="check" size={11} />
                      </span>
                      <span className="text-[13px] font-medium leading-relaxed text-[var(--color-text-primary)]">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Metric Highlight Card */}
              <div className="lg:col-span-5">
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-6 text-center sm:p-8">
                  <div
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white shadow-sm"
                    style={{ backgroundColor: activeRoleData.tone }}
                  >
                    <Icon name={activeRoleData.icon} size={28} />
                  </div>

                  <p className="mt-4 text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {activeRoleData.metricLabel}
                  </p>

                  <div className="mt-1 font-metric text-[38px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
                    {activeRoleData.metricValue}
                  </div>

                  <p className="mt-2 text-[12px] text-[var(--color-text-secondary)]">
                    Ensures complete compliance with Riverside Training Club operational bylaws.
                  </p>

                  <button
                    onClick={onSignIn}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 text-[13px] font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)]"
                  >
                    <span>Preview {activeRoleData.label} workspace</span>
                    <Icon name="chevron-right" size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION: OPERATIONAL IMPACT METRICS */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <Icon name="horse" size={18} />
              </div>
              <div className="mt-3 font-metric text-[32px] font-bold text-[var(--color-text-primary)]">50+</div>
              <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">Thoroughbreds Managed</div>
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">Across 4 active barn facilities</p>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)]">
                <Icon name="lock" size={18} />
              </div>
              <div className="mt-3 font-metric text-[32px] font-bold text-[var(--color-success)]">100%</div>
              <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">Training Lock Compliance</div>
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">Zero unauthorized workouts during injury review</p>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-info-soft)] text-[var(--color-info)]">
                <Icon name="shield" size={18} />
              </div>
              <div className="mt-3 font-metric text-[32px] font-bold text-[var(--color-info)]">5 Roles</div>
              <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">Strict RBAC Model</div>
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">Granular clinical privacy &amp; role segregation</p>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-warning-soft)] text-[var(--color-warning)]">
                <Icon name="clock" size={18} />
              </div>
              <div className="mt-3 font-metric text-[32px] font-bold text-[var(--color-warning)]">&lt; 15m</div>
              <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">Incident Escalation</div>
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">From groom observation to clinical triage</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER & RTC BRANDING */}
      <footer className="bg-[var(--color-surface)] py-12 text-[var(--color-text-secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Col 1: Brand & Overview */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <BrandLogo className="h-9 w-9 border border-[var(--color-border)] shadow-xs" />
                <div>
                  <div className="text-[16px] font-bold text-[var(--color-text-primary)]">RTMS</div>
                  <div className="text-[11px] font-medium text-[var(--color-text-muted)]">Riverside Training Club</div>
                </div>
              </div>

              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                The Riverside Training Management System (RTMS) standardizes high-performance equine conditioning,
                clinical biosecurity, and operational governance for thoroughbred racehorses.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] px-3 py-1.5 text-[11px] text-[var(--color-text-muted)]">
                <span className="font-semibold text-[var(--color-primary)]">SWP391 Capstone Project</span> · FPT University
              </div>
            </div>

            {/* Col 2: Business Modules */}
            <div className="md:col-span-3">
              <h4 className="text-[12px] font-bold tracking-wider text-[var(--color-text-primary)] uppercase">
                Operational Modules
              </h4>
              <ul className="mt-3 space-y-2 text-[12px]">
                <li>Horse Profiles &amp; Stable Operations</li>
                <li>Clinical Examinations &amp; Training Locks</li>
                <li>Course Catalog &amp; Workout Projections</li>
                <li>Closed-Loop Admission Pipeline</li>
                <li>Race Nominations &amp; Budget Authorizations</li>
              </ul>
            </div>

            {/* Col 3: Standards & Access */}
            <div className="md:col-span-4">
              <h4 className="text-[12px] font-bold tracking-wider text-[var(--color-text-primary)] uppercase">
                Standards &amp; Governance
              </h4>
              <p className="mt-3 text-[12px] leading-relaxed text-[var(--color-text-muted)]">
                Strict adherence to veterinary biosecurity protocols, clinical data privacy protections, and role-based
                operational permissions.
              </p>

              <div className="mt-5">
                <button
                  onClick={onSignIn}
                  className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-4 py-2 text-[13px] font-semibold text-white shadow-xs transition-colors hover:bg-[var(--color-primary-hover)]"
                >
                  <Icon name="user" size={14} />
                  <span>Sign in to Platform</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col items-center justify-between border-t border-[var(--color-border)] pt-6 text-[11px] text-[var(--color-text-muted)] sm:flex-row">
            <p>© 2026 Riverside Training Club &amp; RTMS Development Team (SWP391). All rights reserved.</p>
            <div className="mt-2 flex items-center gap-4 sm:mt-0">
              <span>Clinical Data Privacy</span>
              <span>·</span>
              <span>Racing Integrity Rules</span>
              <span>·</span>
              <span>Vite + React 19 + Tailwind CSS v4</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
