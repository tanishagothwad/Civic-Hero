import React from 'react';
import { useApp } from '../../context/AppContext';
import { languageList } from '../../i18n/translations';
import { Globe, Check, X } from 'lucide-react';

interface LanguagePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-navy-950 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Select Language / भाषा चुनें</h3>
              <p className="text-xs text-slate-400">Choose your preferred Indian language</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-navy-800 transition-colors"
            aria-label="Close language selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Languages */}
        <div className="p-4 grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
          {languageList.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => {
                  setLanguage(item.code);
                  onClose();
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all min-h-[52px] ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-400/40'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-medium'
                }`}
                aria-label={`Select ${item.name}`}
              >
                <div>
                  <span className="text-base font-bold block">{item.nativeName}</span>
                  <span className="text-xs text-slate-500">{item.name}</span>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Voice-to-text and UI labels automatically adapt to your chosen language.
          </p>
        </div>
      </div>
    </div>
  );
};
