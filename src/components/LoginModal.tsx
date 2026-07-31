import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Smartphone, User, X, ArrowRight, Shield } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'sso'>('password');

  useEffect(() => {
    if (isOpen) {
      store.setModalOpen(true);
      if (typeof document !== 'undefined') {
        document.body.classList.add('modal-open', 'overflow-hidden');
      }
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
        onClose();
        if (onSuccess) onSuccess();

        // Single Unified Login: Automatic role-based dashboard redirection
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
    }, 600);
  };

  const handleSSOLogin = (provider: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const user = store.getCurrentUser();
      setIsSubmitting(false);
      onClose();
      if (onSuccess) onSuccess();

      if (user.role === 'member') navigate('/dashboard');
      else if (user.role === 'employee') navigate('/employee');
      else if (user.role === 'support_agent') navigate('/support');
      else if (user.role === 'finance_admin') navigate('/finance');
      else if (user.role === 'super_admin') navigate('/admin');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#1E2732]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up">
      <div className="bg-white border-2 border-[#1B4B66] rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-[#1E2732] relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#1B4B66] text-[#D4A62A] flex items-center justify-center font-extrabold shadow-md">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-['Sora'] font-extrabold text-base text-[#1E2732]">Unified Account Login</h3>
              <p className="text-[11px] text-[#5C6773]">Sign in to access your role-based dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1E2732] flex items-center justify-center font-bold cursor-pointer"
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

        {/* Login Method Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-[14px] text-xs font-bold">
          <button
            onClick={() => setLoginMethod('password')}
            className={`flex-1 py-2 rounded-[10px] transition-all cursor-pointer ${
              loginMethod === 'password' ? 'bg-[#1B4B66] text-white shadow-sm font-extrabold' : 'text-[#5C6773]'
            }`}
          >
            Mobile & Security PIN
          </button>
          <button
            onClick={() => setLoginMethod('sso')}
            className={`flex-1 py-2 rounded-[10px] transition-all cursor-pointer ${
              loginMethod === 'sso' ? 'bg-[#1B4B66] text-white shadow-sm font-extrabold' : 'text-[#5C6773]'
            }`}
          >
            GPay / PhonePe SSO
          </button>
        </div>

        {/* Form: Mobile & Security PIN */}
        {loginMethod === 'password' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E2732] block">Mobile Number, Email, or Staff ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter phone, email or staff ID..."
                  className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-[#F8FAFC] border border-slate-300 text-xs text-[#1E2732] focus:outline-none focus:border-[#1B4B66] font-bold"
                  required
                />
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E2732] block">4-Digit Security PIN / Password</label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={10}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-[#F8FAFC] border border-slate-300 text-xs font-mono text-[#1E2732] focus:outline-none focus:border-[#1B4B66] font-bold tracking-widest"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-[14px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Authenticating & Routing...</span>
              ) : (
                <>
                  <span>Sign In & Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* SSO Login Options (GPay, PhonePe) */
          <div className="space-y-3">
            <p className="text-xs text-[#5C6773] text-center font-medium">Select your preferred authentication app to sign in:</p>
            <button
              onClick={() => handleSSOLogin('gpay')}
              className="w-full p-3 rounded-[14px] bg-slate-100 hover:bg-[#1B4B66]/10 border border-slate-300 flex items-center justify-between transition-all font-bold text-xs cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-blue-600 font-extrabold text-xs border border-slate-200">
                  G
                </div>
                <span>Google Pay (GPay) Fast Login</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleSSOLogin('phonepe')}
              className="w-full p-3 rounded-[14px] bg-slate-100 hover:bg-[#1B4B66]/10 border border-slate-300 flex items-center justify-between transition-all font-bold text-xs cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center font-extrabold text-xs">
                  P
                </div>
                <span>PhonePe AutoPay Login</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}

        {/* New Customer Onboarding CTA */}
        <div className="pt-3 border-t border-slate-100 text-center">
          <p className="text-xs text-[#5C6773] font-semibold">New to SamruddiSave?</p>
          <button
            onClick={() => {
              onClose();
              navigate('/kyc');
            }}
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
