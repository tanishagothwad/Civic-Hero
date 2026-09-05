import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import { getAssetUrl } from '../../utils/assetUrl';
import { createRipple } from '../common/MaterialRipple';
import {
  Search,
  Eye,
  ArrowUpDown,
  ThumbsUp,
  HardHat,
} from 'lucide-react';

interface ComplaintTableProps {
  onSelectIssue: (issue: CivicIssue) => void;
  onAssignWorker: (issue: CivicIssue) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  severityFilter: string;
  setSeverityFilter: (sev: string) => void;
}

export const ComplaintTable: React.FC<ComplaintTableProps> = ({
  onSelectIssue,
  onAssignWorker,
  categoryFilter,
  setCategoryFilter,
  severityFilter,
  setSeverityFilter,
}) => {
  const { issues, t } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [wardFilter, setWardFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'upvotes'>('date');

  // Distinct wards from issues
  const wards = Array.from(new Set(issues.map((i) => i.location.ward)));

  // Filter & Search
  const filtered = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.citizenName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesWard = wardFilter === 'all' || issue.location.ward === wardFilter;

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus && matchesWard;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'upvotes') {
      return b.upvotes - a.upvotes;
    }
    if (sortBy === 'priority') {
      const weight: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return weight[b.severity] - weight[a.severity];
    }
    return 0; // default initial order
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-50 text-mat-critical border-mat-critical/30';
      case 'High':
        return 'bg-orange-50 text-mat-high border-mat-high/30';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-mat-medium/40';
      default:
        return 'bg-blue-50 text-mat-low border-mat-low/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-50 text-mat-secondary border-mat-secondary/30';
      case 'In Progress':
        return 'bg-blue-50 text-mat-low border-mat-low/30';
      case 'Acknowledged':
        return 'bg-amber-50 text-amber-800 border-mat-medium/40';
      default:
        return 'bg-gray-100 text-mat-text-secondary border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded border border-gray-200 shadow-elevation-1 overflow-hidden flex flex-col">
      {/* Search & Filter Bar */}
      <div className="p-4 border-b border-gray-200 space-y-3 bg-[#FAFAFA]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-mat-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket #, keyword, ward, or citizen..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded text-xs text-mat-text-primary placeholder:text-gray-400 focus:outline-none focus:border-mat-secondary focus:ring-1 focus:ring-mat-secondary transition-all"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-mat-text-secondary" />
            <span className="text-xs text-mat-text-secondary font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-mat-text-primary focus:outline-none focus:border-mat-secondary"
            >
              <option value="date">Most Recent</option>
              <option value="priority">Highest Severity</option>
              <option value="upvotes">Most Citizen Upvotes</option>
            </select>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-mat-text-primary focus:outline-none focus:border-mat-secondary"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-mat-text-primary focus:outline-none focus:border-mat-secondary"
          >
            <option value="all">All Categories</option>
            <option value="Garbage">Garbage & Waste</option>
            <option value="Pothole">Pothole</option>
            <option value="Water Leak">Water Leak</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Drain">Drain / Sewage</option>
          </select>

          {/* Severity */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-mat-text-primary focus:outline-none focus:border-mat-secondary"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Ward */}
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-mat-text-primary focus:outline-none focus:border-mat-secondary"
          >
            <option value="all">All Wards</option>
            {wards.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>

          <span className="text-[11px] text-mat-text-secondary ml-auto font-medium">
            Showing {sorted.length} of {issues.length} complaints
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-mat-text-secondary">
          <thead className="bg-[#FAFAFA] text-mat-text-secondary font-medium uppercase text-[10px] tracking-wider border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">Ticket & Photo</th>
              <th className="py-3 px-4">Category / Issue</th>
              <th className="py-3 px-4">Ward Location</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Worker</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-mat-text-secondary">
                  No matching complaints found.
                </td>
              </tr>
            ) : (
              sorted.map((issue) => (
                <tr
                  key={issue.id}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                  onClick={() => onSelectIssue(issue)}
                >
                  {/* Photo & Ticket */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={issue.photoUrl}
                        alt={issue.title}
                        className="w-10 h-10 rounded object-cover border border-gray-200 flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const fallback = getAssetUrl('issues/garbage.jpg');
                          if (target.src !== fallback) {
                            target.src = fallback;
                          }
                        }}
                      />
                      <div>
                        <span className="font-mono font-medium text-mat-text-primary block">
                          #{issue.ticketNumber}
                        </span>
                        <span className="text-[10px] text-mat-text-secondary">{issue.createdAt}</span>
                      </div>
                    </div>
                  </td>

                  {/* Title & Category */}
                  <td className="py-3 px-4">
                    <div className="max-w-xs">
                      <span className="text-[10px] font-medium text-mat-secondary bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wide">
                        {t.categories[issue.category]}
                      </span>
                      <h5 className="font-medium text-mat-text-primary mt-0.5 truncate">{issue.title}</h5>
                      <span className="text-[10px] text-mat-text-secondary flex items-center gap-1 mt-0.5">
                        <ThumbsUp className="w-2.5 h-2.5" /> {issue.upvotes} upvotes
                        {issue.mergedCount > 0 && ` • +${issue.mergedCount} merged`}
                      </span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4">
                    <div className="max-w-[180px]">
                      <span className="font-medium text-mat-text-primary text-[11px] block truncate">
                        {issue.location.ward}
                      </span>
                      <span className="text-[10px] text-mat-text-secondary truncate block">
                        {issue.location.address}
                      </span>
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(
                        issue.severity
                      )}`}
                    >
                      {t.severities[issue.severity]}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusBadge(
                        issue.status
                      )}`}
                    >
                      {t.statuses[issue.status]}
                    </span>
                  </td>

                  {/* Assigned Officer */}
                  <td className="py-3 px-4">
                    {issue.assignedWorkerName ? (
                      <div className="flex items-center space-x-1.5 text-mat-low font-medium">
                        <HardHat className="w-3.5 h-3.5 text-mat-low flex-shrink-0" />
                        <span className="truncate">{issue.assignedWorkerName}</span>
                      </div>
                    ) : (
                      <span className="text-mat-text-secondary italic text-[11px]">Unassigned</span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div
                      className="flex items-center justify-end space-x-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          createRipple(e);
                          onSelectIssue(issue);
                        }}
                        className="p-1.5 text-mat-text-secondary hover:text-mat-text-primary hover:bg-gray-100 rounded transition-colors ripple-surface"
                        title="View issue timeline"
                        aria-label="View issue"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {issue.status !== 'Resolved' && !issue.assignedWorkerName && (
                        <button
                          onClick={(e) => {
                            createRipple(e);
                            onAssignWorker(issue);
                          }}
                          className="px-2.5 py-1 bg-mat-secondary hover:bg-emerald-800 text-white rounded font-medium text-[11px] uppercase tracking-wider transition-all shadow-elevation-1 ripple-surface"
                          aria-label="Assign field worker"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
