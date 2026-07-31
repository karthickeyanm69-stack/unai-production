import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  CreditCard,
  Send,
  Gift,
  Users,
  User,
  Shield,
  Lock,
  Info,
  ShieldCheck,
  ArrowUpRight,
  LogOut,
  LayoutDashboard,
  DollarSign,
  MessageSquare,
} from 'lucide-react';
import { store } from '../store';
import { LoginModal } from './LoginModal';

export const BottomNavDock: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const currentUser = store.getCurrentUser();
  const isAuthenticated = store.getIsAuthenticated();

  const handleLogout = () => {
    store.logoutUser();
    navigate('/');
  };

  const isStaffRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/finance') ||
    location.pathname.startsWith('/employee') ||
    location.pathname.startsWith('/mrm') ||
    location.pathname.startsWith('/support') ||
    location.pathname.startsWith('/staff') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/console') ||
    location.pathname.startsWith('/portal');

  const isSubPage = ['/ledger', '/pay', '/payment-setup', '/plans', '/kyc'].includes(location.pathname);

  // Detect if ANY modal card or overlay is open in the middle of the screen
  const isDomModalOpen = typeof document !== 'undefined' && (
    document.body.classList.contains('modal-open') ||
    document.body.classList.contains('overflow-hidden') ||
    !!document.querySelector('.fixed.inset-0')
  );
  const isAnyModalOpen = store.getIsModalOpen() || store.getShowLoginModal() || isDomModalOpen;

  if (isStaffRoute || isSubPage || isAnyModalOpen) {
    return null;
  }

  const isPublicNewCustomerRoute = ['/', '/how-it-works', '/trust', '/kyc'].includes(location.pathname);

  return (
    <>
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/95 border-2 border-[#1B4B66]/30 rounded-full p-2 sm:p-2.5 flex items-center gap-2 sm:gap-3 shadow-2xl backdrop-blur-xl pb-[calc(0.5rem+env(safe-area-inset-bottom))] animate-fade-up">
        {/* CASE A: New Customer / Visitor Dock (Active on Public Landing, How It Works, Trust, KYC) */}
        {(isPublicNewCustomerRoute || !isAuthenticated) && (
          <>
            <Link
              to="/"
              className={`p-3 sm:p-3.5 rounded-full transition-all flex items-center gap-1.5 ${
                location.pathname === '/'
                  ? 'bg-[#1B4B66] text-white shadow-lg font-extrabold'
                  : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
              }`}
              title="New Customer Home"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </Link>

            <Link
              to="/how-it-works"
              className={`p-3 sm:p-3.5 rounded-full transition-all flex items-center gap-1.5 ${
                location.pathname === '/how-it-works'
                  ? 'bg-[#1B4B66] text-white shadow-lg font-extrabold'
                  : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
              }`}
              title="How It Works"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </Link>

            <Link
              to="/trust"
              className={`p-3 sm:p-3.5 rounded-full transition-all flex items-center gap-1.5 ${
                location.pathname === '/trust'
                  ? 'bg-[#1B4B66] text-white shadow-lg font-extrabold'
                  : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
              }`}
              title="Trust & Legal"
            >
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </Link>

            <button
              onClick={() => store.openLoginModal()}
              className="p-3 sm:p-3.5 rounded-full bg-white border border-[#1B4B66]/30 text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold transition-all shadow-sm flex items-center gap-1.5 text-xs font-['Sora'] cursor-pointer"
              title="Login to Wallet"
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#1B4B66] stroke-[2.5]" />
              <span className="hidden sm:inline font-extrabold">Login</span>
            </button>

            <Link
              to="/kyc"
              className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 hover:scale-105 cursor-pointer"
            >
              <span>Start Saving</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </>
        )}

        {/* CASE B: Logged-In Member Wallet Dock (Active ONLY on Main Hub pages like /dashboard, /hampers, /circles, /profile) */}
        {!isPublicNewCustomerRoute && isAuthenticated && currentUser.role === 'member' && (
          <>
            <Link
              to="/dashboard"
              className={`p-3 sm:p-3.5 rounded-full transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-[#D4A62A] text-[#1E2732] shadow-glow-gold scale-105 sm:scale-110 font-bold'
                  : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
              }`}
              title="My Wallet Dashboard"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </Link>

            <Link
              to="/pay"
              className={`p-3 sm:p-3.5 rounded-full transition-all ${
                location.pathname === '/pay'
                  ? 'bg-[#1F8A5F] text-white shadow-lg scale-105 sm:scale-110 font-bold'
                  : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
              }`}
              title="Make Monthly Payment"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </Link>

            <Link
              to="/hampers"
              className={`p-3 sm:p-3.5 rounded-full transition-all ${
                location.pathname === '/hampers'
                  ? 'bg-[#D4A62A] text-[#1E2732] shadow-glow-gold scale-105 sm:scale-110 font-bold'
                  : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
              }`}
              title="Gift Hampers Catalog"
            >
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </Link>

            <Link
              to="/circles"
              className={`p-3 sm:p-3.5 rounded-full transition-all ${
                location.pathname === '/circles'
                  ? 'bg-[#D4A62A] text-[#1E2732] shadow-glow-gold scale-105 sm:scale-110 font-bold'
                  : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
              }`}
              title="Savings Circles"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </Link>

            <Link
              to="/profile"
              className={`p-3 sm:p-3.5 rounded-full transition-all ${
                location.pathname === '/profile' || location.pathname === '/settings' || location.pathname === '/notifications'
                  ? 'bg-[#1B4B66] text-white shadow-lg scale-105 sm:scale-110 font-bold'
                  : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
              }`}
              title="Profile & Mandate Settings"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </Link>
          </>
        )}

        {/* CASE C: Staff Portals (Employee, Support, Finance, Super Admin) */}
        {!isPublicNewCustomerRoute && isAuthenticated && currentUser.role !== 'member' && (
          <>
            {currentUser.role === 'employee' && (
              <Link
                to="/employee"
                className="px-4 py-2.5 rounded-full bg-[#1B4B66] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Users className="w-4 h-4" />
                <span>Employee MRM</span>
              </Link>
            )}

            {currentUser.role === 'support_agent' && (
              <Link
                to="/support"
                className="px-4 py-2.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Support Desk</span>
              </Link>
            )}

            {currentUser.role === 'finance_admin' && (
              <Link
                to="/finance"
                className="px-4 py-2.5 rounded-full bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
              >
                <DollarSign className="w-4 h-4" />
                <span>Finance Admin</span>
              </Link>
            )}

            {currentUser.role === 'super_admin' && (
              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-full bg-[#1B4B66] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Super Admin</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="p-3 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold cursor-pointer"
              title="Sign Out Staff Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </>
  );
};
