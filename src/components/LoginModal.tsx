import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Smartphone, X, ArrowRight, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';
import { store } from '../store';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      store.setModalOpen(true);
      if (typeof document !== 'undefined') {
        document.body.classList.add('modal-open', 'overflow-hidden');
      }

      // Check for remembered user in localStorage
      try {
        const savedAccount = localStorage.getItem('samruddisave_remembered_account');
        if (savedAccount) {
          const parsed = JSON.parse(savedAccount);
          if (parsed.identifier) setIdentifier(parsed.identifier);
          if (parsed.pin) setPin(parsed.pin);
        }
      } catch (e) {}

      return () => {
        store.setModalOpen(false);
        if (typeof document !== 'undefined') {
          document.body.classList.remove('modal-open', 'overflow-hidden');
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const user = store.loginUser(identifier, pin);
      setIsSubmitting(false);

      if (user) {
        // Save or clear remembered credentials
        if (rememberMe) {
          try {
            localStorage.setItem('samruddisave_remembered_account', JSON.stringify({ identifier, pin }));
          } catch (e) {}
        } else {
          localStorage.removeItem('samruddisave_remembered_account');
        }

        // Explicitly clean up modal state & DOM classes immediately on login
        if (typeof document !== 'undefined') {
          document.body.classList.remove('modal-open', 'overflow-hidden');
        }
        store.setModalOpen(false);

        onClose();
        if (onSuccess) onSuccess();

        if (user.role === 'member') {
          navigate('/dashboard');
        } else if (user.role === 'employee') {
          navigate('/employee');
        } else if (user.role === 'support_agent') {
          navigate('/support');
        } else if (user.role === 'finance_admin') {
          navigate('/finance');
        } else if (user.role === 'super_admin') {
          navigate('/admin');
        }
      } else {
        setError('Invalid login credentials or PIN. Please check your mobile/email and security PIN.');
      }
    }, 500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[100] bg-[#1E2732]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up"
    >
      <div className="bg-white border-2 border-[#1B4B66] rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-[#1E2732] relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#1B4B66] text-[#D4A62A] flex items-center justify-center font-extrabold shadow-md">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 id="modal-title" className="font-['Sora'] font-extrabold text-base text-[#1E2732]">Account Sign In</h3>
              <p className="text-[11px] text-[#5C6773]">Sign in to access your role-based savings dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Sign In Dialog"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1E2732] flex items-center justify-center font-bold cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-[14px] text-rose-700 text-xs font-bold">
            {error}
          </div>
        )}

        {/* Form: Mobile & Security PIN */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
          <div className="space-y-1.5">
            <label htmlFor="login-identifier" className="text-xs font-bold text-[#1E2732] block">
              Mobile Number, Email, or Staff ID
            </label>
            <div className="relative">
              <input
                id="login-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter phone, email or staff ID..."
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-[#F8FAFC] border border-slate-300 text-xs text-[#1E2732] focus:outline-none focus:ring-2 focus:ring-[#1B4B66] focus:border-[#1B4B66] font-bold"
                required
              />
              <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-pin" className="text-xs font-bold text-[#1E2732] block">
              4-Digit Security PIN / Password
            </label>
            <div className="relative">
              <input
                id="login-pin"
                type={showPin ? 'text' : 'password'}
                maxLength={10}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-3 rounded-[14px] bg-[#F8FAFC] border border-slate-300 text-xs font-mono text-[#1E2732] focus:outline-none focus:ring-2 focus:ring-[#1B4B66] focus:border-[#1B4B66] font-bold tracking-widest"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              
              {/* Eye Icon Password Toggle */}
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                aria-label={showPin ? "Hide Password" : "Show Password"}
                className="absolute right-3 top-3 p-1 text-slate-400 hover:text-[#1B4B66] transition-colors cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Account & Password Checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              type="button"
              id="remember-me-checkbox"
              onClick={() => setRememberMe(!rememberMe)}
              aria-label="Remember my account and password"
              className="text-[#1B4B66] focus:outline-none cursor-pointer flex items-center gap-2"
            >
              {rememberMe ? (
                <CheckSquare className="w-4 h-4 text-[#1B4B66]" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-xs text-[#1E2732] font-semibold select-none">Remember my account & password</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            aria-label="Sign In & Go to Dashboard"
            className="w-full py-3.5 rounded-[14px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-[#1B4B66] focus:ring-offset-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In & Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* New Customer Onboarding CTA */}
        <div className="pt-3 border-t border-slate-100 text-center">
          <p className="text-xs text-[#5C6773] font-semibold">New to SamruddiSave?</p>
          <button
            onClick={() => {
              onClose();
              navigate('/kyc');
            }}
            aria-label="Create New Account & Start Onboarding"
            className="mt-1 text-xs font-['Sora'] font-extrabold text-[#1B4B66] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <span>Create New Account & Start Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
