import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowLeft, 
  AlertCircle, 
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../../services/storage';

interface AdminSecurityGateProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

export const AdminSecurityGate: React.FC<AdminSecurityGateProps> = ({
  onAuthenticated,
  onCancel,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Please enter your administrator passcode.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    setTimeout(() => {
      const isValid = StorageService.verifyAdminPasscode(passcode);
      if (isValid) {
        onAuthenticated();
      } else {
        setErrorMsg('Invalid Administrator Passcode. (Hint: Use default 1084 or tonex2026)');
      }
      setIsVerifying(false);
    }, 400);
  };

  const handleQuickDemoPin = () => {
    setPasscode('1084');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Top Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="text-center space-y-1 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            Security Protected Area
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
            Tonex Staff Authentication
          </h2>
          <p className="text-xs text-slate-400">
            Enter administrator passcode to access website customization, reservation scheduling, done installation certification, and client CRM data.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/80 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Admin Security Passcode</span>
              <button
                type="button"
                onClick={handleQuickDemoPin}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                Auto-fill Demo PIN (1084)
              </button>
            </label>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="Enter 4-digit PIN or master password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-mono tracking-wider focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Security Protocols Active:</span>
            </div>
            <p>• Role-Based Access Control (Super Admin, Sales, Engineering)</p>
            <p>• Verified CSLB Contractor Security Gateway</p>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Cancel
            </button>

            <button
              type="submit"
              disabled={isVerifying}
              className="flex-1 py-2.5 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:from-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Unlock Admin Features
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
