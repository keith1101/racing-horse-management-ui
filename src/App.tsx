import { Component, useState, type ErrorInfo, type ReactNode } from 'react';
import { RtmsProvider, useRtms } from './app/RtmsContext';
import { HorseManagementScreen } from './features/horses/HorseManagementScreen';
import { OverviewScreen } from './features/overview/OverviewScreen';
import { TrainingScreen } from './features/training/TrainingScreen';
import { VeterinaryScreen } from './features/veterinary/VeterinaryScreen';
import { StableCareScreen } from './features/care/StableCareScreen';
import { RacingScreen } from './features/racing/RacingScreen';
import { ManagementScreen } from './features/management/ManagementScreen';
import { LoginScreen } from './features/auth/LoginScreen';
import { LandingScreen } from './features/auth/LandingScreen';

function AppContent() {
  const { isAuthenticated } = useRtms();
  const [publicScreen, setPublicScreen] = useState<'landing' | 'login'>('landing');
  if (isAuthenticated) return <Router />;
  return publicScreen === 'landing'
    ? <LandingScreen onSignIn={() => setPublicScreen('login')} />
    : <LoginScreen onBack={() => setPublicScreen('landing')} />;
}

function Router() {
  const { route, canAccessModule } = useRtms();
  if (!canAccessModule(route.module)) return <AccessDeniedScreen />;
  switch (route.module) {
    case 'overview':
      return <OverviewScreen />;
    case 'horses':
      return <HorseManagementScreen />;
    case 'training':
      return <TrainingScreen />;
    case 'veterinary':
      return <VeterinaryScreen />;
    case 'stable-care':
      return <StableCareScreen />;
    case 'racing':
      return <RacingScreen />;
    case 'management':
      return <ManagementScreen />;
    default:
      return <OverviewScreen />;
  }
}

function AccessDeniedScreen() {
  const { route, navigate, currentUser } = useRtms();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-6">
      <div className="max-w-md rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-danger-soft)] text-[var(--color-danger)]">!</div>
        <h1 className="mt-3 text-[17px] font-semibold text-[var(--color-text-primary)]">Access denied</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
          The {route.module.replace('-', ' ')} module is not available to {currentUser.roleLabel}.
        </p>
        <button
          onClick={() => navigate('overview')}
          className="mt-4 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-3 py-2 text-[13px] font-medium text-[var(--color-text-inverse)]"
        >
          Return to overview
        </button>
      </div>
    </div>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Keep the application shell recoverable if an individual screen fails.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-6">
          <div className="max-w-md rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
            <h1 className="text-[17px] font-semibold text-[var(--color-text-primary)]">Something went wrong</h1>
            <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">This screen could not render. Reload the application to continue.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-3 py-2 text-[13px] font-medium text-[var(--color-text-inverse)]"
            >
              Reload app
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <RtmsProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </RtmsProvider>
  );
}
