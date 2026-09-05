import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import { getAssetUrl } from '../../utils/assetUrl';
import { ResolveTaskModal } from './ResolveTaskModal';
import { IssueTrackerModal } from '../citizen/IssueTrackerModal';
import { createRipple } from '../common/MaterialRipple';
import {
  MapPin,
  Play,
  CheckCircle2,
  Navigation,
  Volume2,
  Star,
  Check,
} from 'lucide-react';

export const FieldWorkerApp: React.FC = () => {
  const { issues, updateIssueStatus, fieldWorkers, t } = useApp();
  const [selectedIssueForResolve, setSelectedIssueForResolve] = useState<CivicIssue | null>(null);
  const [selectedIssueForDetail, setSelectedIssueForDetail] = useState<CivicIssue | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');

  const currentWorker = fieldWorkers[0]; // Ramesh Kumar by default

  // Worker assigned tasks + all unassigned high priority tasks in ward
  const assignedTasks = issues.filter(
    (i) => i.assignedWorkerId === currentWorker.id || !i.assignedWorkerId
  );

  const filteredTasks = assignedTasks.filter((task) => {
    if (activeFilter === 'pending') return task.status === 'Submitted' || task.status === 'Acknowledged';
    if (activeFilter === 'in_progress') return task.status === 'In Progress';
    if (activeFilter === 'resolved') return task.status === 'Resolved';
    return true;
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

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Field Officer Profile Header Card */}
      <div className="bg-mat-primary text-white p-4 rounded shadow-elevation-2 border border-mat-primary-dark relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={currentWorker.avatar}
                alt={currentWorker.name}
                className="w-12 h-12 rounded object-cover border-2 border-emerald-400 shadow-elevation-1"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-mat-secondary border-2 border-mat-primary" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-medium text-white">{currentWorker.name}</h3>
                <span className="text-[10px] bg-amber-400 text-black font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-black" />
                  {currentWorker.rating}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300 font-medium">{currentWorker.role}</p>
              <p className="text-[10px] text-white/70">{currentWorker.ward}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-medium text-emerald-300 block uppercase tracking-wider">Duty Status</span>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-200 font-medium px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wide">
              Active Shift
            </span>
          </div>
        </div>

        {/* Task Counter Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
          <div className="bg-white/10 p-2 rounded border border-white/10">
            <span className="text-base font-bold text-amber-300">
              {assignedTasks.filter((t) => t.status === 'In Progress').length}
            </span>
            <span className="text-[9px] text-white/70 block uppercase tracking-wider font-medium">In Progress</span>
          </div>
          <div className="bg-white/10 p-2 rounded border border-white/10">
            <span className="text-base font-bold text-red-300">
              {assignedTasks.filter((t) => t.severity === 'Critical' && t.status !== 'Resolved').length}
            </span>
            <span className="text-[9px] text-white/70 block uppercase tracking-wider font-medium">Critical</span>
          </div>
          <div className="bg-white/10 p-2 rounded border border-white/10">
            <span className="text-base font-bold text-emerald-300">
              {assignedTasks.filter((t) => t.status === 'Resolved').length}
            </span>
            <span className="text-[9px] text-white/70 block uppercase tracking-wider font-medium">Resolved</span>
          </div>
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex bg-gray-200/80 p-0.5 rounded border border-gray-300 overflow-x-auto">
        <button
          onClick={(e) => {
            createRipple(e);
            setActiveFilter('all');
          }}
          className={`flex-1 py-1.5 px-2 rounded text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap ripple-surface min-h-touch ${
            activeFilter === 'all'
              ? 'bg-white text-mat-text-primary shadow-elevation-1'
              : 'text-mat-text-secondary hover:text-mat-text-primary'
          }`}
        >
          All Tasks ({assignedTasks.length})
        </button>
        <button
          onClick={(e) => {
            createRipple(e);
            setActiveFilter('in_progress');
          }}
          className={`flex-1 py-1.5 px-2 rounded text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap ripple-surface min-h-touch ${
            activeFilter === 'in_progress'
              ? 'bg-white text-mat-text-primary shadow-elevation-1'
              : 'text-mat-text-secondary hover:text-mat-text-primary'
          }`}
        >
          In Progress ({assignedTasks.filter((t) => t.status === 'In Progress').length})
        </button>
        <button
          onClick={(e) => {
            createRipple(e);
            setActiveFilter('resolved');
          }}
          className={`flex-1 py-1.5 px-2 rounded text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap ripple-surface min-h-touch ${
            activeFilter === 'resolved'
              ? 'bg-white text-mat-text-primary shadow-elevation-1'
              : 'text-mat-text-secondary hover:text-mat-text-primary'
          }`}
        >
          Resolved ({assignedTasks.filter((t) => t.status === 'Resolved').length})
        </button>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full bg-white rounded p-12 text-center border border-gray-200 shadow-elevation-1">
            <CheckCircle2 className="w-12 h-12 mx-auto text-mat-secondary mb-2" />
            <h4 className="text-sm font-medium text-mat-text-primary tracking-wide">All caught up!</h4>
            <p className="text-xs text-mat-text-secondary mt-1">No tasks under this filter.</p>
          </div>
        ) : (
          filteredTasks.map((task, idx) => {
            const isResolved = task.status === 'Resolved';
            const isInProgress = task.status === 'In Progress';

            return (
              <div
                key={task.id}
                className="bg-white rounded p-4 border border-gray-200 shadow-elevation-1 hover:shadow-elevation-2 transition-all space-y-3"
              >
                {/* Header: Priority & Distance & Ticket */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono font-medium bg-gray-100 text-mat-text-primary px-2 py-0.5 rounded">
                      #{task.ticketNumber}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(
                        task.severity
                      )}`}
                    >
                      {task.severity} Priority
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-mat-text-secondary flex items-center">
                    <Navigation className="w-3 h-3 mr-0.5 text-mat-secondary" />
                    ~{(idx * 0.4 + 0.3).toFixed(1)} km away
                  </span>
                </div>

                {/* Content: Photo + Title + Address */}
                <div
                  className="flex space-x-3 cursor-pointer"
                  onClick={() => setSelectedIssueForDetail(task)}
                >
                  <img
                    src={isResolved && task.afterPhotoUrl ? task.afterPhotoUrl : task.photoUrl}
                    alt={task.title}
                    className="w-20 h-20 rounded object-cover border border-gray-200 flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallback = getAssetUrl('issues/garbage.jpg');
                      if (target.src !== fallback) target.src = fallback;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-medium text-mat-secondary uppercase tracking-wider block">
                      {t.categories[task.category]}
                    </span>
                    <h4 className="text-xs font-medium text-mat-text-primary line-clamp-2 leading-snug mt-0.5">
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-mat-text-secondary flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 text-mat-secondary mr-1 flex-shrink-0" />
                      <span className="truncate">{task.location.address}</span>
                    </p>
                  </div>
                </div>

                {/* Citizen Voice Note (If available) */}
                {task.voiceNoteTranscription && (
                  <div className="bg-amber-50/70 p-2.5 rounded border border-amber-200 text-xs flex items-start space-x-2">
                    <Volume2 className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-medium text-amber-800 uppercase tracking-wider block">
                        Citizen Voice Note Transcript
                      </span>
                      <p className="text-[11px] text-mat-text-primary italic">
                        "{task.voiceNoteTranscription}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Status Update Actions (Start -> Complete) */}
                <div className="pt-2 border-t border-gray-100 flex items-center space-x-2">
                  {!isResolved && !isInProgress && (
                    <button
                      type="button"
                      onClick={(e) => {
                        createRipple(e);
                        updateIssueStatus(
                          task.id,
                          'In Progress',
                          `Field Officer ${currentWorker.name} has arrived at the location and commenced work.`
                        );
                      }}
                      className="flex-1 py-2.5 bg-mat-low hover:bg-blue-800 text-white rounded text-xs font-medium uppercase tracking-wider shadow-elevation-1 transition-all flex items-center justify-center space-x-1.5 min-h-touch ripple-surface"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{t.startWork}</span>
                    </button>
                  )}

                  {isInProgress && (
                    <button
                      type="button"
                      onClick={(e) => {
                        createRipple(e);
                        setSelectedIssueForResolve(task);
                      }}
                      className="flex-1 py-2.5 bg-mat-secondary hover:bg-emerald-800 text-white rounded text-xs font-medium uppercase tracking-wider shadow-elevation-2 transition-all flex items-center justify-center space-x-1.5 min-h-touch ripple-surface"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.markResolved}</span>
                    </button>
                  )}

                  {isResolved && (
                    <div className="flex-1 py-2 bg-emerald-50 text-mat-secondary rounded text-xs font-medium uppercase tracking-wider border border-emerald-200 text-center flex items-center justify-center space-x-1">
                      <Check className="w-4 h-4 text-mat-secondary stroke-[3]" />
                      <span>Completed & Verified</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      createRipple(e);
                      setSelectedIssueForDetail(task);
                    }}
                    className="px-3 py-2 bg-white hover:bg-gray-100 text-mat-text-secondary hover:text-mat-text-primary border border-gray-300 rounded text-xs font-medium uppercase tracking-wider transition-colors min-h-touch ripple-surface"
                    aria-label="View task details"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolve Task Proof Modal */}
      {selectedIssueForResolve && (
        <ResolveTaskModal
          issue={selectedIssueForResolve}
          onClose={() => setSelectedIssueForResolve(null)}
        />
      )}

      {/* Task Detail Modal */}
      {selectedIssueForDetail && (
        <IssueTrackerModal
          issue={selectedIssueForDetail}
          onClose={() => setSelectedIssueForDetail(null)}
        />
      )}
    </div>
  );
};
