import { useState } from 'react';
import { useRtms, type ModuleId } from '../app/RtmsContext';
import { BrandLogo } from './BrandLogo';
import { Icon } from './Icon';
import { IconButton } from './IconButton';

export interface NavModule {
  id: ModuleId;
  label: string;
}

const MODULES: NavModule[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'horses', label: 'Horses' },
  { id: 'training', label: 'Training' },
  { id: 'veterinary', label: 'Veterinary' },
  { id: 'stable-care', label: 'Stable care' },
  { id: 'stables', label: 'Stables' },
  { id: 'racing', label: 'Racing' },
  { id: 'management', label: 'Management' },
];

interface TopNavProps {
  active: string;
  onNavigate: (id: string) => void;
}

export function TopNav({ active, onNavigate }: TopNavProps) {
  const {
    currentUser,
    logout,
    visibleModules,
    notifications,
    markNotificationRead,
  } = useRtms();
  const [accountOpen, setAccountOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const modules = MODULES
    .filter((module) => visibleModules.includes(module.id))
    .map((module) => {
      if (module.id === 'management') {
        return { ...module, label: currentUser.role === 'HORSE_OWNER' ? 'My account' : currentUser.role === 'CLUB_MANAGER' ? 'Management' : 'Admissions' };
      }
      if (module.id === 'horses' && currentUser.role === 'HORSE_OWNER') return { ...module, label: 'My horses' };
      if (module.id === 'veterinary' && currentUser.role === 'GROOM') return { ...module, label: 'Stable health' };
      return module;
    });
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-6 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4">
      <div className="flex items-center gap-2">
        <BrandLogo className="h-7 w-7" />
        <span className="text-[15px] font-semibold tracking-tight text-[var(--color-text-primary)]">RTMS</span>
      </div>

      <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
        {modules.map((module) => {
          const isActive = module.id === active;
          return (
            <button
              key={module.id}
              onClick={() => onNavigate(module.id)}
              aria-current={isActive ? 'page' : undefined}
              className={
                'relative h-14 px-3 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ' +
                (isActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]')
              }
            >
              {module.label}
              {isActive && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--color-primary)]" />}
            </button>
          );
        })}
      </nav>
      <label className="relative lg:hidden">
        <span className="sr-only">Current module</span>
        <select
          aria-label="Current module"
          value={active}
          onChange={(event) => onNavigate(event.target.value)}
          className="h-8 max-w-[132px] appearance-none rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 pr-6 text-[12px] font-medium text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
        >
          {modules.map((module) => <option key={module.id} value={module.id}>{module.label}</option>)}
        </select>
        <Icon name="chevron-down" size={13} className="pointer-events-none absolute right-1.5 top-2 text-[var(--color-text-muted)]" />
      </label>

      <div className="ml-auto flex items-center gap-1">
        <div className="relative">
          <IconButton
            icon="bell"
            label={`${unreadCount} unread notifications`}
            active={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setAccountOpen(false);
            }}
          />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-1.5 min-w-1.5 rounded-full bg-[var(--color-danger)] ring-2 ring-[var(--color-surface)]" />
          )}
          {notificationsOpen && (
            <div className="absolute right-0 top-10 z-40 w-80 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">Notifications</span>
                <span className="text-[11px] text-[var(--color-text-muted)]">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-auto">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    className="flex w-full gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-left hover:bg-[var(--color-surface-subtle)]"
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.unread ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border-strong)]'}`} />
                    <span className="min-w-0">
                      <span className="block text-[12px] font-medium text-[var(--color-text-primary)]">{notification.title}</span>
                      <span className="mt-0.5 block text-[11px] leading-relaxed text-[var(--color-text-secondary)]">{notification.detail}</span>
                      <span className="mt-0.5 block text-[10px] text-[var(--color-text-muted)]">{notification.time}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setAccountOpen((open) => !open);
              setNotificationsOpen(false);
            }}
            className="ml-1 flex items-center gap-2 rounded-[var(--radius-sm)] py-1 pl-1 pr-2 outline-none hover:bg-[var(--color-surface-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            aria-label="Account menu"
            aria-expanded={accountOpen}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[11px] font-semibold text-[var(--color-primary)]">
              {currentUser.initials}
            </span>
            <span className="hidden text-left leading-tight lg:block">
              <span className="block text-[12px] font-medium text-[var(--color-text-primary)]">{currentUser.name}</span>
              <span className="block text-[10px] text-[var(--color-text-muted)]">{currentUser.roleLabel}</span>
            </span>
            <Icon name="chevron-down" size={14} className="hidden text-[var(--color-text-muted)] lg:block" />
          </button>
          {accountOpen && (
            <div className="absolute right-0 top-10 z-40 w-64 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-xl shadow-black/10">
              <div className="border-b border-[var(--color-border)] px-2 pb-2">
                <p className="text-[12px] font-semibold text-[var(--color-text-primary)]">Account</p>
                <p className="mt-0.5 truncate text-[11px] text-[var(--color-text-muted)]">{currentUser.email}</p>
                <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">{currentUser.roleLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setAccountOpen(false);
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-left text-[12px] font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]"
              >
                <Icon name="arrow-left" size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
