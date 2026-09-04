import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Shield, Share } from 'lucide-react';

export const InstallPromptBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);

  useEffect(() => {
    // Check if iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = (window.navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches;

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
    }

    // Listen for native PWA beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  // If already running as standalone PWA, or dismissed, don't show
  if (isDismissed) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border-b border-emerald-500/30 px-3 py-2 text-white shadow-md relative z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-slate-100">Install Civic Hero App</span>
              <span className="text-slate-400 hidden sm:inline"> — Instant offline access & home screen icon</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstallClick}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Add to Home Screen Modal Guide */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Install on iPhone / iPad</h3>
                  <p className="text-[11px] text-slate-400">Add to Home Screen in 2 taps</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5 bg-navy-950 p-3 rounded-xl border border-navy-800">
                <Share className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>1. Tap the <strong>Share</strong> button on Safari's bottom toolbar.</span>
              </div>
              <div className="flex items-start space-x-2.5 bg-navy-950 p-3 rounded-xl border border-navy-800">
                <span className="text-emerald-400 font-bold text-sm">➕</span>
                <span>2. Scroll down and select <strong>"Add to Home Screen"</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs py-2.5 rounded-xl transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
