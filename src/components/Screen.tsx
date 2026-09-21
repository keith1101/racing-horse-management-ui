import type { ReactNode } from 'react';
import { AppShell } from './AppShell';
import { PageHeader } from './PageHeader';
import { useRtms, type ModuleId } from '../app/RtmsContext';

interface ScreenProps {
  title: string;
  context?: ReactNode;
  primary?: ReactNode;
  secondary?: ReactNode;
  children: ReactNode;
}

/** Standard module screen: global shell + page header + scrollable body. */
export function Screen({ title, context, primary, secondary, children }: ScreenProps) {
  const { route, navigate } = useRtms();
  return (
    <AppShell activeModule={route.module} onNavigate={(id) => navigate(id as ModuleId)}>
      <PageHeader title={title} context={context} primary={primary} secondary={secondary} />
      <div className="scroll-slim min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
    </AppShell>
  );
}
