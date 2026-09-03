import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Terminal, 
  X, 
  Key, 
  Eye, 
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Hours Security Lockout
const TARGET_ADMIN_EMAIL = (import.meta as any).env?.VITE_ADMIN_EMAIL || '';
const TARGET_ADMIN_PASSWORD = (import.meta as any).env?.VITE_ADMIN_PASSWORD || '';
const SECRET_OVERRIDE_CODE = (import.meta as any).env?.VITE_SECRET_OVERRIDE_CODE || '';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [showSecretCode, setShowSecretCode] = useState(false);
  const [secretErrorMsg, setSecretErrorMsg] = useState('');

  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('asad_admin_failed_attempts')) || 0;
    } catch {
      return 0;
    }
  });
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.altKey) {
        e.preventDefault();
        setSecretCodeInput('');
        setSecretErrorMsg('');
        setIsSecretModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Countdown timer for 24h lockout
  useEffect(() => {
    const checkLockout = () => {
      try {
        const lockoutUntil = Number(localStorage.getItem('asad_admin_lockout_until')) || 0;
        const now = Date.now();
        if (lockoutUntil > now) {
          const remainingSecs = Math.ceil((lockoutUntil - now) / 1000);
          setLockoutTimeLeft(remainingSecs);
        } else {
          setLockoutTimeLeft(0);
          if (lockoutUntil > 0) {
            localStorage.removeItem('asad_admin_lockout_until');
            localStorage.setItem('asad_admin_failed_attempts', '0');
            setFailedAttempts(0);
          }
        }
      } catch (err) {
        setLockoutTimeLeft(0);
      }
    };

    checkLockout();
    const timer = setInterval(checkLockout, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft24H = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFailedAttempt = () => {
    const newCount = failedAttempts + 1;
    setFailedAttempts(newCount);
    localStorage.setItem('asad_admin_failed_attempts', String(newCount));

    if (newCount >= MAX_FAILED_ATTEMPTS) {
      const lockoutTimestamp = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem('asad_admin_lockout_until', String(lockoutTimestamp));
      setLockoutTimeLeft(Math.ceil(LOCKOUT_DURATION_MS / 1000));
      setErrorMsg(`⚠️ Security Lockout: Consecutive failed login attempts detected. Access blocked for 24 hours.`);
    } else {
      setErrorMsg(`Invalid credentials. Check email and password.`);
    }
  };

  const handleSecretOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecretErrorMsg('');

    if (secretCodeInput.trim() === SECRET_OVERRIDE_CODE) {
      localStorage.removeItem('asad_admin_lockout_until');
      localStorage.setItem('asad_admin_failed_attempts', '0');
      setFailedAttempts(0);
      setLockoutTimeLeft(0);
      setIsSecretModalOpen(false);
      setErrorMsg('');
      setSuccessMsg('✨ Emergency Secret Override Accepted! 24-hour lockout has been cleared.');
    } else {
      setSecretErrorMsg('Invalid emergency security code.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (lockoutTimeLeft > 0) {
      setErrorMsg(`Security Lockout Active: Access blocked for ${formatTimeLeft24H(lockoutTimeLeft)}.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const targetEmail = TARGET_ADMIN_EMAIL.trim().toLowerCase();
      const targetPassword = TARGET_ADMIN_PASSWORD;

      let isAuthenticated = false;

      // 1. Primary Credential Validation
      if (trimmedEmail === targetEmail && password === targetPassword) {
        isAuthenticated = true;
      } 
      // 2. Supabase Auth Fallback (if configured)
      else if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (!error) {
          isAuthenticated = true;
        }
      }

      if (isAuthenticated) {
        // Clear failed attempts on successful login
        localStorage.removeItem('asad_admin_failed_attempts');
        localStorage.removeItem('asad_admin_lockout_until');
        sessionStorage.setItem('asad_admin_authenticated', 'true');
        onLoginSuccess();
      } else {
        handleFailedAttempt();
      }
    } catch (err) {
      setErrorMsg('An unexpected security error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocked = lockoutTimeLeft > 0;

  return (
    <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center p-4 sm:p-8 selection:bg-[#ea4315] selection:text-white font-sans relative overflow-hidden select-none">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ea4315]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ── MAIN DUAL-PANEL SPLIT CONTAINER (100% Mobile, Tablet & PC Responsive) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl bg-[#0c0d12] border border-white/10 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[640px] relative z-10 my-auto"
      >
        
        {/* ── LEFT PANEL: Crimson-Orange Branding Side ── */}
        <div className="relative lg:col-span-6 bg-gradient-to-br from-[#d94814] via-[#851806] to-[#2b0804] p-6 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden min-h-[320px] sm:min-h-[400px] lg:min-h-full">
          
          {/* Subtle Grid Lines Overlay */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
            <div className="absolute top-0 bottom-0 left-[10%] right-[10%] flex justify-between">
              <div className="w-px h-full bg-white/20" />
              <div className="w-px h-full bg-white/20" />
            </div>
            <div className="absolute left-0 right-0 top-[20%] bottom-[20%] flex flex-col justify-between">
              <div className="h-px w-full bg-white/20" />
            </div>
          </div>

          {/* Central Hero 'A' Logo Image (Main Display) */}
          <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none select-none w-[240px] sm:w-[360px] md:w-[420px] lg:w-[480px]">
            <img 
              src="/logo.webp" 
              alt="Asadullah Logo" 
              className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]" 
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
            />
          </div>

          {/* Left Text Overlay (Bottom Left) */}
          <div className="relative z-20 mt-auto pt-16 max-w-xs space-y-2">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white/80 uppercase tracking-widest block">
              // AI ENGINEER
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-['Outfit'] uppercase leading-tight text-white drop-shadow-lg">
              BUILDING AI<br />
              THAT POWERS<br />
              WHAT'S NEXT.
            </h2>
          </div>

          {/* Left Footer Info */}
          <div className="relative z-20 pt-6 sm:pt-8 border-t border-white/10 flex items-center gap-2 text-[10px] font-mono text-white/70">
            <span>© 2026 ASADULLAH</span>
            <span>●</span>
            <span>AI ENGINEER</span>
          </div>
        </div>

        {/* ── RIGHT PANEL: Dark Stealth Login Form ── */}
        <div className="relative lg:col-span-6 bg-[#0c0d12] p-6 sm:p-10 lg:p-12 flex flex-col justify-between z-20">
          
          {/* Top Right Action Badges */}
          <div className="flex items-center justify-end gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Main Form Container */}
          <div className="my-auto max-w-sm w-full mx-auto space-y-6">
            
            <div>
              <span className="text-[10px] font-mono text-[#ea4315] font-bold uppercase tracking-widest block mb-1">
                // WELCOME BACK
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white tracking-tight">
                Log in to your dashboard
              </h2>
              <p className="text-xs text-zinc-400 mt-2 font-medium leading-relaxed">
                Access your projects, resume your work, and keep building the future.
              </p>
            </div>

            {/* Success Alert */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-3.5 text-xs text-emerald-300 font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* 24h Security Lockout Alert */}
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-950/70 border border-red-500/40 rounded-2xl p-4 flex flex-col gap-3 text-xs text-red-200"
              >
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold text-white block mb-1 uppercase tracking-wider text-[10px]">
                      24-HOUR SECURITY LOCKOUT ACTIVE
                    </span>
                    <p className="leading-relaxed text-zinc-300 text-[11px]">
                      Consecutive failed login attempts detected. Access blocked for 24 hours for safety.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/60 px-3 py-2 rounded-xl border border-red-500/20 font-mono text-xs">
                  <span className="text-zinc-400 font-bold">Time Remaining:</span>
                  <span className="text-orange-400 font-bold text-sm">{formatTimeLeft24H(lockoutTimeLeft)}</span>
                </div>
              </motion.div>
            )}

            {/* Error Alert */}
            {errorMsg && !isLocked && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-950/40 border border-red-500/30 rounded-2xl p-3.5 text-xs text-red-300 font-medium flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold mb-2">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    disabled={isLocked}
                    required
                    className="w-full bg-[#14151c] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ea4315] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={isLocked}
                    required
                    className="w-full bg-[#14151c] border border-white/10 rounded-2xl py-3.5 pl-11 pr-11 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ea4315] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox & Forgot link */}
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#14151c] border-white/10 text-[#ea4315] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#ea4315]"
                  />
                  <span className="text-xs">Remember me</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLocked}
                className="w-full py-4 px-6 rounded-2xl bg-[#ea4315] hover:bg-[#ff5722] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-900/30 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : isLocked ? (
                  <span>24h Lockout Active ({formatTimeLeft24H(lockoutTimeLeft)})</span>
                ) : (
                  <>
                    <span>LOG IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>

          {/* Footer Back to Site Link */}
          <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Portfolio</span>
            </a>
          </div>
        </div>

      </motion.div>

      {/* SECRET OVERRIDE MODAL (Triggered only by Ctrl + Shift + Alt) */}
      <AnimatePresence>
        {isSecretModalOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSecretModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0e0f14] border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(240,90,40,0.2)] z-10 font-mono text-white"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-orange-500">
                  <Terminal className="w-5 h-5 animate-pulse" />
                  <span className="font-bold text-sm tracking-widest uppercase">
                    ADMIN SECURITY RECOVERY
                  </span>
                </div>
                <button
                  onClick={() => setIsSecretModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {secretErrorMsg && (
                <div className="mb-4 bg-red-950/60 border border-red-500/40 rounded-xl p-3 text-xs text-red-300 font-bold">
                  {secretErrorMsg}
                </div>
              )}

              <form onSubmit={handleSecretOverrideSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold mb-2 uppercase tracking-widest">
                    ENTER SECURITY AUTHORIZATION CODE:
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSecretCode ? "text" : "password"}
                      value={secretCodeInput}
                      onChange={(e) => setSecretCodeInput(e.target.value)}
                      placeholder="••••••••••••"
                      autoFocus
                      required
                      className="w-full bg-black border border-orange-500/40 rounded-xl py-3 pl-10 pr-10 text-sm text-orange-300 placeholder-zinc-700 font-mono focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecretCode(!showSecretCode)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
                      title={showSecretCode ? "Hide code" : "Show code"}
                    >
                      {showSecretCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSecretModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/30 active:scale-95 transition-all"
                  >
                    Authorize Unlock
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
