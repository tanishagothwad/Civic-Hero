import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Smartphone, KeyRound, Sparkles, CheckCircle2, ArrowRight, UserCheck, Lock, Globe, HardHat, LayoutDashboard, User } from 'lucide-react';
import { VoiceInputButton } from '../common/VoiceInputButton';

interface LoginModalProps {
  onOpenLanguage: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onOpenLanguage }) => {
  const { loginWithPhone, completeCitizenOnboarding, quickDemoLogin, t } = useApp();

  const [step, setStep] = useState<'phone' | 'otp' | 'onboarding'>('phone');
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [inviteCode, setInviteCode] = useState<string>('');
  const [showInviteField, setShowInviteField] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [ward, setWard] = useState<string>('Ward 4 - Indiranagar');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const wardOptions = [
    'Ward 4 - Indiranagar',
    'Ward 7 - Koramangala',
    'Ward 12 - HSR Layout',
    'Ward 1 - Malleshwaram',
    'Ward 8 - Whitefield',
    'Ward 15 - Jayanagar',
  ];

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    const cleanNum = phone.replace(/\D/g, '');
    if (cleanNum.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 400);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    if (!otp || otp.length < 4) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = loginWithPhone(phone, otp, inviteCode);
      if (res.success) {
        if (res.isNewUser) {
          setStep('onboarding');
        }
      } else {
        setError(res.error || 'Invalid OTP code. Please use 123456 for demo.');
      }
    }, 500);
  };

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    completeCitizenOnboarding(name, ward);
  };

  const fillDemoNumber = (demoPhone: string, role: 'citizen' | 'municipal' | 'worker') => {
    setPhone(demoPhone);
    setError('');
    quickDemoLogin(role);
  };

  const fillDemoOtp = () => {
    setOtp('123456');
    setError('');
  };

  return (
    <div className="flex-1 w-full bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top bar with Language Switcher */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 z-10 px-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Shield className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">Civic Hero</span>
        </div>

        <button
          onClick={onOpenLanguage}
          className="flex items-center space-x-1.5 bg-navy-900/90 hover:bg-navy-800 text-slate-200 px-3 py-1.5 rounded-xl border border-navy-700 text-xs font-semibold backdrop-blur transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Language</span>
        </button>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-navy-900/95 border border-navy-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 text-white">
        
        {/* STEP 1: PHONE NUMBER */}
        {step === 'phone' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-3 border border-emerald-500/30">
                <Smartphone className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">{t.loginTitle || 'Sign In to Civic Hero'}</h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {t.loginSubtitle || 'Enter your mobile number to report issues, track resolutions, or access staff portals.'}
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {t.enterPhone || 'Mobile Phone Number'}
                </label>
                <div className="flex rounded-2xl overflow-hidden border border-navy-700 bg-navy-950 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/30 transition-all">
                  <span className="inline-flex items-center px-3.5 bg-navy-900 border-r border-navy-700 text-slate-300 font-bold text-sm">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder-slate-500 text-sm font-semibold focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Optional Invite Code Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowInviteField(!showInviteField)}
                  className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>{showInviteField ? 'Hide Municipal Invite Code' : 'Have a Staff or Field Worker Invite Code?'}</span>
                </button>

                {showInviteField && (
                  <div className="mt-2 p-3 bg-navy-950/80 rounded-xl border border-navy-700">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Official Invite Code
                    </label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="e.g. MUNI-STAFF-2026 or WORKER-FIELD-2026"
                      className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Municipal Staff: <code className="text-amber-400 font-mono">MUNI-STAFF-2026</code> • Field Worker: <code className="text-teal-400 font-mono">WORKER-FIELD-2026</code>
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-300 text-center animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || phone.length < 5}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                <span>{isLoading ? 'Sending OTP...' : (t.sendOtp || 'Get Verification OTP')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick 1-Tap Demo Logins */}
            <div className="mt-6 pt-5 border-t border-navy-800">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Tap Demo Quick Sign-In</span>
              </p>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoNumber('9876543210', 'citizen')}
                  className="w-full bg-navy-950 hover:bg-navy-800/80 border border-navy-700/80 hover:border-emerald-500/40 p-2.5 rounded-xl flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        Citizen — Aarav Mehta
                      </div>
                      <div className="text-[10px] text-slate-400">Reports, XP, Ward Guardian (+91 98765 43210)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    Sign In
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoNumber('9123456789', 'municipal')}
                  className="w-full bg-navy-950 hover:bg-navy-800/80 border border-navy-700/80 hover:border-blue-500/40 p-2.5 rounded-xl flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        Municipal Staff — Dr. Sunita Rao
                      </div>
                      <div className="text-[10px] text-slate-400">HQ Dashboard, Triage, Worker Dispatch</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md">
                    Sign In
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoNumber('9845011223', 'worker')}
                  className="w-full bg-navy-950 hover:bg-navy-800/80 border border-navy-700/80 hover:border-amber-500/40 p-2.5 rounded-xl flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <HardHat className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        Field Worker — Ramesh Kumar
                      </div>
                      <div className="text-[10px] text-slate-400">Road Inspector, Task Queue, Photo Proof</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md">
                    Sign In
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'otp' && (
          <div>
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 mb-3 border border-amber-500/30">
                <KeyRound className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">{t.enterOtp || 'Enter OTP Code'}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Sent 6-digit verification code to <span className="text-white font-bold">+91 {phone}</span>
              </p>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-xs text-emerald-400 hover:underline font-semibold mt-1"
              >
                Change mobile number
              </button>
            </div>

            {/* Prominent Demo Notice */}
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-3.5 mb-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-amber-300">
                  {t.demoOtpNotice || 'Demo mode: use 123456 as OTP'}
                </span>
              </div>
              <button
                type="button"
                onClick={fillDemoOtp}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow transition-all active:scale-95"
              >
                Auto-fill
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="• • • • • •"
                  className="w-full bg-navy-950 border border-navy-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-center tracking-[0.5em] text-2xl font-black text-white py-3.5 rounded-2xl focus:outline-none transition-all"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-300 text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length < 4}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                <span>{isLoading ? 'Verifying OTP...' : (t.verifyOtp || 'Verify & Sign In')}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: NEW CITIZEN PROFILE ONBOARDING */}
        {step === 'onboarding' && (
          <div>
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-3 border border-emerald-500/30 animate-bounce">
                <UserCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">{t.welcomeCitizen || 'Welcome Citizen Hero! 🎉'}</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Set up your citizen profile to start reporting civic issues and earning ward badges!
              </p>
            </div>

            <form onSubmit={handleCompleteOnboarding} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {t.enterName || 'Your Full Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder || 'e.g. Kavita Nair'}
                    className="w-full bg-navy-950 border border-navy-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
                    autoFocus
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <VoiceInputButton onTranscript={(spoken) => setName(spoken)} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {t.selectWard || 'Select your home Ward / Area'}
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none cursor-pointer"
                >
                  {wardOptions.map((w) => (
                    <option key={w} value={w} className="bg-navy-900 text-white">
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-300 text-center">
                  {error}
                </div>
              )}

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex items-center space-x-2.5">
                <span className="text-xl">🎁</span>
                <p className="text-xs text-emerald-300 font-semibold">
                  You will earn <span className="font-extrabold text-amber-400">+50 XP Welcome Points</span> upon completing setup!
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all"
              >
                <span>{t.startApp || 'Start Reporting & Earning XP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
