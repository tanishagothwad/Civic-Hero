import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import { getAssetUrl } from '../../utils/assetUrl';
import { createRipple } from '../common/MaterialRipple';
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
        return 'bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]';
      case 'In Progress':
        return 'bg-[#E3F2FD] text-[#1976D2] border border-[#90CAF9]';
      case 'Acknowledged':
        return 'bg-[#FFF8E1] text-[#F57C00] border border-[#FFE082]';
      default:
        return 'bg-[#EEEEEE] text-[#616161] border border-[#E0E0E0]';
    }
  };

  const getSeverityChip = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-[#FFEBEE] text-[#D32F2F] border border-[#FFCDD2]';
      case 'High':
        return 'bg-[#FFF3E0] text-[#F57C00] border border-[#FFE0B2]';
      case 'Medium':
        return 'bg-[#FFFDE7] text-[#FBC02D] border border-[#FFF59D]';
      default:
        return 'bg-[#E3F2FD] text-[#1976D2] border border-[#BBDEFB]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Material Hero Section & Gamification Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Main Hero Card (Navy #0B132B, 4px corners, elevation-2) */}
        <div className="lg:col-span-2 bg-[#0B132B] text-white p-6 sm:p-8 rounded shadow-elevation-2 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#2E7D32]/30 text-[#81C784] text-xs font-medium uppercase tracking-wider border border-[#2E7D32]/50">
              <Sparkles className="w-3.5 h-3.5 text-[#81C784]" />
              <span>Civic Engagement Platform</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-normal text-white">
              {t.tagline}
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl font-normal leading-relaxed">
              {t.taglineSub}
            </p>
          </div>

          {/* Material Contained Primary Button for Reporting */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
            <button
              onClick={(e) => {
                createRipple(e, 'rgba(255, 255, 255, 0.4)');
                onOpenReport();
              }}
              className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium uppercase tracking-wider text-xs sm:text-sm px-6 py-3.5 rounded shadow-elevation-2 hover:shadow-elevation-4 transition-all flex items-center space-x-2.5 ripple-surface focus:ring-2 focus:ring-[#81C784]"
              aria-label="Report a civic problem"
            >
              <Camera className="w-5 h-5 shrink-0" />
              <span>{t.reportIssue}</span>
              <span className="bg-[#FBC02D] text-[#212121] text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                +25 XP
              </span>
            </button>
            <span className="text-xs text-white/60 font-normal">
              Pothole • Water Leak • Garbage • Streetlight • Drain
            </span>
          </div>
        </div>

        {/* Gamification Summary Card (Surface #FFFFFF, 4px corners, elevation-1) */}
        <div
          onClick={(e) => {
            createRipple(e, 'rgba(46, 125, 50, 0.1)');
            onOpenGamification();
          }}
          className="bg-white text-[#212121] p-6 rounded shadow-elevation-1 hover:shadow-elevation-3 transition-shadow cursor-pointer flex flex-col justify-between border border-slate-200/80 ripple-surface group"
          role="button"
          aria-label="View points and rewards"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded bg-[#FFF8E1] border border-[#FFE082] text-[#F57C00] flex items-center justify-center shadow-sm">
                <Trophy className="w-6 h-6 fill-[#F57C00]" />
              </div>
              <span className="text-xs font-medium text-[#2E7D32] flex items-center uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                Rewards Hub <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>

            <div>
              <span className="text-xs uppercase font-medium tracking-wider text-black/60 block">
                {currentUser.levelName} • Level {currentUser.level}
              </span>
              <h3 className="text-2xl font-bold text-[#212121] mt-0.5">
                {currentUser.points} <span className="text-sm font-normal text-black/60">XP Points</span>
              </h3>
            </div>

            {/* Material Linear Progress Bar */}
            <div>
              <div className="flex justify-between text-xs text-black/60 mb-1.5 font-normal">
                <span>Next Tier Progress</span>
                <span className="font-medium">{currentUser.points % 200} / 200 XP</span>
              </div>
              <div className="w-full bg-[#E0E0E0] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#2E7D32] h-full rounded-full transition-all duration-500"
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

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-black/60">
            <span>Badges Unlocked</span>
            <span className="font-medium text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded">
              {currentUser.badges.filter((b) => b.unlocked).length} / {currentUser.badges.length}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Material Tabs & Filter Section */}
      <div className="space-y-4">
        <div className="bg-white rounded shadow-elevation-1 border border-slate-200/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3">
          {/* Material Flat Tabs with active indicator */}
          <div className="flex space-x-1 sm:space-x-4 border-b border-transparent">
            <button
              onClick={(e) => {
                createRipple(e, 'rgba(46, 125, 50, 0.15)');
                setFeedTab('community');
              }}
              className={`py-2 px-3 rounded-t text-sm font-medium transition-colors relative ripple-surface ${
                feedTab === 'community'
                  ? 'text-[#2E7D32] font-semibold'
                  : 'text-black/60 hover:text-black/87'
              }`}
            >
              {t.communityFeed} ({communityReports.length})
              {feedTab === 'community' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2E7D32]" />
              )}
            </button>

            <button
              onClick={(e) => {
                createRipple(e, 'rgba(46, 125, 50, 0.15)');
                setFeedTab('my');
              }}
              className={`py-2 px-3 rounded-t text-sm font-medium transition-colors relative ripple-surface ${
                feedTab === 'my'
                  ? 'text-[#2E7D32] font-semibold'
                  : 'text-black/60 hover:text-black/87'
              }`}
            >
              {t.myReports} ({myReports.length})
              {feedTab === 'my' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2E7D32]" />
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-black/60 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span>Zone: {currentUser.ward.split('-')[0]}</span>
            <span>•</span>
            <span>{currentList.length} Listings</span>
          </div>
        </div>

        {/* 3. Material Card Grid (Elevation 1 resting, Elevation 3 on hover, 4px rounded) */}
        {currentList.length === 0 ? (
          <div className="bg-white rounded p-12 text-center shadow-elevation-1 border border-slate-200 space-y-3">
            <AlertCircle className="w-12 h-12 mx-auto text-black/38" />
            <h3 className="text-base font-medium text-black/87">{t.noReportsYet}</h3>
            <p className="text-xs text-black/60 max-w-sm mx-auto">
              Be the first citizen in your ward to report an issue and earn +25 XP!
            </p>
            <button
              onClick={(e) => {
                createRipple(e, 'rgba(255, 255, 255, 0.4)');
                onOpenReport();
              }}
              className="mt-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium uppercase tracking-wider text-xs px-5 py-2.5 rounded shadow-elevation-1 transition-all ripple-surface"
            >
              {t.reportProblem}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentList.map((issue) => {
              const isResolved = issue.status === 'Resolved';
              return (
                <div
                  key={issue.id}
                  onClick={(e) => {
                    createRipple(e, 'rgba(46, 125, 50, 0.1)');
                    onSelectIssue(issue);
                  }}
                  className="bg-white rounded shadow-elevation-1 hover:shadow-elevation-3 transition-shadow duration-200 border border-slate-200/80 cursor-pointer flex flex-col justify-between overflow-hidden group ripple-surface"
                >
                  {/* Card Media Header */}
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                    <img
                      src={isResolved && issue.afterPhotoUrl ? issue.afterPhotoUrl : issue.photoUrl}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
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

                    {/* Top Row: Ticket Number & Status Badge */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="text-[11px] font-mono font-medium bg-[#0B132B]/85 text-white px-2 py-0.5 rounded shadow-sm">
                        #{issue.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wider shadow-sm ${getStatusBadge(
                          issue.status
                        )}`}
                      >
                        {t.statuses[issue.status]}
                      </span>
                    </div>

                    {isResolved && (
                      <span className="absolute bottom-2.5 right-2.5 bg-[#2E7D32] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        RESOLVED ✓
                      </span>
                    )}

                    <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-white drop-shadow">
                        {t.categories[issue.category]}
                      </span>
                      <span className={`text-[9px] font-medium px-1.5 py-0.2 rounded shadow-xs ${getSeverityChip(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-black/87 line-clamp-2 leading-snug group-hover:text-[#2E7D32] transition-colors">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-black/60 mt-1 flex items-start">
                        <MapPin className="w-3.5 h-3.5 text-[#2E7D32] mr-1 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{issue.location.address}</span>
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-black/60">
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {issue.createdAt}
                        </span>
                        {issue.assignedWorkerName && (
                          <span className="text-[#1976D2] font-medium truncate max-w-[120px]">
                            {issue.assignedWorkerName}
                          </span>
                        )}
                      </div>

                      {/* Card Actions: Outlined Upvote & Text View Button */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            createRipple(e, 'rgba(46, 125, 50, 0.2)');
                            upvoteReport(issue.id);
                          }}
                          className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-all ripple-surface ${
                            issue.hasUpvoted
                              ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]'
                              : 'bg-white text-black/87 border border-slate-300 hover:bg-slate-50'
                          }`}
                          aria-label="Upvote report"
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${issue.hasUpvoted ? 'fill-[#2E7D32] text-[#2E7D32]' : ''}`} />
                          <span>{issue.upvotes}</span>
                          {issue.mergedCount > 0 && (
                            <span className="text-[9px] text-[#F57C00] font-bold bg-[#FFF3E0] px-1 rounded">
                              +{issue.mergedCount}
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            createRipple(e, 'rgba(46, 125, 50, 0.15)');
                            onSelectIssue(issue);
                          }}
                          className="text-[#2E7D32] hover:bg-[#2E7D32]/10 px-2 py-1 rounded text-xs font-medium uppercase tracking-wider flex items-center transition-colors ripple-surface"
                        >
                          <span>{t.viewTracking}</span>
                          <ChevronRight className="w-4 h-4 ml-0.5" />
                        </button>
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

export default CitizenHome;
