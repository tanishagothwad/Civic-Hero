import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { showDeviceFrame } = useApp();

  if (!showDeviceFrame) {
    return <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="py-4 md:py-8 flex justify-center items-center bg-slate-900/10 min-h-[calc(100vh-57px)]">
      {/* Smartphone Frame */}
      <div className="w-full max-w-[420px] bg-slate-950 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-800/80 transition-all">
        {/* Device Outer Rim */}
        <div className="relative bg-slate-50 rounded-[34px] overflow-hidden min-h-[780px] max-h-[860px] flex flex-col shadow-inner">
          {/* Status Bar */}
          <div className="bg-navy-950 text-white px-6 pt-3 pb-1 flex justify-between items-center text-xs select-none z-20">
            <span className="font-semibold tracking-wider text-[11px]">09:41</span>
            {/* Dynamic Island / Notch */}
            <div className="w-20 h-4 bg-black rounded-full mx-auto -mt-1 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto flex flex-col relative bg-slate-50">
            {children}
          </div>

          {/* Home Indicator Bar */}
          <div className="bg-slate-50 py-2 flex justify-center items-center">
            <div className="w-28 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
