import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import { getAssetUrl } from '../../utils/assetUrl';
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
  const [feedTab, setFeedTab] = useState<'my' | 'community'>('community');

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
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. Hero Section & Gamification Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Main Hero Banner */}
        <div className="lg:col-span-2 bg-gradient-to-br from-navy-950 via-navy-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-navy-800 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Civic Engagement Platform</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
              {t.tagline}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {t.taglineSub}
            </p>
          </div>

          {/* Big "Report an Issue" CTA */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/10">
            <button
              onClick={onOpenReport}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl px-6 py-4 shadow-xl shadow-emerald-600/30 flex items-center justify-between sm:justify-start sm:space-x-5 group transform transition-all active:scale-98 border border-emerald-400/40"
              aria-label="Report a civic problem"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform shrink-0">
                <Camera className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 block">
                  3-Step AI Auto-Detect & Map Pin
                </span>
                <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                  {t.reportIssue}
                </h2>
              </div>
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 shrink-0 ml-auto">
                <Sparkles className="w-3 h-3 fill-slate-950" /> +25 XP
              </span>
            </button>
          </div>
        </div>

        {/* Gamification & Points Hub Card */}
        <div
          onClick={onOpenGamification}
          className="bg-navy-900 text-white p-6 rounded-3xl shadow-xl border border-navy-800 flex flex-col justify-between hover:border-amber-400/40 transition-all cursor-pointer group relative overflow-hidden"
          role="button"
          aria-label="View points, level and rewards"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6 fill-slate-950" />
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center group-hover:translate-x-1 transition-transform">
                Rewards Hub <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-amber-300 tracking-wider">
                {currentUser.levelName} • Level {currentUser.level}
              </span>
              <h3 className="text-2xl font-black text-white mt-0.5">
                {currentUser.points} <span className="text-base font-semibold text-slate-300">XP Points</span>
              </h3>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-semibold">
                <span>Next Tier</span>
                <span>{currentUser.points % 200} / 200 XP</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
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

          <div className="relative z-10 mt-4 pt-4 border-t border-navy-800 flex items-center justify-between text-xs text-slate-300">
            <span>Unlocked Badges</span>
            <span className="font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              {currentUser.badges.filter((b) => b.unlocked).length} of {currentUser.badges.length}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Issue Feed Header & Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex bg-slate-200/90 p-1.5 rounded-2xl border border-slate-300">
            <button
              onClick={() => setFeedTab('community')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                feedTab === 'community'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.communityFeed} ({communityReports.length})
            </button>
            <button
              onClick={() => setFeedTab('my')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                feedTab === 'my'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.myReports} ({myReports.length})
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Zone: {currentUser.ward.split('-')[0]}</span>
            <span className="text-slate-400">•</span>
            <span>{currentList.length} Active Listings</span>
          </div>
        </div>

        {/* 3. Responsive Multi-Column Card Grid */}
        {currentList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">{t.noReportsYet}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first civic hero in your ward to report an issue and earn welcome XP!
            </p>
            <button
              onClick={onOpenReport}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-md"
            >
              {t.reportProblem}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {currentList.map((issue) => {
              const isResolved = issue.status === 'Resolved';
              return (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-400/80 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Media Header */}
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                    <img
                      src={isResolved && issue.afterPhotoUrl ? issue.afterPhotoUrl : issue.photoUrl}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const fallback = getAssetUrl('issues/garbage.jpg');
                        if (target.src !== fallback) {
                          target.src = fallback;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Category & Status Chips */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-navy-950/80 text-white backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                        #{issue.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${getStatusBadge(
                          issue.status
                        )}`}
                      >
                        {t.statuses[issue.status]}
                      </span>
                    </div>

                    {isResolved && (
                      <span className="absolute bottom-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                        REPAIRED ✓
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs font-extrabold text-white drop-shadow-md">
                        {t.categories[issue.category]}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 flex items-start">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1.5 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{issue.location.address}</span>
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-slate-400" />
                          {issue.createdAt}
                        </span>
                        {issue.assignedWorkerName && (
                          <span className="text-blue-700 font-semibold truncate max-w-[130px]">
                            {issue.assignedWorkerName}
                          </span>
                        )}
                      </div>

                      {/* Card Footer: Upvote & Detail */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            upvoteReport(issue.id);
                          }}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            issue.hasUpvoted
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
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

                        <span className="inline-flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                          <span>{t.viewTracking}</span>
                          <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
