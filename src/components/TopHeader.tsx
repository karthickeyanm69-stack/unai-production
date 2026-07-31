import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Lock, LogOut, ChevronDown, ArrowUpRight, Check, Plus, Trash2 } from 'lucide-react';
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

  const deviceAccounts = store.getDeviceAccounts();

  const handleSwitchAccount = (email: string, role: string) => {
    store.loginUser(email, '1234');
    setShowDropdown(false);
    if (role === 'member') navigate('/dashboard');
    else if (role === 'employee') navigate('/employee');
    else if (role === 'support_agent') navigate('/support');
    else if (role === 'finance_admin') navigate('/finance');
    else if (role === 'super_admin') navigate('/admin');
  };

  const handleAddAccount = () => {
    setShowDropdown(false);
    store.openLoginModal();
  };

  const handleRemoveAccount = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    store.removeDeviceAccount(id);
  };

  // Hide TopHeader on ALL Staff/Admin routes and Login/Console screens
  const isStaffRoute = ['/login', '/console', '/staff-login', '/staff', '/portal', '/admin', '/employee', '/mrm', '/support', '/finance'].some((path) =>
    location.pathname.startsWith(path)
  );

  if (isStaffRoute) {
    return null;
  }

  // Unauthenticated Visitor Header
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

  // Authenticated Header
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
            className="flex items-center gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-full bg-white border border-[#1B4B66]/30 hover:border-[#1B4B66] transition-all cursor-pointer shadow-sm"
          >
            <img src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} alt={currentUser.fullName} className="w-6 h-6 rounded-full object-cover shrink-0 border border-[#1B4B66]/40" />
            <span className="text-[11px] sm:text-xs font-bold text-[#1E2732] truncate max-w-[90px] sm:max-w-[130px]">
              {currentUser.fullName.split(' ')[0]}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#5C6773] shrink-0 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <>
              {/* Backdrop listener */}
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />

              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl py-3 z-50 text-xs animate-fade-down space-y-2 text-[#1E2732] max-h-[85vh] overflow-y-auto">
                
                {/* 1. Active User Card Header */}
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
                  <div className="space-y-0.5 truncate">
                    <p className="font-extrabold text-sm text-[#1E2732] truncate">{currentUser.fullName}</p>
                    <p className="text-[10px] text-[#1B4B66] uppercase tracking-wider font-extrabold">{currentUser.role.replace('_', ' ')}</p>
                    {currentUser.email && <p className="text-[11px] text-[#5C6773] truncate font-mono">{currentUser.email}</p>}
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-ping" title="Session Active" />
                </div>

                {/* 2. List of Saved Accounts on THIS Device Only */}
                <div className="px-3 space-y-1 max-h-60 overflow-y-auto pt-1">
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

                {/* 3. Add or Switch Another Account CTA */}
                <div className="px-3 pt-1">
                  <button
                    onClick={handleAddAccount}
                    className="w-full py-2.5 bg-white border border-[#1B4B66]/30 hover:border-[#1B4B66] text-[#1B4B66] font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add / Switch Another Account</span>
                  </button>
                </div>

                {/* 4. Sign Out Action */}
                <div className="pt-2 border-t border-slate-100 px-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 font-extrabold flex items-center gap-2 rounded-xl transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign Out Session</span>
                  </button>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
