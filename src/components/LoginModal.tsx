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
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form Fields
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      const user = store.loginUser(identifier, pin || '1234');
      setIsSubmitting(false);

      if (user) {
        if (rememberMe) {
          try {
            localStorage.setItem('samruddisave_remembered_account', JSON.stringify({ identifier, pin }));
          } catch (e) {}
        } else {
          localStorage.removeItem('samruddisave_remembered_account');
        }

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
        }
      } else {
        setError('Invalid credentials or PIN. Please check your email/mobile and security PIN.');
      }
    }, 500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid Gmail / Email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const user = store.registerNewMember({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        pan: '',
        aadhaar: '',
        bankAccount: '',
        ifsc: '',
        upiId: '',
      });

      setIsSubmitting(false);

      if (typeof document !== 'undefined') {
        document.body.classList.remove('modal-open', 'overflow-hidden');
      }
      store.setModalOpen(false);

      onClose();
      if (onSuccess) onSuccess();

      navigate('/dashboard');
    }, 500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[100] bg-[#1E2732]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up"
    >
      <div className="bg-white border-2 border-[#1B4B66] rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-[#1E2732] relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#1B4B66] text-[#D4A62A] flex items-center justify-center font-extrabold shadow-md">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 id="modal-title" className="font-['Sora'] font-extrabold text-base text-[#1E2732]">
                {isRegisterMode ? 'New Customer Registration' : 'Account Sign In'}
              </h3>
              <p className="text-[11px] text-[#5C6773]">
                {isRegisterMode ? 'Register your account to start saving & get Admin approval' : 'Sign in to access your savings dashboard'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Dialog"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1E2732] flex items-center justify-center font-bold cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setError(null);
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              !isRegisterMode
                ? 'bg-[#1B4B66] text-white shadow-sm font-extrabold'
                : 'text-[#5C6773] hover:text-[#1E2732]'
            }`}
          >
            <span>Existing User Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setError(null);
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isRegisterMode
                ? 'bg-[#1B4B66] text-white shadow-sm font-extrabold'
                : 'text-[#5C6773] hover:text-[#1E2732]'
            }`}
          >
            <span>New Customer Register</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-[14px] text-rose-700 text-xs font-bold">
            {error}
          </div>
        )}

        {/* ──────── Form A: Existing User Sign In ──────── */}
        {!isRegisterMode && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            <div className="space-y-1.5">
              <label htmlFor="login-identifier" className="text-xs font-bold text-[#1E2732] block">
                Gmail, Mobile Number, or Employee ID
              </label>
              <div className="relative">
                <input
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@gmail.com or 9876543210"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-[#F8FAFC] border border-slate-300 text-xs text-[#1E2732] focus:outline-none focus:ring-2 focus:ring-[#1B4B66] font-bold"
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
                  className="w-full pl-10 pr-10 py-3 rounded-[14px] bg-[#F8FAFC] border border-slate-300 text-xs font-mono text-[#1E2732] focus:outline-none focus:ring-2 focus:ring-[#1B4B66] font-bold tracking-widest"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-[#1E2732] cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-[14px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Customer Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ──────── Form B: New Customer Registration ──────── */}
        {isRegisterMode && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs font-medium">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2732] block">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                className="w-full px-4 py-2.5 rounded-[12px] bg-[#F8FAFC] border border-slate-300 text-xs text-[#1E2732] font-bold focus:outline-none focus:border-[#1B4B66]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2732] block">Valid Gmail / Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ananya.sharma@gmail.com"
                className="w-full px-4 py-2.5 rounded-[12px] bg-[#F8FAFC] border border-slate-300 text-xs text-[#1E2732] font-bold focus:outline-none focus:border-[#1B4B66]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2732] block">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-2.5 rounded-[12px] bg-[#F8FAFC] border border-slate-300 text-xs text-[#1E2732] font-bold focus:outline-none focus:border-[#1B4B66]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2732] block">Create 4-Digit Security PIN / Password</label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="e.g. 1234"
                className="w-full px-4 py-2.5 rounded-[12px] bg-[#F8FAFC] border border-slate-300 text-xs font-mono text-[#1E2732] font-bold focus:outline-none focus:border-[#1B4B66] tracking-widest"
                required
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] text-[11px] text-amber-900 space-y-0.5">
              <p className="font-bold">📋 Admin Sign-off Workflow:</p>
              <p>Upon registration, your account will be submitted to the Admin Officer for approval before full wallet features unlock.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-[14px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <span>Submitting Registration...</span>
              ) : (
                <>
                  <span>Register & Request Account Approval</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
