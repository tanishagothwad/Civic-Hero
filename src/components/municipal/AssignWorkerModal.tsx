import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import { createRipple } from '../common/MaterialRipple';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded shadow-elevation-8 w-full max-w-lg overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-mat-primary text-white p-4 sm:p-5 flex items-start justify-between flex-shrink-0 border-b border-mat-primary-dark">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-medium border border-emerald-400/30">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-medium text-white tracking-wide">{t.assign}</h3>
              <p className="text-xs text-white/70">Route issue to on-ground field squad</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              createRipple(e);
              onClose();
            }}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors ripple-surface"
            aria-label="Close assignment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Issue Summary Card */}
          <div className="bg-[#FAFAFA] p-3 rounded border border-gray-200 flex items-center space-x-3">
            <img
              src={issue.photoUrl}
              alt={issue.title}
              className="w-14 h-14 rounded object-cover flex-shrink-0 border border-gray-200"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono text-mat-text-secondary block">
                #{issue.ticketNumber} • {issue.category}
              </span>
              <h4 className="text-xs font-medium text-mat-text-primary truncate">{issue.title}</h4>
              <p className="text-[11px] text-mat-text-secondary truncate">{issue.location.address}</p>
            </div>
          </div>

          {/* Select Field Worker */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-mat-text-primary block uppercase tracking-wider">
              Select Field Officer / Worker:
            </label>

            <div className="space-y-2">
              {fieldWorkers.map((worker) => {
                const isSelected = selectedWorkerId === worker.id;
                return (
                  <button
                    key={worker.id}
                    type="button"
                    onClick={(e) => {
                      createRipple(e);
                      setSelectedWorkerId(worker.id);
                    }}
                    className={`w-full p-3 rounded border text-left flex items-center justify-between transition-all ripple-surface min-h-touch ${
                      isSelected
                        ? 'border-mat-secondary bg-emerald-50/60 ring-1 ring-mat-secondary shadow-elevation-1'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h5 className="text-xs font-medium text-mat-text-primary truncate">{worker.name}</h5>
                          <span className="text-[10px] text-amber-700 font-medium flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {worker.rating}
                          </span>
                        </div>
                        <p className="text-[10px] text-mat-text-secondary truncate">
                          {worker.role} • {worker.department}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 pl-2">
                      <span className="text-[10px] font-medium bg-gray-100 text-mat-text-secondary px-2 py-0.5 rounded block uppercase tracking-wide">
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
            <label className="text-xs font-medium text-mat-text-primary block flex items-center uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-mat-text-secondary mr-1" />
              Target Resolution SLA:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 12, 24].map((hrs) => {
                const isSelected = targetHours === hrs;
                return (
                  <button
                    key={hrs}
                    type="button"
                    onClick={(e) => {
                      createRipple(e);
                      setTargetHours(hrs);
                    }}
                    className={`py-2 px-2 rounded text-xs font-medium border transition-all text-center uppercase tracking-wider ripple-surface min-h-touch ${
                      isSelected
                        ? 'bg-mat-primary text-white border-mat-primary shadow-elevation-1'
                        : 'bg-white text-mat-text-primary border-gray-300 hover:bg-gray-50'
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
            <label className="text-xs font-medium text-mat-text-primary block uppercase tracking-wider">
              Instructions for Worker:
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Carry cold asphalt mix + traffic cones. Verify pedestrian walkway..."
              className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs text-mat-text-primary placeholder:text-gray-400 focus:outline-none focus:border-mat-secondary focus:ring-1 focus:ring-mat-secondary transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAFAFA] border-t border-gray-200 flex items-center justify-end space-x-2 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              createRipple(e);
              onClose();
            }}
            className="px-4 py-2 text-mat-text-secondary hover:bg-gray-100 rounded text-xs font-medium uppercase tracking-wider transition-colors ripple-surface min-h-touch"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={(e) => {
              createRipple(e);
              handleAssign();
            }}
            className="px-5 py-2.5 bg-mat-secondary hover:bg-emerald-800 text-white rounded text-xs font-medium uppercase tracking-wider shadow-elevation-2 transition-all flex items-center space-x-1.5 ripple-surface min-h-touch"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch & Notify Worker</span>
          </button>
        </div>
      </div>
    </div>
  );
};
