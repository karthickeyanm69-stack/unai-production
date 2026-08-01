import React, { useState, useEffect } from 'react';
import { useLocation, Navigate, Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, UserCheck, Briefcase, Building, LifeBuoy, DollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';
import { store } from '../store';
import { UserRole } from '../types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

// Maps a role to its correct home dashboard path
const getHomeForRole = (role: UserRole): string => {
  if (role === 'employee') return '/employee';
  return '/dashboard';
};

// The staff & admin sign-in form
export const StaffSignInForm: React.FC = () => {
  const navigate = useNavigate();
  const [staffEmail, setStaffEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!staffEmail.trim()) {
      setError('Please enter your email address, phone, or account ID.');
      return;
    }
    const user = store.loginUser(staffEmail.trim(), pin);
    if (user) {
      if (user.role === 'member') {
        navigate('/dashboard', { replace: true });
      } else if (user.role === 'employee') {
        navigate('/employee', { replace: true });
      }
    } else {
      setError('Invalid login credentials or PIN.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] flex items-center justify-center p-4 sm:p-8">
      {/* Executive Split Console Container */}
      <div className="bg-white border-2 border-[#1B4B66]/20 rounded-[32px] max-w-4xl w-full shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-fade-up">

        {/* Left Panel: Executive Brand & Role Capabilities */}
        <div className="md:col-span-5 bg-[#1B4B66] text-white p-7 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 sm:space-y-8 relative z-10">

            {/* Header Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-[#D4A62A] flex items-center justify-center shadow-md shrink-0">
                <Shield className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-['Sora'] font-extrabold text-base tracking-tight text-white">SamruddiSave</h1>
                <p className="text-[10px] text-[#D4A62A] font-bold uppercase tracking-wider">Management Console</p>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5 pt-1">
              <h2 className="font-['Sora'] font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Admin & Staff Portal
              </h2>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                Internal system access for authorized team members & executive administrators.
              </p>
            </div>

            {/* Placeholder for future logo implementation */}
            <div className="py-6 flex items-center justify-center">
              {/* Logo space reserved */}
            </div>
          </div>

          {/* Bottom Security Compliance Badges */}
          <div className="pt-6 border-t border-white/15 relative z-10 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>RBI Escrow Trustee Certified</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 font-medium text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#D4A62A] shrink-0" />
              <span>256-Bit Encrypted Auth Session</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Clean Sign-In Form (No Quick Fill Buttons) */}
        <div className="md:col-span-7 p-7 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1B4B66] bg-[#1B4B66]/10 px-2.5 py-1 rounded-full">
                Internal Access Only
              </span>
              <span className="text-xs text-[#5C6773] font-bold">PIN: 1234</span>
            </div>
            <h3 className="font-['Sora'] font-extrabold text-2xl sm:text-3xl text-[#1E2732] mt-3">
              Sign In
            </h3>
            <p className="text-xs sm:text-sm text-[#5C6773] mt-1 font-medium leading-relaxed">
              Enter your official email address and 4-digit security PIN to access your portal.
            </p>
          </div>



          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-[14px] text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleStaffLogin} className="space-y-4 text-xs font-medium">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-[#1E2732] block">Email Address / Employee ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="priya.verma@samruddisave.com"
                  className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-2xl bg-[#F8FAFC] border border-slate-300 text-xs sm:text-sm text-[#1E2732] font-bold focus:border-[#1B4B66] focus:bg-white focus:outline-none transition-all"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-[#1E2732] block">Security PIN</label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-2xl bg-[#F8FAFC] border border-slate-300 text-xs sm:text-sm font-mono font-bold text-[#1E2732] focus:border-[#1B4B66] focus:bg-white focus:outline-none tracking-widest transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <span>Sign In to Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>


        </div>

      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// RoleGuard — The single source of auth truth for all routes
// ─────────────────────────────────────────────────────────────
export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const isAuthenticated = store.getIsAuthenticated();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/console';

  if (!isAuthenticated) {
    if (isLoginPage) return <StaffSignInForm />;
    return <Navigate to="/" replace />;
  }

  const currentUser = store.getCurrentUser();
  const role = currentUser.role;

  if (isLoginPage) {
    return <Navigate to={getHomeForRole(role)} replace />;
  }

  const isAllowed = allowedRoles.includes(role);
  if (isAllowed) return <>{children}</>;

  return <Navigate to={getHomeForRole(role)} replace />;
};
