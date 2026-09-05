import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Shield,
  LayoutDashboard,
  HardHat,
  Users,
  Globe,
  LogOut,
  Bell,
  Trophy,
} from 'lucide-react';
import { languageList } from '../../i18n/translations';

interface RoleSwitcherBarProps {
  onOpenLanguage: () => void;
  onOpenNotifications?: () => void;
  onOpenGamification?: () => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  onOpenLanguage,
  onOpenNotifications,
  onOpenGamification,
}) => {
  const {
    role,
    setRole,
    language,
    session,
    logout,
    currentUser,
    unreadNotificationCount,
    t,
  } = useApp();

  const roles: { key: UserRole; label: string; icon: React.ReactNode; badge: string }[] = [
    {
      key: 'citizen',
      label: t.citizenRole || 'Citizen Portal',
      icon: <Users className="w-4 h-4" />,
      badge: 'Public',
    },
    {
      key: 'municipal',
      label: t.municipalRole || 'Municipal HQ',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: 'Admin',
    },
    {
      key: 'worker',
      label: t.workerRole || 'Field Ops',
      icon: <HardHat className="w-4 h-4" />,
      badge: 'Operations',
    },
  ];

  const currentLangObj = languageList.find((l) => l.code === language);

  return (
    <header className="bg-navy-950 text-white border-b border-navy-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-white">{t.appName || 'Civic Hero'}</span>
              <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Official City Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.tagline || 'Report. Track. Earn. Change Your City.'}
            </p>
          </div>
        </div>

        {/* Persona Switcher Tabs */}
        <nav className="flex items-center bg-navy-900/90 p-1 rounded-xl border border-navy-800 shadow-inner overflow-x-auto max-w-full" aria-label="Portal Navigation">
          {roles.map((r) => {
            const isActive = role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800'
                }`}
                aria-label={`Switch view to ${r.label}`}
              >
                {r.icon}
                <span>{r.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-normal hidden lg:inline ${
                    isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-navy-950 text-slate-400'
                  }`}
                >
                  {r.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Gamification + Notifications + Language + User Menu */}
        <div className="flex items-center space-x-2">
          {/* Gamification XP pill */}
          {role === 'citizen' && onOpenGamification && (
            <button
              onClick={onOpenGamification}
              className="hidden sm:flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
              title="View your XP points and badges"
            >
              <Trophy className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{currentUser.points} XP</span>
            </button>
          )}

          {/* Notifications Bell */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative w-8 h-8 rounded-lg bg-navy-900 hover:bg-navy-800 flex items-center justify-center text-slate-200 border border-navy-700 transition-colors"
              aria-label={`Notifications (${unreadNotificationCount} unread)`}
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-200" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          )}

          {/* Language Selector */}
          <button
            onClick={onOpenLanguage}
            className="flex items-center space-x-1.5 bg-navy-900 hover:bg-navy-800 text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-navy-700 text-xs font-medium transition-colors"
            aria-label="Select Language"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">{currentLangObj?.nativeName || 'Language'}</span>
          </button>

          {/* User Session Info Pill */}
          {session && (
            <div className="hidden xl:flex items-center space-x-2 bg-navy-900/90 border border-navy-800 px-2.5 py-1 rounded-lg text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left leading-tight">
                <span className="font-bold text-slate-200 block text-[11px] truncate max-w-[110px]">{session.name}</span>
                <span className="text-[9px] text-emerald-400 font-mono">{session.role.toUpperCase()}</span>
              </div>
            </div>
          )}

          {/* Log Out Button */}
          <button
            onClick={logout}
            className="flex items-center space-x-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
            title="Log out and return to sign-in screen"
            aria-label="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.logout || 'Log Out'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

