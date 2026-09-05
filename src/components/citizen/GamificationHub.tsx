import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Award, Users, CheckCircle2, Lock, X } from 'lucide-react';
import { createRipple } from '../common/MaterialRipple';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded shadow-elevation-8 w-full max-w-lg overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
        {/* Header with Level Gradient */}
        <div className="bg-mat-primary text-white p-5 relative overflow-hidden flex-shrink-0 border-b border-mat-primary-dark">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-medium text-white tracking-wide">{t.earnXp}</h3>
            </div>
            <button
              onClick={(e) => {
                createRipple(e);
                onClose();
              }}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors ripple-surface"
              aria-label="Close rewards modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Level Progress Banner */}
          <div className="mt-4 bg-white/10 backdrop-blur-xs rounded p-4 border border-white/15">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-amber-300 font-medium">
                  {t.level} {currentUser.level}
                </span>
                <h4 className="text-lg font-medium text-white">{currentUser.levelName}</h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-amber-300">{currentUser.points}</span>
                <span className="text-xs text-white/70 font-medium block uppercase tracking-wider">{t.points}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/70 mt-1.5 font-medium uppercase tracking-wider">
                <span>Current: {currentUser.points} XP</span>
                <span>Next Tier: {currentUser.nextLevelPoints} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={(e) => {
              createRipple(e);
              setActiveTab('badges');
            }}
            className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider flex items-center justify-center space-x-2 border-b-2 transition-all ripple-surface ${
              activeTab === 'badges'
                ? 'border-mat-secondary text-mat-secondary bg-emerald-50/20'
                : 'border-transparent text-mat-text-secondary hover:text-mat-text-primary'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{t.badgesTitle} ({currentUser.badges.filter((b) => b.unlocked).length}/{currentUser.badges.length})</span>
          </button>
          <button
            onClick={(e) => {
              createRipple(e);
              setActiveTab('leaderboard');
            }}
            className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider flex items-center justify-center space-x-2 border-b-2 transition-all ripple-surface ${
              activeTab === 'leaderboard'
                ? 'border-mat-secondary text-mat-secondary bg-emerald-50/20'
                : 'border-transparent text-mat-text-secondary hover:text-mat-text-primary'
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
                  className={`p-3.5 rounded border transition-all flex items-start space-x-3 shadow-elevation-1 ${
                    badge.unlocked
                      ? 'bg-amber-50/50 border-amber-200 text-mat-text-primary'
                      : 'bg-[#FAFAFA] border-gray-200 opacity-75 text-mat-text-secondary'
                  }`}
                >
                  {/* Badge Icon */}
                  <div
                    className={`w-11 h-11 rounded flex items-center justify-center text-xl flex-shrink-0 shadow-xs ${
                      badge.unlocked
                        ? 'bg-amber-100 border border-amber-300 text-amber-900'
                        : 'bg-gray-200 border border-gray-300'
                    }`}
                  >
                    {badge.icon}
                  </div>

                  {/* Badge Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-medium truncate text-mat-text-primary">{badge.name}</h5>
                      {badge.unlocked ? (
                        <span className="text-[10px] bg-emerald-100 text-mat-secondary font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase tracking-wide">
                          <CheckCircle2 className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-200 text-mat-text-secondary font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase tracking-wide">
                          <Lock className="w-3 h-3" /> {badge.progress}/{badge.maxProgress}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-mat-text-secondary mt-1 leading-snug">
                      {badge.description}
                    </p>

                    {/* Progress indicator */}
                    {!badge.unlocked && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
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
              <div className="flex items-center justify-between bg-gray-100 p-0.5 rounded border border-gray-200">
                <button
                  onClick={(e) => {
                    createRipple(e);
                    setLeaderboardScope('ward');
                  }}
                  className={`flex-1 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-all ripple-surface ${
                    leaderboardScope === 'ward'
                      ? 'bg-white text-mat-secondary shadow-elevation-1'
                      : 'text-mat-text-secondary hover:text-mat-text-primary'
                  }`}
                >
                  {currentUser.ward}
                </button>
                <button
                  onClick={(e) => {
                    createRipple(e);
                    setLeaderboardScope('city');
                  }}
                  className={`flex-1 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-all ripple-surface ${
                    leaderboardScope === 'city'
                      ? 'bg-white text-mat-secondary shadow-elevation-1'
                      : 'text-mat-text-secondary hover:text-mat-text-primary'
                  }`}
                >
                  Bengaluru City
                </button>
              </div>

              {/* Leaderboard Table */}
              <div className="divide-y divide-gray-100 bg-white rounded border border-gray-200 shadow-elevation-1 overflow-hidden">
                {leaderboard.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 transition-colors ${
                      item.isCurrentUser ? 'bg-amber-50/70 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span
                        className={`w-6 text-center text-xs font-bold ${
                          item.rank === 1
                            ? 'text-amber-500 text-sm'
                            : item.rank === 2
                            ? 'text-gray-400 text-sm'
                            : item.rank === 3
                            ? 'text-amber-700 text-sm'
                            : 'text-mat-text-secondary'
                        }`}
                      >
                        {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                      </span>

                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center space-x-1">
                          <h6 className="text-xs font-medium text-mat-text-primary truncate">{item.name}</h6>
                        </div>
                        <p className="text-[10px] text-mat-text-secondary truncate">{item.badgeTitle} • {item.ward}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-amber-700">{item.points} XP</span>
                      <span className="text-[10px] text-mat-text-secondary block">{item.reportsCount} reports</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAFAFA] border-t border-gray-200 text-center flex-shrink-0">
          <p className="text-[11px] text-mat-text-secondary">
            Earn +25 XP per report, +15 XP for duplicate merge, +50 XP when resolved!
          </p>
        </div>
      </div>
    </div>
  );
};
