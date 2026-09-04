import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import { Camera, Upload, CheckCircle2, X } from 'lucide-react';

interface ResolveTaskModalProps {
  issue: CivicIssue | null;
  onClose: () => void;
}

export const ResolveTaskModal: React.FC<ResolveTaskModalProps> = ({ issue, onClose }) => {
  const { resolveIssueWithProof, t } = useApp();

  // Default sample clean photo
  const sampleCleanPhotos: Record<string, string> = {
    Garbage:
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80',
    Pothole:
      'https://images.unsplash.com/photo-1578873375972-03d3c87dc5b4?auto=format&fit=crop&w=800&q=80',
    'Water Leak':
      'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    Streetlight:
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    Drain:
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80',
    'Road Damage':
      'https://images.unsplash.com/photo-1578873375972-03d3c87dc5b4?auto=format&fit=crop&w=800&q=80',
  };

  const defaultPhoto =
    (issue && sampleCleanPhotos[issue.category]) ||
    'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80';

  const [afterPhoto, setAfterPhoto] = useState<string>(defaultPhoto);
  const [remarks, setRemarks] = useState<string>(
    'Work completed successfully on site. Area inspected and verified safe for public.'
  );

  if (!issue) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAfterPhoto(url);
    }
  };

  const handleSubmitResolution = () => {
    if (!afterPhoto) return;
    resolveIssueWithProof(issue.id, afterPhoto, remarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-navy-950 text-white p-4 sm:p-5 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">{t.markResolved}</h3>
              <p className="text-xs text-slate-400">Mandatory proof photo upload required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close resolve modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Before Photo for Reference */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">Original Issue (Before):</span>
            <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
              <img
                src={issue.photoUrl}
                alt="Before"
                className="w-16 h-16 rounded-xl object-cover border border-slate-300 flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-slate-500 block">
                  #{issue.ticketNumber} • {issue.category}
                </span>
                <h5 className="text-xs font-bold text-slate-900 truncate">{issue.title}</h5>
                <p className="text-[10px] text-slate-500 truncate">{issue.location.address}</p>
              </div>
            </div>
          </div>

          {/* Mandatory "After" Photo Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 block">
                {t.uploadProof} <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Required for Closure
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-emerald-500/50 bg-emerald-50/30 aspect-video flex items-center justify-center group shadow-inner">
              {afterPhoto ? (
                <>
                  <img
                    src={afterPhoto}
                    alt="Resolution After Proof"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <label className="bg-white text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer shadow">
                      Retake Proof Photo
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <Camera className="w-8 h-8 mx-auto text-emerald-600 mb-1" />
                  <p className="text-xs text-slate-600">Take after photo of resolved area</p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-2">
              <label className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow min-h-touch">
                <Camera className="w-4 h-4" />
                <span>Take After Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <label className="flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer border border-slate-300 transition-colors min-h-touch">
                <Upload className="w-4 h-4 text-slate-600" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 block">
              Field Officer Resolution Remarks:
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Describe repairs carried out on site..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
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
            onClick={handleSubmitResolution}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5 min-h-touch"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete & Award Citizen XP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
