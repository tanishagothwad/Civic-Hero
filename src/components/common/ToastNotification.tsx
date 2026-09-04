import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, CheckCircle2, Award } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const isXP = toast.type === 'xp';
        const isBadge = toast.type === 'badge';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transform transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              isXP
                ? 'bg-amber-950/90 text-amber-50 border-amber-500/50 shadow-amber-500/10'
                : isBadge
                ? 'bg-emerald-950/90 text-emerald-50 border-emerald-500/50 shadow-emerald-500/10'
                : 'bg-navy-950/90 text-white border-navy-700 shadow-slate-900/20'
            }`}
            role="alert"
          >
            {/* Icon */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isXP
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : isBadge
                  ? 'bg-emerald-500 text-white font-black'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {isXP ? (
                <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2.5]" />
              ) : isBadge ? (
                <Award className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold leading-tight truncate">{toast.title}</h4>
                {toast.xp && (
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                    +{toast.xp} XP
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-200 mt-0.5 line-clamp-2 leading-relaxed">
                {toast.message}
              </p>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
