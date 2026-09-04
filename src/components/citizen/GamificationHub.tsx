import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Award, Users, CheckCircle2, Lock, X } from 'lucide-react';

interface GamificationHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GamificationHub: React.FC<GamificationHubProps> = ({ isOpen, onClose }) => {
  const { currentUser, leaderboard, t } = useApp();
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard'>('badges');
  const [leaderboardScope, setLeaderboardScope] = useState<'ward' | 'city'>('ward');

  if (!isOpen) return null;

  const currentLevelProgress = Math.min(
    100,
    Math.round(((currentUser.points % 200) / 200) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header with Level Gradient */}
        <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-emerald-950 text-white p-5 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold">{t.earnXp}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close rewards modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Level Progress Banner */}
          <div className="mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
                  {t.level} {currentUser.level}
                </span>
                <h4 className="text-lg font-black text-white">{currentUser.levelName}</h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">{currentUser.points}</span>
                <span className="text-xs text-slate-300 font-medium block">{t.points}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-300 mt-1 font-medium">
                <span>Current: {currentUser.points} XP</span>
                <span>Next Tier: {currentUser.nextLevelPoints} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'badges'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{t.badgesTitle} ({currentUser.badges.filter((b) => b.unlocked).length}/{currentUser.badges.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'leaderboard'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.leaderboard}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'badges' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentUser.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start space-x-3 ${
                    badge.unlocked
                      ? 'bg-amber-50/50 border-amber-200 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-70 text-slate-600'
                  }`}
                >
                  {/* Badge Icon */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm ${
                      badge.unlocked
                        ? 'bg-gradient-to-tr from-amber-400 to-amber-200 border border-amber-300'
                        : 'bg-slate-200 border border-slate-300'
                    }`}
                  >
                    {badge.icon}
                  </div>

                  {/* Badge Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold truncate text-slate-900">{badge.name}</h5>
                      {badge.unlocked ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> {badge.progress}/{badge.maxProgress}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      {badge.description}
                    </p>

                    {/* Progress indicator */}
                    {!badge.unlocked && (
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Sub-scope toggle (Ward vs City) */}
              <div className="flex items-center justify-between bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setLeaderboardScope('ward')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    leaderboardScope === 'ward'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {currentUser.ward}
                </button>
                <button
                  onClick={() => setLeaderboardScope('city')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    leaderboardScope === 'city'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bengaluru City
                </button>
              </div>

              {/* Leaderboard Table */}
              <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {leaderboard.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 transition-colors ${
                      item.isCurrentUser ? 'bg-amber-50/80 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span
                        className={`w-6 text-center text-xs font-black ${
                          item.rank === 1
                            ? 'text-amber-500 text-sm'
                            : item.rank === 2
                            ? 'text-slate-400 text-sm'
                            : item.rank === 3
                            ? 'text-amber-700 text-sm'
                            : 'text-slate-500'
                        }`}
                      >
                        {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                      </span>

                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center space-x-1">
                          <h6 className="text-xs font-bold text-slate-900 truncate">{item.name}</h6>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{item.badgeTitle} • {item.ward}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-black text-amber-600">{item.points} XP</span>
                      <span className="text-[10px] text-slate-400 block">{item.reportsCount} reports</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center flex-shrink-0">
          <p className="text-[11px] text-slate-500">
            Earn +25 XP per report, +15 XP for duplicate merge, +50 XP when resolved!
          </p>
        </div>
      </div>
    </div>
  );
};
