import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import {
  Camera,
  Trophy,
  Clock,
  MapPin,
  ThumbsUp,
  ChevronRight,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface CitizenHomeProps {
  onOpenReport: () => void;
  onSelectIssue: (issue: CivicIssue) => void;
  onOpenGamification: () => void;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({
  onOpenReport,
  onSelectIssue,
  onOpenGamification,
}) => {
  const { currentUser, issues, upvoteReport, t } = useApp();
  const [feedTab, setFeedTab] = useState<'my' | 'community'>('my');

  const myReports = issues.filter((i) => i.citizenId === currentUser.id);
  const communityReports = issues;

  const currentList = feedTab === 'my' ? myReports : communityReports;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Acknowledged':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-8 space-y-4 px-3 sm:px-4 pt-3">
      {/* 1. Hero Tagline & Gamification Banner */}
      <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-emerald-950 text-white p-4 rounded-3xl shadow-xl relative overflow-hidden border border-navy-800">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tagline */}
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Civic Engagement Platform</span>
          </div>

          <h1 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
            {t.tagline}
          </h1>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {t.taglineSub}
          </p>
        </div>

        {/* Points & Level Bar Preview (Answers "What did I earn?") */}
        <div
          onClick={onOpenGamification}
          className="mt-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/10 cursor-pointer transition-all"
          role="button"
          aria-label="View points and rewards"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow">
                <Trophy className="w-4 h-4 fill-slate-950" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300">
                  {currentUser.levelName}
                </span>
                <h3 className="text-xs font-black text-white">{currentUser.points} XP Points</h3>
              </div>
            </div>

            <span className="text-[11px] font-bold text-emerald-300 flex items-center">
              {currentUser.badges.filter((b) => b.unlocked).length} Badges
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>

          {/* Mini progress bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(((currentUser.points % 200) / 200) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Big Central "Report an Issue" Action (Answers "What can I do here?") */}
      <div className="text-center">
        <button
          onClick={onOpenReport}
          className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-3xl p-4 sm:p-5 shadow-xl shadow-emerald-600/30 flex items-center justify-between group transform transition-all active:scale-98 border border-emerald-400/40 min-h-touch"
          aria-label="Report a civic problem"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
              <Camera className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 block">
                3-Step AI Auto-Detect
              </span>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                {t.reportIssue}
              </h2>
              <span className="text-[11px] text-emerald-100 font-medium">
                Pothole • Garbage • Water • Light • Drain
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-slate-950" /> +25 XP
            </span>
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white mt-2 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>

      {/* 3. Feed Tabs & Report Tracker List (Answers "What's happening with my report?") */}
      <div className="space-y-3 pt-2">
        {/* Feed Tab Header */}
        <div className="flex items-center justify-between">
          <div className="flex bg-slate-200/80 p-1 rounded-2xl">
            <button
              onClick={() => setFeedTab('my')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all min-h-touch ${
                feedTab === 'my'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.myReports} ({myReports.length})
            </button>
            <button
              onClick={() => setFeedTab('community')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all min-h-touch ${
                feedTab === 'community'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.communityFeed} ({communityReports.length})
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-semibold">
            {currentUser.ward.split('-')[0]}
          </span>
        </div>

        {/* Reports Feed List */}
        <div className="space-y-3">
          {currentList.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-600 font-medium">{t.noReportsYet}</p>
              <button
                onClick={onOpenReport}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow"
              >
                {t.reportProblem}
              </button>
            </div>
          ) : (
            currentList.map((issue) => {
              const isResolved = issue.status === 'Resolved';
              return (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  {/* Card Top: Category + Status Badge + Ticket No */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        #{issue.ticketNumber}
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-900">
                        {t.categories[issue.category]}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${getStatusBadge(
                        issue.status
                      )}`}
                    >
                      {t.statuses[issue.status]}
                    </span>
                  </div>

                  {/* Card Center: Image & Description */}
                  <div className="flex space-x-3">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                      <img
                        src={isResolved && issue.afterPhotoUrl ? issue.afterPhotoUrl : issue.photoUrl}
                        alt={issue.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.endsWith('/issues/garbage.jpg')) {
                            target.src = '/issues/garbage.jpg';
                          }
                        }}
                      />
                      {isResolved && (
                        <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[8px] font-black px-1 py-0.2 rounded shadow">
                          FIXED
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                          {issue.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center">
                          <MapPin className="w-3 h-3 text-emerald-600 mr-1 flex-shrink-0" />
                          <span className="truncate">{issue.location.address}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-0.5" />
                          {issue.createdAt}
                        </span>

                        {issue.assignedWorkerName && (
                          <span className="text-blue-700 font-semibold truncate max-w-[120px]">
                            {issue.assignedWorkerName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Upvote Button & Tracking Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        upvoteReport(issue.id);
                      }}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-touch ${
                        issue.hasUpvoted
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                      aria-label="Upvote report"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${issue.hasUpvoted ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                      <span>{issue.upvotes}</span>
                      {issue.mergedCount > 0 && (
                        <span className="text-[9px] text-amber-700 font-bold bg-amber-100 px-1 py-0.2 rounded">
                          +{issue.mergedCount} merged
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectIssue(issue)}
                      className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 p-1"
                    >
                      <span>{t.viewTracking}</span>
                      <ChevronRight className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
