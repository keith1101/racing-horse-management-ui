import { useEffect, type ReactNode } from 'react';
import { IconButton } from './IconButton';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}

/** Right-side drawer for quick detail / edit contexts (DESIGN.md §15). */
export function Drawer({ open, onClose, title, subtitle, children, footer, width = 440 }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-black/25"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        style={{ width }}
        className="absolute right-0 top-0 flex h-full max-w-[92vw] flex-col bg-[var(--color-surface)] shadow-xl shadow-black/10"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3">
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-[var(--color-text-primary)]">{title}</div>
            {subtitle && <div className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">{subtitle}</div>}
          </div>
          <IconButton icon="x" label="Close panel" onClick={onClose} />
        </div>
        <div className="scroll-slim min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-[var(--color-border)] px-4 py-3">
            {footer}
          </div>
        )}
      </aside>
    </div>
  );
}
