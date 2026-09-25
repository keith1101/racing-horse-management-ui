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
      'Structured workout logging, pace targets, and post-session performance assessments',
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
    summary: 'Frontline care across active barns, maintaining feeding routines, stall care, and physical observations.',
    features: [
      'Shift-based care checklists: feeds, fresh bedding, hand-walking, and grooming routines',
      'Observation and incident reporting available for veterinary review',
      'Create Candidate Horse records and log identity details and intake condition',
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
      'Self-service admission with four required documents and four optional supporting documents',
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
      'Makes the final admission eligibility decision and assigns the horse’s final stable slot',
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
    stageName: 'Owner Submission',
    roleBadge: 'Horse Owner',
    roleTone: 'var(--color-racing)',
    title: 'Submit the horse admission dossier',
    description: 'The owner submits horse identity details and documents. Horse photo, registration document, pedigree certificate, and vaccination record are required; four supporting medical documents are optional.',
    deliverables: ['Four required documents', 'Four optional supporting documents', 'Admission sent to Groom review'],
  },
  {
    stepNumber: 2,
    stageName: 'Candidate & Quarantine',
    roleBadge: 'Groom / Stable Hand',
    roleTone: 'var(--color-grooming)',
    title: 'Create the Candidate Horse in quarantine',
    description: 'After approving the dossier, the Groom creates a Candidate Horse and assigns an available quarantine slot. The system creates an initial exam schedule and makes the medical dossier available to Veterinary.',
    deliverables: ['Candidate Horse record', 'Quarantine slot', 'Initial exam schedule and medical dossier'],
  },
  {
    stepNumber: 3,
    stageName: 'Veterinary Examination & Approval',
    roleBadge: 'Veterinarian',
    roleTone: 'var(--color-medical)',
    title: 'Record the examination and approve veterinary review',
    description: 'The veterinarian arranges and records the examination from the initial schedule, then approves the veterinary review. This approval does not end quarantine; release waits for final stable-slot assignment.',
    deliverables: ['Medical record entry', 'Veterinary review approval', 'Quarantine remains in effect'],
  },
  {
    stepNumber: 4,
    stageName: 'Trainer Assessment',
    roleBadge: 'Head Trainer',
    roleTone: 'var(--color-training)',
    title: 'Create a racing readiness assessment',
    description: 'The trainer creates a RACING_READINESS_ASSESSMENT to document racing readiness. This records an assessment; the trainer does not approve the admission.',
    deliverables: ['RACING_READINESS_ASSESSMENT record', 'Trainer readiness findings'],
  },
  {
    stepNumber: 5,
    stageName: 'Final Eligibility & Slot',
    roleBadge: 'Club Manager',
    roleTone: 'var(--color-finance)',
    title: 'Decide eligibility and assign the final stall',
    description: 'The manager makes the final eligibility decision and assigns the horse’s final stable slot. The horse remains in quarantine until that slot has been assigned.',
    deliverables: ['Final eligibility decision', 'Final Barn and Stall assignment', 'Release from quarantine after slot assignment'],
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
              <h1 className="mt-5 text-[36px] font-bold leading-[1.12] tracking-tight text-[var(--color-text-primary)] sm:text-[46px] lg:text-[50px]">
                Peak performance. <br />
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[#8572ea] bg-clip-text text-transparent">
                  Uncompromised
                </span>{' '}
                clinical oversight.
              </h1>

              <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-[16px]">
                RTMS unifies 5 operational roles: from candidate intake and veterinary care to progressive
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
                  <span>Course Curricula & Workout Projections</span>
                </div>
              </div>
            </div>

            {/* Right: Live Product Preview (Thoroughbred Operations & Stable Profile Card) */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xl shadow-black/5 sm:p-6">
                {/* Operations Header */}
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
                    </span>
                    <span className="font-metric text-[11px] font-medium tracking-wide text-[var(--color-text-secondary)] uppercase">
                      OFFICIAL CLUB ROSTER · ACTIVE CONTENDER
                    </span>
                  </div>
                  <span className="rounded-xs bg-[var(--color-surface-muted)] px-2 py-0.5 font-metric text-[10px] font-medium text-[var(--color-text-muted)]">
                    BARN B · STALL 04
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
                        <span className="rounded-full bg-[var(--color-surface-muted)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--color-text-secondary)]">
                          HORSE PROFILE
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                        4yo Colt · Sire: Deep Impact · Dam: Starlight Express · Marlowe Racing Ltd.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Operational Data Grid */}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                      <Icon name="gauge" size={13} className="text-[var(--color-training)]" />
                      <span className="text-[10px] font-medium tracking-wide uppercase">Weight</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-metric text-[22px] font-bold text-[var(--color-text-primary)]">492</span>
                      <span className="text-[11px] text-[var(--color-text-secondary)]">kg</span>
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--color-success)] font-medium">Optimal racing trim</p>
                  </div>

                  <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                      <Icon name="flag" size={13} className="text-[var(--color-racing)]" />
                      <span className="text-[10px] font-medium tracking-wide uppercase">Career Record</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-metric text-[22px] font-bold text-[var(--color-text-primary)]">12</span>
                      <span className="text-[11px] text-[var(--color-text-secondary)]">starts</span>
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">5 wins · 3 places</p>
                  </div>

                  <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                      <Icon name="activity" size={13} className="text-[var(--color-info)]" />
                      <span className="text-[10px] font-medium tracking-wide uppercase">Today's Session</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-metric text-[22px] font-bold text-[var(--color-text-primary)]">06:00</span>
                      <span className="text-[11px] text-[var(--color-text-secondary)]">breeze</span>
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--color-success)] font-medium">Completed · 1,000m</p>
                  </div>

                  <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                      <Icon name="user" size={13} className="text-[var(--color-primary)]" />
                      <span className="text-[10px] font-medium tracking-wide uppercase">Trainer</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-[15px] font-bold text-[var(--color-text-primary)] truncate">E. Cardoso</span>
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">Head Trainer</p>
                  </div>
                </div>

                {/* Active Curriculum & Training Plan */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] px-3.5 py-2.5 text-[12px]">
                  <div className="flex items-center gap-2">
                    <Icon name="activity" size={15} className="text-[var(--color-primary)]" />
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Active Plan: Sprint Campaign Preparation (Week 4 of 6)
                    </span>
                  </div>
                  <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--color-primary)] shadow-xs">
                    Progress: 82%
                  </span>
                </div>

                {/* Upcoming Racing Nomination */}
                <div className="mt-3 flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 text-[12px]">
                  <div className="flex items-center gap-2">
                    <Icon name="flag" size={14} className="text-[var(--color-racing)]" />
                    <span className="text-[var(--color-text-secondary)]">
                      Next Target: <strong className="text-[var(--color-text-primary)]">Riverside Spring Classic</strong> (1,600m)
                    </span>
                  </div>
                  <span className="font-metric text-[11px] font-medium text-[var(--color-text-muted)]">
                    05 Oct 2026
                  </span>
                </div>

                {/* Training Restriction Status Banner */}
                <div className="mt-3 flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-success)]/30 bg-[var(--color-success-soft)] px-3 py-2 text-[11px]">
                  <div className="flex items-center gap-2 text-[var(--color-success)]">
                    <Icon name="check" size={14} />
                    <span className="font-medium">Training restriction: none shown</span>
                  </div>
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
            <h2 className="text-[28px] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[36px]">
              Closed-Loop Admission &amp; Intake Pipeline
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              Five workflow steps take a Candidate Horse from groom-created record through veterinary approval and a
              trainer readiness assessment to the manager’s final eligibility and stable-slot decision.
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
                    Records for this step:
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

              {/* Admission Decision Guide */}
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:col-span-5">
                <h4 className="text-[13px] font-bold text-[var(--color-text-primary)]">
                  Admission Decision Points
                </h4>
                <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                  Veterinary approval and the manager’s final eligibility decision are separate steps. The trainer records an assessment.
                </p>

                <div className="mt-4 space-y-2.5">
                  <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                      1
                    </span>
                    <div>
                      <span className="text-[12px] font-bold text-[var(--color-text-primary)]">Veterinary approval</span>
                      <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
                        The veterinarian records the exam in the medical record and approves the veterinary review.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                      2
                    </span>
                    <div>
                      <span className="text-[12px] font-bold text-[var(--color-text-primary)]">Trainer assessment</span>
                      <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
                        The trainer creates a RACING_READINESS_ASSESSMENT without an approval action.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                      3
                    </span>
                    <div>
                      <span className="text-[12px] font-bold text-[var(--color-text-primary)]">Manager eligibility &amp; slot</span>
                      <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
                        The manager decides final eligibility and assigns the stable slot. Quarantine continues until assignment.
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
                  <span>Access RTMS</span>
                  <Icon name="chevron-right" size={14} />
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
