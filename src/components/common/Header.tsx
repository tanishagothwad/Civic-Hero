import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Trophy, Globe } from 'lucide-react';

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
  const { currentUser, unreadNotificationCount, t } = useApp();

  return (
    <div className="bg-navy-900 text-white px-4 py-3 sticky top-0 z-30 shadow-md">
      <div className="flex items-center justify-between">
        {/* User Info / Level */}
        <button
          onClick={onOpenGamification}
          className="flex items-center space-x-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl p-1 -m-1 hover:bg-navy-800/80 transition-colors"
          aria-label={`View gamification level: ${currentUser.levelName} with ${currentUser.points} XP`}
        >
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
              alt={currentUser.name}
              className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover shadow"
            />
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
              {currentUser.level}
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-100">{currentUser.name}</span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-semibold px-1.5 py-0.2 rounded flex items-center gap-0.5 border border-amber-400/30">
                <Trophy className="w-2.5 h-2.5" />
                {currentUser.points} {t.points}
              </span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">{currentUser.levelName}</p>
          </div>
        </button>

        {/* Right Actions: Language & Notifications */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenLanguage}
            className="w-9 h-9 rounded-xl bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-slate-200 border border-navy-700 active:scale-95 transition-all"
            aria-label="Change language"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-xl bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-slate-200 border border-navy-700 active:scale-95 transition-all"
            aria-label={`Notifications. ${unreadNotificationCount} unread`}
          >
            <Bell className="w-4 h-4 text-slate-200" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
