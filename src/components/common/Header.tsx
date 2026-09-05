import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Trophy, Globe, LogOut, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenGamification: () => void;
  onOpenLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenGamification,
  onOpenLanguage,
}) => {
  const { currentUser, unreadNotificationCount, role, session, logout, t } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-30 shadow-md">
      <div className="bg-[#4285F4] text-white px-4 py-3">
      <div className="flex items-center justify-between">
        {/* User Info / Level */}
        <button
          onClick={onOpenGamification}
          className="flex items-center space-x-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded p-1 -m-1 hover:bg-white/10 transition-colors"
          aria-label={`View gamification level: ${currentUser.levelName} with ${currentUser.points} XP`}
        >
          <div className="relative">
            <img
              src={session?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full border-2 border-[#FBBC05] object-cover shadow"
            ></img>
            <span className="absolute -bottom-1 -right-1 bg-[#FBBC05] text-[#202124] font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
              {currentUser.level}
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-white truncate max-w-[110px]">{currentUser.name}</span>
              {role === 'citizen' && (
                <span className="bg-[#FBBC05] text-[#202124] text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 shadow-xs">
                  <Trophy className="w-2.5 h-2.5" />
                  {currentUser.points} {t.points}
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/80 font-medium">
              {role === 'citizen' ? currentUser.levelName : session?.department || currentUser.levelName}
            </p>
          </div>
        </button>

        {/* Right Actions: Language & Notifications & Quick Profile Menu */}
        <div className="flex items-center space-x-1.5 relative">
          <button
            onClick={onOpenLanguage}
            className="w-9 h-9 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all"
            aria-label="Change language"
          >
            <Globe className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all"
            aria-label={`Notifications. ${unreadNotificationCount} unread`}
          >
            <Bell className="w-4 h-4 text-white" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EA4335] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Quick Menu Toggle */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all"
            aria-label="User Account Menu"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Profile Dropdown Popup */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-[#DADCE0] rounded shadow-elevation-8 p-2 z-50 text-[#202124]">
              <div className="px-3 py-2 border-b border-[#DADCE0] mb-1">
                <p className="text-xs font-bold truncate">{currentUser.name}</p>
                <p className="text-[10px] text-[#5F6368] font-mono">{session?.phone || currentUser.phone}</p>
                <span className="inline-block mt-1 bg-[#E8F0FE] text-[#1A73E8] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#1A73E8]/30">
                  {role.toUpperCase()}
                </span>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full text-left flex items-center space-x-2 px-3 py-2 text-xs text-[#EA4335] hover:bg-red-50 rounded font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.logout || 'Log Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="google-accent-bar" />
  </header>
);
};

