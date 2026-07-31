import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Send,
  Gift,
  Users,
  User,
  Lock,
  Info,
  ShieldCheck,
  ArrowUpRight,
  LogOut,
  LayoutDashboard,
  DollarSign,
  MessageSquare,
  ChevronUp,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import { store } from '../store';

export const BottomNavDock: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const [showStartSavingBtn, setShowStartSavingBtn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowStartSavingBtn(true);
      return;
    }

    const handleScroll = () => {
      const heroBtn = document.getElementById('hero-cta-button');
      if (heroBtn) {
        const rect = heroBtn.getBoundingClientRect();
        // Seamless 1-to-1 handoff
        setShowStartSavingBtn(rect.bottom <= 0);
      } else {
        setShowStartSavingBtn(window.scrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const currentUser = store.getCurrentUser();
  const isAuthenticated = store.getIsAuthenticated();
  const deviceAccounts = store.getDeviceAccounts();

  const handleLogout = () => {
    store.logoutUser();
    setShowProfileMenu(false);
    navigate('/');
  };

  const handleSwitchAccount = (email: string, role: string) => {
    store.loginUser(email, '1234');
    setShowProfileMenu(false);
    if (role === 'member') navigate('/dashboard');
    else if (role === 'employee') navigate('/employee');
    else if (role === 'support_agent') navigate('/support');
    else if (role === 'finance_admin') navigate('/finance');
    else if (role === 'super_admin') navigate('/admin');
  };

  const handleAddAccount = () => {
    setShowProfileMenu(false);
    store.openLoginModal();
  };

  const handleRemoveAccount = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    store.removeDeviceAccount(id);
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

  // Hide dock only on specific staff routes, sub-pages, or when global login modal is actively open
  const isGlobalLoginOpen = store.getShowLoginModal();

  if (isStaffRoute || isSubPage || isGlobalLoginOpen) {
    return null;
  }

  const isPublicNewCustomerRoute = ['/', '/how-it-works', '/trust', '/kyc'].includes(location.pathname);

  return (
    <nav aria-label="Main Dock Navigation" className="relative">
      
      {/* User Account Profile Popup Menu (Anchored above Bottom Dock) */}
      {showProfileMenu && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs" onClick={() => setShowProfileMenu(false)} />
          <div className="fixed bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-50 w-72 bg-white border-2 border-[#1B4B66]/30 rounded-3xl shadow-2xl p-3 text-xs space-y-3 animate-fade-up text-[#1E2732]">
            {/* Active User Card Header */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
              <div className="space-y-0.5 truncate">
                <p className="font-extrabold text-sm text-[#1E2732] truncate">{currentUser.fullName}</p>
                <p className="text-[10px] text-[#1B4B66] uppercase tracking-wider font-extrabold">{currentUser.role.replace('_', ' ')}</p>
                {currentUser.email && <p className="text-[11px] text-[#5C6773] truncate font-mono">{currentUser.email}</p>}
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-ping" title="Session Active" />
            </div>

            {/* List of Saved Accounts on THIS Device */}
            <div className="space-y-1 max-h-48 overflow-y-auto pr-0.5">
              <p className="text-[10px] font-extrabold text-[#5C6773] uppercase tracking-wider px-1">Accounts on this Device:</p>
              {deviceAccounts.map((acc) => {
                const isActive = currentUser.email.toLowerCase() === acc.email.toLowerCase();
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSwitchAccount(acc.email, acc.role)}
                    className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isActive ? 'bg-[#1B4B66] text-white border-[#1B4B66] shadow-sm font-extrabold' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-[#1E2732]'
                    }`}
                  >
                    <div className="truncate space-y-0.5">
                      <p className="font-bold text-xs truncate">{acc.fullName}</p>
                      <p className={`text-[10px] ${isActive ? 'text-slate-200' : 'text-[#5C6773]'}`}>{acc.role.replace('_', ' ')} • {acc.email}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {isActive ? (
                        <Check className="w-4 h-4 text-[#D4A62A]" />
                      ) : (
                        deviceAccounts.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleRemoveAccount(e, acc.id)}
                            aria-label={`Remove account ${acc.fullName} from device`}
                            className="p-1 hover:bg-rose-100 text-rose-500 rounded transition-all"
                            title="Remove account from device"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add / Switch Account Button */}
            <button
              onClick={handleAddAccount}
              aria-label="Add or Switch Another Account"
              className="w-full py-2 bg-white border border-[#1B4B66]/30 hover:border-[#1B4B66] text-[#1B4B66] font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Switch Another Account</span>
            </button>

            {/* Sign Out Action */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleLogout}
                aria-label="Sign Out Session"
                className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 font-extrabold flex items-center gap-2 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Sign Out Session</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* SINGLE NAVIGATION BAR (Bottom Floating Dock) */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/95 border-2 border-[#1B4B66]/30 rounded-full p-2 sm:p-2.5 flex items-center gap-2 sm:gap-3 shadow-2xl backdrop-blur-xl pb-[calc(0.5rem+env(safe-area-inset-bottom))] transition-all duration-300 ease-out">
        {/* CASE A: Visitor / Public Page Navigation */}
        {(isPublicNewCustomerRoute || !isAuthenticated) && (
          <>
            <Link
              to="/"
              aria-label="New Customer Home"
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
              aria-label="How It Works Page"
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
              aria-label="Trust & Legal Center"
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
              aria-label="Login to Wallet"
              className="p-3 sm:p-3.5 rounded-full bg-white border border-[#1B4B66]/30 text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold transition-all shadow-sm flex items-center gap-1.5 text-xs font-['Sora'] cursor-pointer"
              title="Login to Wallet"
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#1B4B66] stroke-[2.5]" />
              <span className="hidden sm:inline font-extrabold">Login</span>
            </button>

            {/* Smooth Animated "Start Saving" Button attached ONLY AFTER hero CTA leaves viewport */}
            <div
              className={`transition-all duration-300 ease-out transform origin-right flex items-center ${
                showStartSavingBtn
                  ? 'max-w-[170px] opacity-100 scale-100 translate-x-0 ml-1'
                  : 'max-w-0 opacity-0 scale-95 translate-x-3 pointer-events-none ml-0 overflow-hidden'
              }`}
            >
              <Link
                to="/kyc"
                aria-label="Start Savings Onboarding"
                className="whitespace-nowrap px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 hover:scale-105 cursor-pointer"
              >
                <span>Start Saving</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </>
        )}

        {/* CASE B: Logged-In Member Single Bottom Navigation Bar */}
        {!isPublicNewCustomerRoute && isAuthenticated && currentUser.role === 'member' && (
          <>
            <Link
              to="/dashboard"
              aria-label="My Wallet Dashboard"
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
              aria-label="Make Monthly Payment"
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
              aria-label="Gift Hampers Catalog"
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
              aria-label="Savings Circles"
              className={`p-3 sm:p-3.5 rounded-full transition-all ${
                location.pathname === '/circles'
                  ? 'bg-[#D4A62A] text-[#1E2732] shadow-glow-gold scale-105 sm:scale-110 font-bold'
                  : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
              }`}
              title="Savings Circles"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </Link>

            {/* Profile Avatar Pill in Single Bottom Navigation Bar */}
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="Account Profile Menu"
              aria-expanded={showProfileMenu}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-white border-2 border-[#1B4B66]/40 hover:border-[#1B4B66] transition-all cursor-pointer shadow-sm"
              title="Profile & Account Menu"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.fullName}
                className="w-6 h-6 rounded-full object-cover shrink-0 border border-[#1B4B66]/40"
              />
              <span className="text-[11px] sm:text-xs font-bold text-[#1E2732] truncate max-w-[70px] sm:max-w-[100px]">
                {currentUser.fullName.split(' ')[0]}
              </span>
              <ChevronUp className={`w-3.5 h-3.5 text-[#5C6773] shrink-0 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>
          </>
        )}

        {/* CASE C: Staff Portals Single Navigation Control */}
        {!isPublicNewCustomerRoute && isAuthenticated && currentUser.role !== 'member' && (
          <>
            {currentUser.role === 'employee' && (
              <Link
                to="/employee"
                aria-label="Employee MRM Dashboard"
                className="px-4 py-2.5 rounded-full bg-[#1B4B66] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Users className="w-4 h-4" />
                <span>Employee MRM</span>
              </Link>
            )}

            {currentUser.role === 'support_agent' && (
              <Link
                to="/support"
                aria-label="Support Desk Portal"
                className="px-4 py-2.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Support Desk</span>
              </Link>
            )}

            {currentUser.role === 'finance_admin' && (
              <Link
                to="/finance"
                aria-label="Finance Admin Portal"
                className="px-4 py-2.5 rounded-full bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
              >
                <DollarSign className="w-4 h-4" />
                <span>Finance Admin</span>
              </Link>
            )}

            {currentUser.role === 'super_admin' && (
              <Link
                to="/admin"
                aria-label="Super Admin Panel"
                className="px-4 py-2.5 rounded-full bg-[#1B4B66] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Super Admin</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              aria-label="Sign Out Session"
              className="p-3 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold cursor-pointer"
              title="Sign Out Staff Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
