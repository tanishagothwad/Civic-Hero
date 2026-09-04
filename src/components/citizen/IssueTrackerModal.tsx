import React from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  ThumbsUp,
  X,
  HardHat,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface IssueTrackerModalProps {
  issue: CivicIssue | null;
  onClose: () => void;
}

export const IssueTrackerModal: React.FC<IssueTrackerModalProps> = ({ issue, onClose }) => {
  const { upvoteReport, t } = useApp();

  if (!issue) return null;

  const statuses = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved'] as const;
  const currentStatusIndex = statuses.indexOf(issue.status);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-navy-950 text-white p-4 sm:p-5 flex items-start justify-between flex-shrink-0">
          <div className="min-w-0 pr-2">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold bg-navy-800 text-emerald-400 px-2 py-0.5 rounded border border-navy-700">
                #{issue.ticketNumber}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSeverityBadge(
                  issue.severity
                )}`}
              >
                {t.severities[issue.severity]}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-1.5 leading-snug">
              {issue.title}
            </h3>
            <p className="text-xs text-slate-300 flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-1 flex-shrink-0" />
              <span className="truncate">{issue.location.address}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Close tracking details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Stepper */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3.5 flex-shrink-0">
          <div className="flex items-center justify-between relative">
            {/* Background connecting bar */}
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
            
            {/* Active connecting bar */}
            <div
              className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-0"
              style={{
                width: `${(Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 92}%`,
              }}
            />

            {statuses.map((step, idx) => {
              const isCompleted = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : 'bg-white text-slate-400 border-2 border-slate-300'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${
                      isCurrent
                        ? 'text-emerald-700 font-black'
                        : isCompleted
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {t.statuses[step]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Before & After Photos (If Resolved) */}
          {issue.status === 'Resolved' && issue.afterPhotoUrl ? (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Resolution Verification (Before & After)</span>
                </div>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                  Verified Cleaned
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Before Photo */}
                <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-video">
                  <img
                    src={issue.photoUrl}
                    alt="Before resolution"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {t.beforePhoto}
                  </span>
                </div>

                {/* After Photo */}
                <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500 shadow-sm aspect-video">
                  <img
                    src={issue.afterPhotoUrl}
                    alt="After resolution"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    {t.afterPhoto}
                  </span>
                </div>
              </div>

              {issue.resolutionRemarks && (
                <div className="mt-2.5 bg-white p-2.5 rounded-xl border border-emerald-100 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">{t.workerRemarks}:</span>
                  <p className="italic text-[11px]">{issue.resolutionRemarks}</p>
                </div>
              )}
            </div>
          ) : (
            /* Single Before Photo */
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-900">
              <img
                src={issue.photoUrl}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                Report Photo • {issue.createdAt}
              </span>
            </div>
          )}

          {/* Description & Voice Transcription */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900">{t.describeIssue}</h4>
            <p className="text-xs text-slate-700 leading-relaxed">{issue.description}</p>

            {issue.voiceNoteTranscription && (
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-start space-x-2">
                <Volume2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">
                    Voice Note Audio Transcript
                  </span>
                  <p className="text-[11px] text-slate-700 italic">
                    "{issue.voiceNoteTranscription}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Assigned Worker Info (If available) */}
          {issue.assignedWorkerName && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-800 tracking-wider">
                    {t.assignedWorker}
                  </span>
                  <h5 className="text-xs font-bold text-slate-900">{issue.assignedWorkerName}</h5>
                  <p className="text-[10px] text-slate-500">Target SLA: ~{issue.targetResolutionHours || 4} hours</p>
                </div>
              </div>

              <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded-lg">
                On Field
              </span>
            </div>
          )}

          {/* Timeline of Events */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center">
              <Clock className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
              {t.timeline}
            </h4>

            <div className="space-y-2 divide-y divide-slate-100 border border-slate-200 rounded-2xl p-3 bg-white">
              {issue.timeline.map((evt) => (
                <div key={evt.id} className="pt-2 first:pt-0 flex items-start space-x-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                      <span className="text-[10px] text-slate-400">{evt.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{evt.description}</p>
                    <span className="text-[9px] text-slate-400 block mt-0.5">By {evt.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions: Upvote / Boost & Close */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => upvoteReport(issue.id)}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl font-bold text-xs transition-all min-h-touch ${
              issue.hasUpvoted
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100'
            }`}
            aria-label={`Upvote issue. Currently ${issue.upvotes} votes`}
          >
            <ThumbsUp className={`w-4 h-4 ${issue.hasUpvoted ? 'fill-white' : ''}`} />
            <span>
              {issue.hasUpvoted ? t.upvoted : t.upvote} ({issue.upvotes})
            </span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors min-h-touch"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
