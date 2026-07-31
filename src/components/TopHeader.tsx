import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Lock, LogOut, ChevronDown, ArrowUpRight } from 'lucide-react';
import { store } from '../store';
import { LoginModal } from './LoginModal';

export const TopHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const currentUser = store.getCurrentUser();
  const isAuthenticated = store.getIsAuthenticated();
  const [showDropdown, setShowDropdown] = useState(false);
  const showLoginModal = store.getShowLoginModal();

  const handleLogout = () => {
    store.logoutUser();
    setShowDropdown(false);
    navigate('/');
  };

  // Hide TopHeader on ALL Staff/Admin routes and Login/Console screens
  const isStaffRoute = ['/login', '/console', '/staff-login', '/staff', '/portal', '/admin', '/employee', '/mrm', '/support', '/finance'].some((path) =>
    location.pathname.startsWith(path)
  );

  if (isStaffRoute) {
    return null;
  }

  // Unauthenticated Visitor Header (Public Pages: /, /how-it-works, /trust, /kyc, /plans)
  if (!isAuthenticated || !currentUser) {
    return (
      <>
        <header className="sticky top-0 z-40 h-12 sm:h-14 bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#1B4B66]/15 flex items-center px-2.5 sm:px-6 shadow-sm overflow-hidden w-full">
          <div className="layout-container w-full flex items-center justify-between gap-1.5 sm:gap-4 overflow-hidden">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-[#1B4B66] text-[#D4A62A] flex items-center justify-center font-extrabold shadow-sm shrink-0">
                <Shield className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-[#Sora] font-extrabold text-xs sm:text-base tracking-tight text-[#1E2732] whitespace-nowrap">
                Samruddi<span className="text-[#1B4B66]">Save</span>
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => store.openLoginModal()}
                className="px-3 sm:px-4 py-1.5 rounded-full bg-white border border-[#1B4B66]/20 hover:border-[#1B4B66] text-[#1B4B66] font-['Sora'] font-bold text-[11px] sm:text-xs transition-all flex items-center gap-1 cursor-pointer shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-[#1B4B66]" />
                <span>Login</span>
              </button>

              <Link
                to="/kyc"
                className="px-3.5 sm:px-5 py-1.5 rounded-full bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-[11px] sm:text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Start Saving</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D4A62A]" />
              </Link>
            </div>
          </div>
        </header>

        {showLoginModal && <LoginModal isOpen={showLoginModal} onClose={() => store.closeLoginModal()} />}
      </>
    );
  }

  // Authenticated Member / Staff Header
  return (
    <header className="sticky top-0 z-40 h-12 sm:h-14 bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#1B4B66]/15 flex items-center px-2.5 sm:px-6 shadow-sm w-full">
      <div className="layout-container w-full flex items-center justify-between gap-1.5 sm:gap-4">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#1B4B66] text-[#D4A62A] flex items-center justify-center font-extrabold shadow-sm shrink-0">
            <Shield className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-['Sora'] font-extrabold text-xs sm:text-base tracking-tight text-[#1E2732] whitespace-nowrap">
            Samruddi<span className="text-[#1B4B66]">Save</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-white border border-[#1B4B66]/30 hover:border-[#1B4B66] transition-all cursor-pointer shadow-sm"
          >
            <img src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} alt={currentUser.fullName} className="w-6 h-6 rounded-full object-cover shrink-0 border border-[#1B4B66]/40" />
            <span className="text-[11px] sm:text-xs font-bold text-[#1E2732] truncate max-w-[80px] sm:max-w-[120px]">
              {currentUser.fullName.split(' ')[0]}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#5C6773] shrink-0 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <>
              {/* Backdrop listener to close dropdown on outside click */}
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />

              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-3 z-50 text-xs animate-fade-down space-y-2 text-[#1E2732]">
                <div className="px-4 py-2 border-b border-slate-100 space-y-0.5">
                  <p className="font-extrabold text-sm text-[#1E2732] truncate">{currentUser.fullName}</p>
                  <p className="text-[10px] text-[#1B4B66] uppercase tracking-wider font-extrabold">{currentUser.role.replace('_', ' ')}</p>
                  {currentUser.email && <p className="text-[11px] text-[#5C6773] truncate font-mono">{currentUser.email}</p>}
                </div>

                {currentUser.role === 'member' && (
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 hover:bg-slate-50 font-bold text-[#1E2732]"
                  >
                    Profile & Account Settings
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-extrabold flex items-center gap-2 cursor-pointer border-t border-slate-100 pt-2"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
