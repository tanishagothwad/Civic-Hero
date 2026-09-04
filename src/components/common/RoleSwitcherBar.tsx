import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Shield, LayoutDashboard, HardHat, Smartphone, Globe, Sparkles } from 'lucide-react';
import { languageList } from '../../i18n/translations';

export const RoleSwitcherBar: React.FC<{ onOpenLanguage: () => void }> = ({ onOpenLanguage }) => {
  const { role, setRole, language, showDeviceFrame, setShowDeviceFrame, t } = useApp();

  const roles: { key: UserRole; label: string; icon: React.ReactNode; badge: string }[] = [
    {
      key: 'citizen',
      label: t.citizenRole,
      icon: <Smartphone className="w-4 h-4" />,
      badge: 'Mobile-First',
    },
    {
      key: 'municipal',
      label: t.municipalRole,
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: 'Desktop HQ',
    },
    {
      key: 'worker',
      label: t.workerRole,
      icon: <HardHat className="w-4 h-4" />,
      badge: 'Field Ops',
    },
  ];

  const currentLangObj = languageList.find((l) => l.code === language);

  return (
    <header className="bg-navy-950 text-white border-b border-navy-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">{t.appName}</span>
              <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> AI Powered
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Persona Switcher Tabs */}
        <div className="flex items-center bg-navy-900 p-1 rounded-xl border border-navy-800 overflow-x-auto max-w-full">
          {roles.map((r) => {
            const isActive = role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800'
                }`}
                aria-label={`Switch view mode to ${r.label}`}
              >
                {r.icon}
                <span>{r.label}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-normal hidden md:inline ${
                    isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-navy-950 text-slate-400'
                  }`}
                >
                  {r.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls: Frame toggle + Language toggle */}
        <div className="flex items-center space-x-2">
          {/* Frame Toggle (Only for mobile personas) */}
          {role !== 'municipal' && (
            <button
              onClick={() => setShowDeviceFrame(!showDeviceFrame)}
              className={`hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                showDeviceFrame
                  ? 'bg-navy-800 text-emerald-400 border-emerald-500/40'
                  : 'bg-navy-900 text-slate-400 border-navy-700 hover:text-white'
              }`}
              title="Toggle mobile device frame container"
              aria-label="Toggle mobile device frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{showDeviceFrame ? 'Frame: ON' : 'Frame: OFF'}</span>
            </button>
          )}

          {/* Language Selector Button */}
          <button
            onClick={onOpenLanguage}
            className="flex items-center space-x-1.5 bg-navy-900 hover:bg-navy-800 text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-navy-700 text-xs font-medium transition-colors"
            aria-label="Select Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">{currentLangObj?.nativeName || 'Language'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
