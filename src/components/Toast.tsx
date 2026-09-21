import { useEffect } from 'react';
import { Icon } from './Icon';

export interface ToastMessage {
  id: number;
  message: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[320px] flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const id = setTimeout(() => onDismiss(toast.id), 3200);
    return () => clearTimeout(id);
  }, [toast.id, onDismiss]);

  return (
    <div className="pointer-events-auto flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 shadow-lg shadow-black/5">
      <span
        className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full ${
          toast.tone === 'success'
            ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
            : toast.tone === 'warning'
              ? 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]'
              : toast.tone === 'danger'
                ? 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
                : toast.tone === 'info'
                  ? 'bg-[var(--color-info-soft)] text-[var(--color-info)]'
                  : 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
        }`}
      >
        <Icon name={toast.tone === 'danger' || toast.tone === 'warning' ? 'alert-triangle' : 'check'} size={11} />
      </span>
      <p className="flex-1 text-[13px] text-[var(--color-text-primary)]">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
      >
        <Icon name="x" size={14} />
      </button>
    </div>
  );
}
