import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import { ResolveTaskModal } from './ResolveTaskModal';
import { IssueTrackerModal } from '../citizen/IssueTrackerModal';
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
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-10 space-y-4 px-3 sm:px-4 pt-3 bg-slate-100 min-h-screen">
      {/* Field Officer Profile Header Card */}
      <div className="bg-navy-950 text-white p-4 rounded-3xl shadow-xl border border-navy-800 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={currentWorker.avatar}
                alt={currentWorker.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-navy-950" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-white">{currentWorker.name}</h3>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-slate-950" />
                  {currentWorker.rating}
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold">{currentWorker.role}</p>
              <p className="text-[10px] text-slate-400">{currentWorker.ward}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400 block">Duty Status</span>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Active Shift
            </span>
          </div>
        </div>

        {/* Task Counter Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-navy-800 text-center">
          <div className="bg-navy-900/90 p-2 rounded-xl border border-navy-800">
            <span className="text-base font-black text-amber-400">
              {assignedTasks.filter((t) => t.status === 'In Progress').length}
            </span>
            <span className="text-[9px] text-slate-400 block uppercase font-bold">In Progress</span>
          </div>
          <div className="bg-navy-900/90 p-2 rounded-xl border border-navy-800">
            <span className="text-base font-black text-red-400">
              {assignedTasks.filter((t) => t.severity === 'Critical' && t.status !== 'Resolved').length}
            </span>
            <span className="text-[9px] text-slate-400 block uppercase font-bold">Critical</span>
          </div>
          <div className="bg-navy-900/90 p-2 rounded-xl border border-navy-800">
            <span className="text-base font-black text-emerald-400">
              {assignedTasks.filter((t) => t.status === 'Resolved').length}
            </span>
            <span className="text-[9px] text-slate-400 block uppercase font-bold">Resolved</span>
          </div>
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-touch ${
            activeFilter === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Tasks ({assignedTasks.length})
        </button>
        <button
          onClick={() => setActiveFilter('in_progress')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-touch ${
            activeFilter === 'in_progress'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          In Progress ({assignedTasks.filter((t) => t.status === 'In Progress').length})
        </button>
        <button
          onClick={() => setActiveFilter('resolved')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-touch ${
            activeFilter === 'resolved'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Resolved ({assignedTasks.filter((t) => t.status === 'Resolved').length})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <h4 className="text-xs font-bold text-slate-800">All caught up!</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">No tasks under this filter.</p>
          </div>
        ) : (
          filteredTasks.map((task, idx) => {
            const isResolved = task.status === 'Resolved';
            const isInProgress = task.status === 'In Progress';

            return (
              <div
                key={task.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3"
              >
                {/* Header: Priority & Distance & Ticket */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      #{task.ticketNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSeverityBadge(
                        task.severity
                      )}`}
                    >
                      {task.severity} Priority
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 flex items-center">
                    <Navigation className="w-3 h-3 mr-0.5 text-emerald-600" />
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
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      {t.categories[task.category]}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mt-0.5">
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center mt-1">
                      <MapPin className="w-3 h-3 text-emerald-600 mr-1 flex-shrink-0" />
                      <span className="truncate">{task.location.address}</span>
                    </p>
                  </div>
                </div>

                {/* Citizen Voice Note (If available) */}
                {task.voiceNoteTranscription && (
                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-xs flex items-start space-x-2">
                    <Volume2 className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-bold text-amber-800 uppercase block">
                        Citizen Voice Note Transcript
                      </span>
                      <p className="text-[11px] text-slate-700 italic">
                        "{task.voiceNoteTranscription}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Status Update Actions (Start -> Complete) */}
                <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                  {!isResolved && !isInProgress && (
                    <button
                      type="button"
                      onClick={() =>
                        updateIssueStatus(
                          task.id,
                          'In Progress',
                          `Field Officer ${currentWorker.name} has arrived at the location and commenced work.`
                        )
                      }
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1.5 min-h-touch"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{t.startWork}</span>
                    </button>
                  )}

                  {isInProgress && (
                    <button
                      type="button"
                      onClick={() => setSelectedIssueForResolve(task)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5 min-h-touch active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.markResolved} (Upload Proof)</span>
                    </button>
                  )}

                  {isResolved && (
                    <div className="flex-1 py-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 text-center flex items-center justify-center space-x-1">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>Completed & Verified</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedIssueForDetail(task)}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors min-h-touch"
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
