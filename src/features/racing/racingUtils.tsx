export function ordinal(n: number) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const remainder = n % 100;
  return n + (suffixes[(remainder - 20) % 10] ?? suffixes[remainder] ?? suffixes[0]);
}

export function RaceMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">{label}</div>
      <div className="text-[12px] text-[var(--color-text-primary)]">{value}</div>
    </div>
  );
}
