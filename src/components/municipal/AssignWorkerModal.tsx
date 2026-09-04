import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import { HardHat, Clock, X, Star, Send } from 'lucide-react';

interface AssignWorkerModalProps {
  issue: CivicIssue | null;
  onClose: () => void;
}

export const AssignWorkerModal: React.FC<AssignWorkerModalProps> = ({ issue, onClose }) => {
  const { fieldWorkers, assignWorker, t } = useApp();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(fieldWorkers[0]?.id || '');
  const [targetHours, setTargetHours] = useState<number>(
    issue?.severity === 'Critical' ? 4 : issue?.severity === 'High' ? 12 : 24
  );
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  if (!issue) return null;

  const handleAssign = () => {
    if (!selectedWorkerId) return;
    assignWorker(issue.id, selectedWorkerId, targetHours, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-navy-950 text-white p-4 sm:p-5 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">{t.assign}</h3>
              <p className="text-xs text-slate-400">Route issue to on-ground field squad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close assignment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Issue Summary Card */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center space-x-3">
            <img
              src={issue.photoUrl}
              alt={issue.title}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono text-slate-500 block">
                #{issue.ticketNumber} • {issue.category}
              </span>
              <h4 className="text-xs font-bold text-slate-900 truncate">{issue.title}</h4>
              <p className="text-[11px] text-slate-500 truncate">{issue.location.address}</p>
            </div>
          </div>

          {/* Select Field Worker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              Select Field Officer / Worker:
            </label>

            <div className="space-y-2">
              {fieldWorkers.map((worker) => {
                const isSelected = selectedWorkerId === worker.id;
                return (
                  <button
                    key={worker.id}
                    type="button"
                    onClick={() => setSelectedWorkerId(worker.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all min-h-touch ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-400/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h5 className="text-xs font-bold text-slate-900 truncate">{worker.name}</h5>
                          <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {worker.rating}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {worker.role} • {worker.department}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 pl-2">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full block">
                        {worker.activeTasksCount} active tasks
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target SLA */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 block flex items-center">
              <Clock className="w-3.5 h-3.5 text-slate-500 mr-1" />
              Target Resolution SLA:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 12, 24].map((hrs) => {
                const isSelected = targetHours === hrs;
                return (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setTargetHours(hrs)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center min-h-touch ${
                      isSelected
                        ? 'bg-navy-900 text-white border-navy-950 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {hrs} Hours
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 block">
              Instructions for Worker:
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Carry cold asphalt mix + traffic cones. Verify pedestrian walkway..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors min-h-touch"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleAssign}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5 min-h-touch"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch & Notify Worker</span>
          </button>
        </div>
      </div>
    </div>
  );
};
