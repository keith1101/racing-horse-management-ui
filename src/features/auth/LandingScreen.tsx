import { Icon } from '../../components/Icon';
import { BrandLogo } from '../../components/BrandLogo';

interface LandingScreenProps {
  onSignIn: () => void;
}

const HIGHLIGHTS = [
  ['horse', 'Horse operations', 'Profiles, ownership and stable context in one place.'],
  ['activity', 'Training readiness', 'Plans, weekly workouts and restrictions stay connected.'],
  ['heart-pulse', 'Clinical oversight', 'Veterinary review and injury mapping for safer decisions.'],
] as const;

export function LandingScreen({ onSignIn }: LandingScreenProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--color-background)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <BrandLogo className="h-9 w-9" />
          <div>
            <div className="text-[16px] font-semibold tracking-tight text-[var(--color-text-primary)]">RTMS</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.13em] text-[var(--color-text-muted)]">Riverside Training Club</div>
          </div>
        </div>
        <button onClick={onSignIn} className="rounded-[var(--radius-sm)] px-3 py-2 text-[13px] font-medium text-[var(--color-primary)] outline-none hover:bg-[var(--color-primary-soft)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]">
          Sign in
        </button>
      </header>

      <section className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
        <div className="relative z-10 max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/15 bg-[var(--color-primary-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" /> Operational command centre
          </p>
          <h1 className="mt-5 text-[38px] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-[52px]">
            Better care. <span className="text-[var(--color-primary)]">Sharper</span> performance.
          </h1>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-[var(--color-text-secondary)]">
            Riverside Training Management System brings horse care, clinical status, training and racing decisions into one role-based workspace.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={onSignIn} className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-4 text-[13px] font-semibold text-[var(--color-text-inverse)] outline-none transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]">
              Access RTMS <Icon name="chevron-right" size={15} />
            </button>
            <span className="inline-flex h-11 items-center px-1 text-[12px] text-[var(--color-text-muted)]">Role-based access for club staff and owners</span>
          </div>
        </div>

        <div className="relative rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-2xl shadow-[var(--color-primary)]/10 sm:p-6">
          <div className="rounded-[var(--radius-lg)] bg-[linear-gradient(135deg,#30295e,#6657c7_52%,#a99cf0)] p-6 text-[var(--color-text-inverse)] sm:p-8">
            <div className="flex items-center justify-between text-[11px] font-medium text-white/70"><span>RIVERSIDE TRAINING CLUB</span><span>20 SEP 2026</span></div>
            <div className="mt-12 flex items-end justify-between gap-4">
              <div><p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/65">Stable-wide readiness</p><p className="mt-2 text-4xl font-semibold tracking-tight">92<span className="text-xl text-white/65">%</span></p></div>
              <div className="flex h-24 w-32 items-end gap-1.5">{[38, 56, 45, 72, 66, 88, 92].map((height, index) => <span key={index} className="flex-1 rounded-t bg-white/80" style={{ height: `${height}%` }} />)}</div>
            </div>
          </div>
          <div className="-mt-3 mx-3 grid grid-cols-3 gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-lg shadow-black/5 sm:mx-5">
            <div><p className="text-[10px] text-[var(--color-text-muted)]">Fit horses</p><p className="mt-0.5 font-metric text-[18px] font-semibold">07</p></div>
            <div><p className="text-[10px] text-[var(--color-text-muted)]">Training today</p><p className="mt-0.5 font-metric text-[18px] font-semibold">06</p></div>
            <div><p className="text-[10px] text-[var(--color-text-muted)]">Open reviews</p><p className="mt-0.5 font-metric text-[18px] font-semibold">02</p></div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-10 sm:grid-cols-3 sm:px-8">
          {HIGHLIGHTS.map(([icon, title, description]) => <div key={title} className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><Icon name={icon} size={17} /></span><div><h2 className="text-[13px] font-semibold text-[var(--color-text-primary)]">{title}</h2><p className="mt-1 text-[12px] leading-relaxed text-[var(--color-text-secondary)]">{description}</p></div></div>)}
        </div>
      </section>
    </main>
  );
}
