import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueCategory, IssueSeverity } from '../../types';
import { samplePresetImages } from '../../data/mockData';
import { simulateAIDetection, findNearbyDuplicate } from '../../utils/aiSimulation';
import { VoiceInputButton } from '../common/VoiceInputButton';
import {
  Camera,
  Upload,
  Sparkles,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Volume2,
} from 'lucide-react';

interface ReportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (issueId: string) => void;
}

export const ReportWizard: React.FC<ReportWizardProps> = ({ isOpen, onClose, onSubmitted }) => {
  const { createReport, mergeReport, issues, t } = useApp();

  // Wizard Steps: 1: Capture, 2: Auto-Detect, 3: Confirm & Submit
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedPhoto, setSelectedPhoto] = useState<string>(samplePresetImages[0].url);
  const [photoHint, setPhotoHint] = useState<string>(samplePresetImages[0].label);
  const [description, setDescription] = useState<string>('');
  const [voiceTranscription, setVoiceTranscription] = useState<string>('');
  
  // AI & Detection State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detectedCategory, setDetectedCategory] = useState<IssueCategory>('Pothole');
  const [detectedSeverity, setDetectedSeverity] = useState<IssueSeverity>('High');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [aiConfidence, setAiConfidence] = useState<number>(94);
  const [aiTags, setAiTags] = useState<string[]>([]);
  
  // Location State
  const [location] = useState({
    address: '100 Feet Rd, near 12th Main Junction, Indiranagar',
    ward: 'Ward 4 - Indiranagar',
    city: 'Bengaluru',
    lat: 12.9784,
    lng: 77.6408,
  });

  // Duplicate Match
  const [nearbyDuplicate, setNearbyDuplicate] = useState<{
    duplicate: (typeof issues)[0];
    distanceMeters: number;
  } | null>(null);

  const categories: IssueCategory[] = [
    'Garbage',
    'Pothole',
    'Water Leak',
    'Streetlight',
    'Road Damage',
    'Drain',
    'Other',
  ];

  const severities: IssueSeverity[] = ['Low', 'Medium', 'High', 'Critical'];

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedPhoto(url);
      setPhotoHint(file.name);
    }
  };

  // Run AI Analysis when moving to Step 2
  const runAiDetection = () => {
    setIsAnalyzing(true);
    setCurrentStep(2);

    setTimeout(() => {
      const res = simulateAIDetection(
        `${description} ${voiceTranscription} ${photoHint}`,
        photoHint
      );
      setDetectedCategory(res.category);
      setDetectedSeverity(res.severity);
      setAiSummary(res.summary);
      setAiConfidence(Math.round(res.confidence * 100));
      setAiTags(res.tags);
      setIsAnalyzing(false);

      // Check for nearby duplicates
      const dup = findNearbyDuplicate(res.category, location.lat, location.lng, issues);
      setNearbyDuplicate(dup);
    }, 900);
  };

  // Move to Final Step
  const goToFinalStep = () => {
    // Re-check duplicate with user-adjusted category
    const dup = findNearbyDuplicate(detectedCategory, location.lat, location.lng, issues);
    setNearbyDuplicate(dup);
    setCurrentStep(3);
  };

  // One-Tap Submit New
  const handleSubmitNew = () => {
    const newIssue = createReport({
      title: `${detectedCategory} hazard at ${location.address.split(',')[0]}`,
      category: detectedCategory,
      severity: detectedSeverity,
      description:
        description ||
        voiceTranscription ||
        `Reported ${detectedCategory} issue via Civic Hero citizen mobile app.`,
      photoUrl: selectedPhoto,
      voiceNoteTranscription: voiceTranscription || undefined,
      location,
    });

    onSubmitted(newIssue.id);
    onClose();
  };

  // One-Tap Merge
  const handleMerge = () => {
    if (nearbyDuplicate) {
      mergeReport(nearbyDuplicate.duplicate.id);
      onSubmitted(nearbyDuplicate.duplicate.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Wizard Header */}
        <div className="bg-navy-950 text-white p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              {currentStep}/3
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold">{t.reportIssue}</h3>
              <p className="text-[11px] text-slate-400">
                {currentStep === 1
                  ? t.captureStep
                  : currentStep === 2
                  ? t.autoDetectStep
                  : t.confirmStep}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close report wizard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-slate-100 h-1.5 w-full flex-shrink-0">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* STEP 1: CAPTURE */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Photo Preview & Capture Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  1. {t.takePhoto}
                </label>

                <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50 aspect-video flex items-center justify-center group shadow-inner">
                  {selectedPhoto ? (
                    <>
                      <img
                        src={selectedPhoto}
                        alt="Selected issue"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <label className="bg-white text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer shadow">
                          Change Photo
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
                      <Camera className="w-8 h-8 mx-auto text-slate-400 mb-1" />
                      <p className="text-xs text-slate-500">Tap to take photo or upload</p>
                    </div>
                  )}
                </div>

                {/* Upload or Camera Button */}
                <div className="flex items-center space-x-2">
                  <label className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-navy-800 transition-colors shadow min-h-touch">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>{t.takePhoto}</span>
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
                    <span>{t.uploadPhoto}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Quick Presets for Instant Demo */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                    {t.usePresetPhoto}
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {samplePresetImages.map((sample) => {
                      const isSelected = selectedPhoto === sample.url;
                      return (
                        <button
                          key={sample.id}
                          type="button"
                          onClick={() => {
                            setSelectedPhoto(sample.url);
                            setPhotoHint(sample.label);
                            setDescription(sample.description);
                          }}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all p-0.5 ${
                            isSelected
                              ? 'border-emerald-500 ring-2 ring-emerald-400/50 scale-105 shadow-md'
                              : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={sample.url}
                            alt={sample.label}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-bold text-white text-center py-0.5 truncate px-0.5">
                            {sample.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Voice Note & Text Description */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    2. {t.describeIssue}
                  </label>
                  <VoiceInputButton
                    onTranscript={(txt) => {
                      setVoiceTranscription(txt);
                      setDescription((prev) => (prev ? `${prev} ${txt}` : txt));
                    }}
                    buttonText={t.voiceToText}
                  />
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t.describePlaceholder}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                  />
                </div>

                {voiceTranscription && (
                  <div className="bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-200 text-xs flex items-start space-x-2">
                    <Volume2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[10px] uppercase text-emerald-800 block">
                        Voice-to-Text Captured:
                      </span>
                      <p className="italic text-[11px]">"{voiceTranscription}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: AUTO-DETECT */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {isAnalyzing ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto animate-spin">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.aiAnalyzing}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Identifying damage type, priority severity, and GPS ward boundary...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* AI Detection Banner */}
                  <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-3.5 rounded-2xl border border-emerald-700 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span className="text-xs font-extrabold text-amber-300">
                          AI Auto-Detection ({aiConfidence}% Match)
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded-full border border-emerald-600">
                        Editable
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-100 mt-1.5 leading-relaxed">
                      {aiSummary}
                    </p>

                    {aiTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {aiTags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-white/10 text-[10px] font-medium px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Editable Chips */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      {t.aiSuggestedCategory} (Tap to adjust):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => {
                        const isSelected = detectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setDetectedCategory(cat)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-touch ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            {t.categories[cat]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Severity Editable Chips */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      {t.aiSuggestedSeverity} (Tap to adjust):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {severities.map((sev) => {
                        const isSelected = detectedSeverity === sev;
                        return (
                          <button
                            key={sev}
                            type="button"
                            onClick={() => setDetectedSeverity(sev)}
                            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center min-h-touch ${
                              isSelected
                                ? sev === 'Critical'
                                  ? 'bg-red-600 text-white ring-2 ring-red-400'
                                  : sev === 'High'
                                  ? 'bg-orange-600 text-white ring-2 ring-orange-400'
                                  : sev === 'Medium'
                                  ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                                  : 'bg-blue-600 text-white ring-2 ring-blue-400'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            {t.severities[sev]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Location & GPS Info */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>{t.gpsCaptured}</span>
                    </div>
                    <p className="text-xs text-slate-700">{location.address}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>{location.ward}</span>
                      <span className="font-mono text-[10px]">
                        GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 3: CONFIRM & DUPLICATE CHECK */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Duplicate Detected Alert (If nearby match found) */}
              {nearbyDuplicate ? (
                <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 space-y-3 shadow-md">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 font-bold shadow">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-amber-900">
                        {t.duplicateTitle}
                      </h4>
                      <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                        Someone reported a matching <strong>{detectedCategory}</strong> issue{' '}
                        <strong>{nearbyDuplicate.distanceMeters} meters away</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Duplicate Issue Card */}
                  <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center space-x-3">
                    <img
                      src={nearbyDuplicate.duplicate.photoUrl}
                      alt="Duplicate issue"
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono text-slate-500 block">
                        #{nearbyDuplicate.duplicate.ticketNumber}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 truncate">
                        {nearbyDuplicate.duplicate.title}
                      </h5>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        Status: {nearbyDuplicate.duplicate.status} • {nearbyDuplicate.duplicate.upvotes} upvotes
                      </span>
                    </div>
                  </div>

                  {/* Duplicate Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={handleMerge}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 min-h-touch"
                    >
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      <span>{t.mergeReport}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitNew}
                      className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors min-h-touch"
                    >
                      {t.submitNew}
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Confirmation Summary */
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedPhoto}
                        alt="Report preview"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-300 flex-shrink-0"
                      />
                      <div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          {t.categories[detectedCategory]}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">
                          {detectedCategory} issue near {location.address.split(',')[0]}
                        </h4>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Priority: {t.severities[detectedSeverity]}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-2 text-xs text-slate-600">
                      <p>{description || 'No additional remarks provided.'}</p>
                    </div>

                    <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                        {location.ward}
                      </span>
                      <span className="text-emerald-600 font-bold">+25 XP for submission</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitNew}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 min-h-touch active:scale-98"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{t.submitReport}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation (Step 1 & 2) */}
        {currentStep < 3 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-4 py-2 bg-white text-slate-700 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 transition-colors flex items-center space-x-1 min-h-touch"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t.back}</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={currentStep === 1 ? runAiDetection : goToFinalStep}
              className="px-6 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow min-h-touch"
            >
              <span>{currentStep === 1 ? t.next : t.confirmStep}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
