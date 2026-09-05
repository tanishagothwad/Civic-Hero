import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { createRipple } from './MaterialRipple';
import {
  Menu,
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
  onOpenDrawer?: () => void;
  onOpenLanguage: () => void;
  onOpenNotifications?: () => void;
  onOpenGamification?: () => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  onOpenDrawer,
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

  const roles: { key: UserRole; label: string; icon: React.ReactNode }[] = [
    {
      key: 'citizen',
      label: t.citizenRole || 'Citizen Portal',
      icon: <Users className="w-4 h-4" />,
    },
    {
      key: 'municipal',
      label: t.municipalRole || 'Municipal HQ',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      key: 'worker',
      label: t.workerRole || 'Field Ops',
      icon: <HardHat className="w-4 h-4" />,
    },
  ];

  const currentLangObj = languageList.find((l) => l.code === language);

  return (
    <header className="bg-[#0B132B] text-white sticky top-0 z-40 shadow-elevation-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Hamburger button + Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onOpenDrawer && (
            <button
              onClick={(e) => {
                createRipple(e, 'rgba(255, 255, 255, 0.3)');
                onOpenDrawer();
              }}
              className="w-10 h-10 rounded flex items-center justify-center text-white/87 hover:text-white hover:bg-white/10 transition-colors ripple-surface"
              aria-label="Open navigation drawer"
              title="Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-[#2E7D32] flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-wide text-white">
                  {t.appName || 'Civic Hero'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Material Tabs for Portals */}
        <nav className="flex items-center space-x-1 h-full overflow-x-auto" aria-label="Portals">
          {roles.map((r) => {
            const isActive = role === r.key;
            return (
              <button
                key={r.key}
                onClick={(e) => {
                  createRipple(e, 'rgba(46, 125, 50, 0.3)');
                  setRole(r.key);
                }}
                className={`relative h-full px-3 sm:px-4 flex items-center space-x-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ripple-surface ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                aria-label={`Switch to ${r.label}`}
              >
                <span className={isActive ? 'text-[#81C784]' : 'text-white/60'}>
                  {r.icon}
                </span>
                <span className="hidden sm:inline">{r.label}</span>
                {/* Active Underline Indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#2E7D32] rounded-t" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Gamification + Notification + Language + User Menu */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Gamification XP Chip */}
          {role === 'citizen' && onOpenGamification && (
            <button
              onClick={(e) => {
                createRipple(e, 'rgba(251, 192, 45, 0.3)');
                onOpenGamification();
              }}
              className="hidden md:flex items-center space-x-1.5 bg-[#FBC02D]/15 hover:bg-[#FBC02D]/25 text-[#FBC02D] px-2.5 py-1.5 rounded text-xs font-bold transition-colors ripple-surface border border-[#FBC02D]/30"
              title="View your XP points & badges"
            >
              <Trophy className="w-3.5 h-3.5 fill-[#FBC02D]" />
              <span>{currentUser.points} XP</span>
            </button>
          )}

          {/* Notifications Icon Button */}
          {onOpenNotifications && (
            <button
              onClick={(e) => {
                createRipple(e, 'rgba(255, 255, 255, 0.3)');
                onOpenNotifications();
              }}
              className="relative w-9 h-9 rounded flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors ripple-surface"
              aria-label={`Notifications (${unreadNotificationCount} unread)`}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute 1 right-1 bg-[#D32F2F] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          )}

          {/* Language Selector */}
          <button
            onClick={(e) => {
              createRipple(e, 'rgba(255, 255, 255, 0.3)');
              onOpenLanguage();
            }}
            className="flex items-center space-x-1 text-white/80 hover:text-white hover:bg-white/10 px-2 py-1.5 rounded text-xs font-medium transition-colors ripple-surface"
            title="Switch Language"
          >
            <Globe className="w-4 h-4 text-[#81C784]" />
            <span className="hidden xl:inline">{currentLangObj?.nativeName || 'Language'}</span>
          </button>

          {/* User Session Chip */}
          {session && (
            <div className="hidden lg:flex items-center space-x-2 bg-white/10 px-2.5 py-1 rounded text-xs">
              <span className="w-2 h-2 rounded-full bg-[#81C784]" />
              <span className="text-white/90 font-medium truncate max-w-[100px]">{session.name}</span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={(e) => {
              createRipple(e, 'rgba(211, 47, 47, 0.3)');
              logout();
            }}
            className="w-9 h-9 rounded flex items-center justify-center text-red-300 hover:text-white hover:bg-red-900/40 transition-colors ripple-surface"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default RoleSwitcherBar;
