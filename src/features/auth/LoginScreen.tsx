import { FormEvent, useState } from 'react';
import { Icon } from '../../components/Icon';
import { BrandLogo } from '../../components/BrandLogo';
import { useRtms } from '../../app/RtmsContext';

const inputClassName =
  'mt-1 h-10 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[13px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-focus)]/30';

export function LoginScreen({ onBack }: { onBack?: () => void }) {
  const { login } = useRtms();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const result = login(email, password);
    if (!result.success) setError(result.message);
    setSubmitting(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <BrandLogo className="h-9 w-9" />
          <span className="text-[18px] font-semibold tracking-tight text-[var(--color-text-primary)]">RTMS</span>
        </div>
        {onBack && <button onClick={onBack} className="mb-4 flex items-center gap-1 text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"><Icon name="arrow-left" size={13} /> Back to RTMS</button>}

        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl shadow-black/5">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">Riverside Training Club</p>
            <h1 className="mt-2 text-[22px] font-semibold tracking-tight text-[var(--color-text-primary)]">Sign in to RTMS</h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">Access horse, training, veterinary and stable operations based on your role.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-[12px] font-medium text-[var(--color-text-primary)]">Work email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClassName}
                placeholder="name@riversidertms.com"
                autoComplete="username"
                required
              />
            </label>

            <label className="block">
              <span className="text-[12px] font-medium text-[var(--color-text-primary)]">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClassName}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>

            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-[var(--color-danger-soft)] px-3 py-2.5 text-[12px] text-[var(--color-danger)]">
                <Icon name="alert-triangle" size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-3 text-[13px] font-medium text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
              Sign in
            </button>
          </form>
        </section>

        <p className="mt-4 text-center text-[11px] text-[var(--color-text-muted)]">Use your assigned RTMS credentials.</p>
      </div>
    </main>
  );
}
