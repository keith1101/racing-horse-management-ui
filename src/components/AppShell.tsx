import type { ReactNode } from 'react';
import { TopNav } from './TopNav';

interface AppShellProps {
  activeModule: string;
  onNavigate: (id: string) => void;
  children: ReactNode;
}

export function AppShell({ activeModule, onNavigate, children }: AppShellProps) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[var(--color-background)]">
      <TopNav active={activeModule} onNavigate={onNavigate} />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
