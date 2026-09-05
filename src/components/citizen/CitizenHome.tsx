import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import { getAssetUrl } from '../../utils/assetUrl';
import { createRipple } from '../common/MaterialRipple';
import { GoogleSearchHero } from './GoogleSearchHero';
import {
  Camera,
  Trophy,
  Clock,
  MapPin,
  ThumbsUp,
  ChevronRight,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { NavSection } from '../common/NavigationRail';

interface CitizenHomeProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenReport: () => void;
  onSelectIssue: (issue: CivicIssue) => void;
  onOpenGamification: () => void;
  selectedIssueId?: string | null;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({
  activeSection,
  onSelectSection,
  searchQuery,
  onSearchChange,
  onOpenReport,
  onSelectIssue,
  onOpenGamification,
  selectedIssueId,
}) => {
  const { currentUser, issues, upvoteReport, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter issues based on activeSection, search query, and category filters
  const filteredIssues = useMemo(() => {
    let list = issues;

    // Filter by tab
    if (activeSection === 'my-reports') {
      list = list.filter((i) => i.citizenId === currentUser.id);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.ticketNumber.toLowerCase().includes(q) ||
          i.location.ward.toLowerCase().includes(q) ||
          i.location.address.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      list = list.filter((i) => i.category === selectedCategory);
    }

    return list;
  }, [issues, activeSection, currentUser.id, searchQuery, selectedCategory]);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Categories' },
    { key: 'Pothole', label: 'Potholes' },
    { key: 'Water Leak', label: 'Water Leaks' },
    { key: 'Garbage', label: 'Garbage' },
    { key: 'Street Light', label: 'Street Lights' },
    { key: 'Drainage', label: 'Drainage' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]';
      case 'In Progress':
        return 'bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]';
      case 'Acknowledged':
        return 'bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]';
      default:
        return 'bg-[#F1F3F4] text-[#5F6368] border border-[#DADCE0]';
    }
  };

  const getSeverityChip = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]';
      case 'High':
        return 'bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]';
      case 'Medium':
        return 'bg-[#FEF7E0] text-[#78350F] border border-[#FBBC05]/40';
      default:
        return 'bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* SECTION 1: Google Search Centered Minimal Landing Hero (Shown on 'home' tab) */}
      {activeSection === 'home' && (
        <>
          <GoogleSearchHero
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onOpenReport={onOpenReport}
            onBrowseCommunity={() => onSelectSection('community')}
          />

          {/* Gamification & Neighborhood Rewards Summary Card */}
          <div className="bg-white rounded-xl border border-[#DADCE0] shadow-elevation-1 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FEF7E0] border border-[#FEEFC3] text-[#B06000] flex items-center justify-center shadow-xs shrink-0">
                <Trophy className="w-7 h-7 fill-[#FBBC05] text-[#B06000]" />
              </div>
              <div>
                <span className="text-xs uppercase font-medium tracking-wider text-[#5F6368]">
                  {currentUser.ward} • {currentUser.levelName}
                </span>
                <h3 className="text-xl font-bold text-[#202124] mt-0.5">
                  {currentUser.points} <span className="text-sm font-normal text-[#5F6368]">Citizen XP Points</span>
                </h3>
                <p className="text-xs text-[#5F6368] mt-0.5">
                  Level {currentUser.level} Citizen • {currentUser.badges.filter((b) => b.unlocked).length} of {currentUser.badges.length} badges unlocked
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                onClick={(e) => {
                  createRipple(e, 'rgba(66, 133, 244, 0.15)');
                  onOpenGamification();
                }}
                className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-[#DADCE0] hover:bg-[#F8F9FA] text-xs font-medium text-[#202124] transition-colors ripple-surface"
              >
                View Badges & Perks
              </button>
              <button
                onClick={(e) => {
                  createRipple(e, 'rgba(255, 255, 255, 0.3)');
                  onOpenReport();
                }}
                className="flex-1 md:flex-none px-5 py-2 rounded-lg bg-[#4285F4] hover:bg-[#1A73E8] text-white text-xs font-medium transition-colors shadow-elevation-1 ripple-surface flex items-center justify-center space-x-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>Report an Issue</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* SECTION 2: Filter Toolbar (Google Workspace-style Pills) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DADCE0]">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#202124]">
              {activeSection === 'home'
                ? 'Recent Community Issues'
                : activeSection === 'my-reports'
                ? 'My Reported Issues'
                : activeSection === 'leaderboard'
                ? 'Civic Leaderboard & Rankings'
                : 'Community Issues Feed'}
            </h2>
            <p className="text-xs text-[#5F6368] mt-0.5">
              {filteredIssues.length} reports in {currentUser.ward.split('-')[0]}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={(e) => {
                  createRipple(e, 'rgba(66, 133, 244, 0.15)');
                  setSelectedCategory(cat.key);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                  selectedCategory === cat.key
                    ? 'bg-[#E8F0FE] text-[#1A73E8] border-[#4285F4]'
                    : 'bg-white text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 3: 12-Column Responsive Grid Content Area */}
        {filteredIssues.length === 0 ? (
          /* Google-Style Empty State: Centered Icon, Clear Copy, Single Action Button */
          <div className="bg-white rounded-xl p-12 text-center shadow-elevation-1 border border-[#DADCE0] max-w-md mx-auto my-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center mx-auto shadow-xs">
              <Search className="w-8 h-8 text-[#4285F4]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#202124]">
                {searchQuery ? 'No matching issues found' : 'No issues reported yet'}
              </h3>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                {searchQuery
                  ? `We couldn't find anything matching "${searchQuery}". Try searching a different ward, landmark, or category.`
                  : 'Be the first citizen in your neighborhood to report an issue and earn +25 XP!'}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={(e) => {
                  createRipple(e, 'rgba(255, 255, 255, 0.3)');
                  if (searchQuery) onSearchChange('');
                  else onOpenReport();
                }}
                className="bg-[#4285F4] hover:bg-[#1A73E8] text-white font-medium text-xs px-6 py-2.5 rounded-full shadow-elevation-1 hover:shadow-elevation-2 transition-all ripple-surface"
              >
                {searchQuery ? 'Clear Search Filter' : 'Report an Issue (+25 XP)'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => {
              const isResolved = issue.status === 'Resolved';
              const isSelected = selectedIssueId === issue.id;

              return (
                <div
                  key={issue.id}
                  onClick={(e) => {
                    createRipple(e, 'rgba(66, 133, 244, 0.1)');
                    onSelectIssue(issue);
                  }}
                  className={`bg-white rounded-xl shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-200 border flex flex-col justify-between overflow-hidden cursor-pointer group ripple-surface ${
                    isSelected
                      ? 'border-[#4285F4] ring-2 ring-[#4285F4]/30 shadow-elevation-3'
                      : 'border-[#DADCE0]'
                  }`}
                >
                  {/* Card Media Header */}
                  <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                    <img
                      src={isResolved && issue.afterPhotoUrl ? issue.afterPhotoUrl : issue.photoUrl}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
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
                      <span className="text-[11px] font-mono font-medium bg-[#202124]/85 text-white px-2 py-0.5 rounded shadow-sm">
                        #{issue.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm ${getStatusBadge(
                          issue.status
                        )}`}
                      >
                        {t.statuses[issue.status] || issue.status}
                      </span>
                    </div>

                    {isResolved && (
                      <span className="absolute bottom-2.5 right-2.5 bg-[#34A853] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>RESOLVED</span>
                      </span>
                    )}

                    <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-white drop-shadow">
                        {t.categories[issue.category] || issue.category}
                      </span>
                      <span
                        className={`text-[9px] font-medium px-1.5 py-0.2 rounded shadow-xs ${getSeverityChip(
                          issue.severity
                        )}`}
                      >
                        {issue.severity}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-[#202124] line-clamp-2 leading-snug group-hover:text-[#1A73E8] transition-colors">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-[#5F6368] mt-1 flex items-start">
                        <MapPin className="w-3.5 h-3.5 text-[#4285F4] mr-1 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{issue.location.address}</span>
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div className="space-y-2 pt-2 border-t border-[#DADCE0]/60">
                      <div className="flex items-center justify-between text-xs text-[#5F6368]">
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {issue.createdAt}
                        </span>
                        {issue.assignedWorkerName && (
                          <span className="text-[#1A73E8] font-medium truncate max-w-[120px]">
                            {issue.assignedWorkerName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            createRipple(e, 'rgba(66, 133, 244, 0.2)');
                            upvoteReport(issue.id);
                          }}
                          className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-all ripple-surface ${
                            issue.hasUpvoted
                              ? 'bg-[#E8F0FE] text-[#1A73E8] border border-[#4285F4]'
                              : 'bg-white text-[#202124] border border-[#DADCE0] hover:bg-[#F8F9FA]'
                          }`}
                          aria-label="Upvote report"
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${issue.hasUpvoted ? 'fill-[#1A73E8] text-[#1A73E8]' : ''}`} />
                          <span>{issue.upvotes}</span>
                          {issue.mergedCount > 0 && (
                            <span className="text-[9px] text-[#B06000] font-bold bg-[#FEF7E0] border border-[#FBBC05]/40 px-1 rounded">
                              +{issue.mergedCount}
                            </span>
                          )}
                        </button>

                        <span className="text-xs text-[#1A73E8] font-medium group-hover:underline flex items-center">
                          Inspect Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
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

export default CitizenHome;
