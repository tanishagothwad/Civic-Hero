import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { createRipple } from '../common/MaterialRipple';
import {
  Shield,
  Smartphone,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  User,
  LayoutDashboard,
  HardHat,
  Globe,
  UserCheck,
  Building2,
} from 'lucide-react';
import { VoiceInputButton } from '../common/VoiceInputButton';

interface LoginModalProps {
  onOpenLanguage: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onOpenLanguage }) => {
  const { loginWithPhone, completeCitizenOnboarding, t } = useApp();

  // Multi-step auth flow
  const [step, setStep] = useState<'phone' | 'otp' | 'onboarding'>('phone');
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [inviteCode, setInviteCode] = useState<string>('');
  const [showInviteInput, setShowInviteInput] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Citizen first-time onboarding state
  const [name, setName] = useState<string>('');
  const [ward, setWard] = useState<string>('Ward 4 - Indiranagar');

  const wardOptions = [
    'Ward 4 - Indiranagar',
    'Ward 8 - Koramangala',
    'Ward 12 - HSR Layout',
    'Ward 15 - Whitefield',
    'Ward 2 - Malleshwaram',
    'Ward 6 - Jayanagar',
  ];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      const res = loginWithPhone(phone, otp, inviteCode);
      if (!res.success) {
        setError(res.error || 'Invalid OTP code');
        return;
      }

      if (res.isNewUser) {
        setStep('onboarding');
      }
    }, 400);
  };

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name to complete setup');
      return;
    }
    completeCitizenOnboarding(name.trim(), ward);
  };

  const fillDemoNumber = (demoPhone: string, _targetRole: UserRole) => {
    setPhone(demoPhone);
    setError('');
  };

  const fillDemoOtp = () => {
    setOtp('123456');
    setError('');
  };

  return (
    <div className="flex-1 w-full bg-[#F5F5F5] flex flex-col items-center justify-center p-4 relative">
      {/* Top bar with Branding & Language Switcher */}
      <div className="w-full max-w-md flex justify-between items-center mb-5 px-1">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded bg-[#2E7D32] flex items-center justify-center shadow-elevation-1">
            <Shield className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div>
            <span className="font-bold text-lg text-[#0B132B] tracking-tight">Civic Hero</span>
            <span className="block text-[10px] text-black/60 uppercase tracking-wider font-medium">
              Citizen Portal
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            createRipple(e, 'rgba(0, 0, 0, 0.1)');
            onOpenLanguage();
          }}
          className="flex items-center space-x-1.5 bg-white text-black/87 px-3 py-1.5 rounded border border-slate-300 text-xs font-medium shadow-elevation-1 hover:bg-slate-50 transition-colors ripple-surface"
        >
          <Globe className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>Language</span>
        </button>
      </div>

      {/* Main Material Authentication Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded shadow-elevation-8 p-6 sm:p-8 text-[#212121]">
        
        {/* STEP 1: PHONE NUMBER */}
        {step === 'phone' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-[#E8F5E9] text-[#2E7D32] mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-normal text-black/87">
                {t.loginTitle || 'Sign In to Civic Hero'}
              </h1>
              <p className="text-xs text-black/60 mt-1 max-w-xs mx-auto">
                {t.loginSubtitle || 'Enter your mobile number to report issues, track resolutions, or access staff portals.'}
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-black/60 mb-1.5">
                  {t.enterPhone || 'Mobile Phone Number'}
                </label>
                <div className="flex rounded border border-slate-300 bg-white focus-within:border-[#2E7D32] focus-within:ring-1 focus-within:ring-[#2E7D32] transition-colors">
                  <span className="inline-flex items-center px-3.5 bg-slate-100 border-r border-slate-300 text-black/87 font-medium text-sm">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    className="flex-1 bg-transparent px-3.5 py-2.5 text-black/87 placeholder-slate-400 text-sm font-medium focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Optional Invite Code Toggle */}
              <div>
                {!showInviteInput ? (
                  <button
                    type="button"
                    onClick={() => setShowInviteInput(true)}
                    className="text-xs text-[#2E7D32] hover:underline font-medium flex items-center space-x-1"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Have a Municipal Staff / Worker Invite Code?</span>
                  </button>
                ) : (
                  <div className="space-y-1">
                    <label className="block text-xs font-medium uppercase tracking-wider text-black/60">
                      Staff / Worker Invite Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="e.g. MUNI-STAFF-2026"
                      className="w-full bg-white border border-slate-300 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] rounded px-3.5 py-2.5 text-sm text-black/87 font-mono uppercase focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs font-medium text-[#D32F2F] text-center">
                  {error}
                </div>
              )}

              {/* Material Contained Primary Button */}
              <button
                type="submit"
                disabled={isLoading || phone.length < 10}
                onClick={(e) => createRipple(e, 'rgba(255, 255, 255, 0.3)')}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium uppercase tracking-wider text-xs sm:text-sm py-3 px-4 rounded shadow-elevation-2 hover:shadow-elevation-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ripple-surface"
              >
                <span>{isLoading ? 'Sending Code...' : (t.sendOtp || 'Get 6-Digit OTP')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <p className="text-[11px] font-medium uppercase tracking-wider text-black/60 text-center mb-2.5">
                Quick Demo Auto-Fill
              </p>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    createRipple(e, 'rgba(46, 125, 50, 0.15)');
                    fillDemoNumber('9876543210', 'citizen');
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-300 p-2.5 rounded flex items-center justify-between text-left transition-colors ripple-surface"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-black/87">
                        Citizen — Aarav Mehta
                      </div>
                      <div className="text-[10px] text-black/60">+91 98765 43210 (Ward Guardian)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded">
                    Fill
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    createRipple(e, 'rgba(25, 118, 210, 0.15)');
                    fillDemoNumber('9123456789', 'municipal');
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-300 p-2.5 rounded flex items-center justify-between text-left transition-colors ripple-surface"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded bg-[#E3F2FD] text-[#1976D2] flex items-center justify-center">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-black/87">
                        Municipal Staff — Dr. Sunita Rao
                      </div>
                      <div className="text-[10px] text-black/60">+91 91234 56789 (HQ Triage)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium bg-[#E3F2FD] text-[#1976D2] px-2 py-0.5 rounded">
                    Fill
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    createRipple(e, 'rgba(245, 124, 0, 0.15)');
                    fillDemoNumber('9845011223', 'worker');
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-300 p-2.5 rounded flex items-center justify-between text-left transition-colors ripple-surface"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded bg-[#FFF3E0] text-[#F57C00] flex items-center justify-center">
                      <HardHat className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-black/87">
                        Field Worker — Ramesh Kumar
                      </div>
                      <div className="text-[10px] text-black/60">+91 98450 11223 (Field Ops)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium bg-[#FFF3E0] text-[#F57C00] px-2 py-0.5 rounded">
                    Fill
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
              <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-[#FFF8E1] text-[#F57C00] mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-normal text-black/87">
                {t.enterOtp || 'Enter OTP Code'}
              </h2>
              <p className="text-xs text-black/60 mt-1">
                Sent verification code to <span className="text-black/87 font-medium">+91 {phone}</span>
              </p>
            </div>

            {/* Helper Banner with Auto-fill */}
            <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
              <div className="text-xs text-black/60">
                <span className="font-bold text-black/87">Demo Mode:</span> OTP is <span className="font-mono font-bold text-[#2E7D32]">123456</span>
              </div>
              <button
                type="button"
                onClick={fillDemoOtp}
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium text-xs uppercase tracking-wider px-2.5 py-1 rounded transition-colors"
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
                  className="w-full bg-white border border-slate-300 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] text-center tracking-[0.5em] text-2xl font-bold text-black/87 py-3 rounded focus:outline-none transition-all"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs font-medium text-[#D32F2F] text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length < 4}
                onClick={(e) => createRipple(e, 'rgba(255, 255, 255, 0.3)')}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium uppercase tracking-wider text-xs sm:text-sm py-3 px-4 rounded shadow-elevation-2 hover:shadow-elevation-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ripple-surface"
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
              <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-[#E8F5E9] text-[#2E7D32] mb-3">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-normal text-black/87">
                {t.welcomeCitizen || 'Welcome Citizen Hero! 🎉'}
              </h2>
              <p className="text-xs text-black/60 mt-1 max-w-xs mx-auto">
                Set up your citizen profile to start reporting civic issues and earning ward badges!
              </p>
            </div>

            <form onSubmit={handleCompleteOnboarding} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-black/60 mb-1.5">
                  {t.enterName || 'Your Full Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder || 'e.g. Kavita Nair'}
                    className="w-full bg-white border border-slate-300 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] rounded px-3.5 py-2.5 text-sm text-black/87 placeholder-slate-400 focus:outline-none"
                    autoFocus
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <VoiceInputButton onTranscript={(spoken) => setName(spoken)} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-black/60 mb-1.5">
                  {t.selectWard || 'Select your home Ward / Area'}
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-white border border-slate-300 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] rounded px-3.5 py-2.5 text-sm text-black/87 focus:outline-none cursor-pointer"
                >
                  {wardOptions.map((w) => (
                    <option key={w} value={w} className="bg-white text-black/87">
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs font-medium text-[#D32F2F] text-center">
                  {error}
                </div>
              )}

              <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded p-3 flex items-center space-x-2.5">
                <span className="text-xl">🎁</span>
                <p className="text-xs text-[#2E7D32] font-medium">
                  You will earn <span className="font-bold text-[#F57C00]">+50 XP Welcome Points</span> upon completing setup!
                </p>
              </div>

              <button
                type="submit"
                onClick={(e) => createRipple(e, 'rgba(255, 255, 255, 0.3)')}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium uppercase tracking-wider text-xs sm:text-sm py-3 px-4 rounded shadow-elevation-2 hover:shadow-elevation-4 flex items-center justify-center space-x-2 transition-all ripple-surface"
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

export default LoginModal;
