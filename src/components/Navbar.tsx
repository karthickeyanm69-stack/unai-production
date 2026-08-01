import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, ChevronDown, CheckCircle, ArrowUpRight, Menu, X, Users, LayoutDashboard, Lock, DollarSign, MessageSquare, LogOut, Wallet, Gift, Home } from 'lucide-react';
import { store } from '../store';
import { LoginModal } from './LoginModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = store.getCurrentUser();
  const isAuthenticated = store.getIsAuthenticated();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSwitchUser = (userId: string) => {
    store.setCurrentUser(userId);
    setShowRoleDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    store.logoutUser();
    setShowRoleDropdown(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-16 md:h-20 bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#1B4B66]/20 flex items-center shadow-md">
        <div className="layout-container w-full px-4 md:px-10 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-[#1B4B66] text-[#D4A62A] flex items-center justify-center font-extrabold shadow-md group-hover:scale-105 transition-transform duration-300">
              <Shield className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Sora'] font-extrabold text-base md:text-xl tracking-tight text-[#1E2732]">
                Samruddi<span className="text-[#1B4B66]">Save</span>
              </span>
              {isAuthenticated && currentUser.role === 'employee' && (
                <span className="text-[10px] font-extrabold text-[#D4A62A] uppercase tracking-wider -mt-1">Admin Console</span>
              )}
            </div>
          </Link>

          {/* Center Links (Filtered strictly by Authentication State) */}
          <nav className="hidden lg:flex items-center gap-6 font-bold text-xs text-[#5C6773]">
            {/* Case B: Logged-In Member / Customer */}
            {isAuthenticated && currentUser.role === 'member' && (
              <>
                <Link to="/dashboard" className={`hover:text-[#1B4B66] flex items-center gap-1.5 ${location.pathname === '/dashboard' ? 'text-[#1B4B66] font-extrabold' : ''}`}>
                  <Wallet className="w-4 h-4 text-[#1B4B66]" />
                  <span>My Wallet</span>
                </Link>
                <Link to="/ledger" className={`hover:text-[#1B4B66] ${location.pathname === '/ledger' ? 'text-[#1B4B66] font-extrabold' : ''}`}>Savings Ledger</Link>
                <Link to="/hampers" className={`hover:text-[#1B4B66] flex items-center gap-1.5 ${location.pathname === '/hampers' ? 'text-[#1B4B66] font-extrabold' : ''}`}>
                  <Gift className="w-4 h-4 text-[#D4A62A]" />
                  <span>Gift Hampers</span>
                </Link>
                <Link to="/circles" className={`hover:text-[#1B4B66] ${location.pathname === '/circles' ? 'text-[#1B4B66] font-extrabold' : ''}`}>Savings Circles</Link>
              </>
            )}

            {/* Case C: Admin / Employee Portal */}
            {isAuthenticated && currentUser.role === 'employee' && (
              <Link
                to="/employee"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1B4B66] text-white shadow-sm font-extrabold text-xs"
              >
                <Users className="w-4 h-4 text-[#D4A62A]" />
                <span>Admin / Employee Portal</span>
              </Link>
            )}
          </nav>

          {/* Right Actions & Login / Profile Header */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!isAuthenticated ? (
              <button
                onClick={() => store.openLoginModal()}
                className="flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-white border border-[#1B4B66]/30 text-[#1B4B66] hover:bg-[#1B4B66]/5 font-['Sora'] font-extrabold text-xs shadow-sm transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-[#1B4B66]" />
                <span>Portal Sign In</span>
              </button>
            ) : (
              /* Logged In Member Profile Badge */
              <div className="relative flex items-center gap-3">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-2 p-1 sm:p-1.5 pl-2.5 pr-2 rounded-full bg-white border border-[#1B4B66]/20 hover:border-[#1B4B66]/40 transition-all text-xs font-bold text-[#1E2732] shadow-sm"
                >
                  <img src={currentUser.avatar} alt={currentUser.fullName} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-[#1B4B66]" />
                  <span className="hidden sm:inline capitalize text-[11px] md:text-xs font-bold">{currentUser.fullName.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5C6773]" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 top-12 w-64 sm:w-72 bg-white border border-[#1B4B66]/20 rounded-3xl p-3.5 shadow-2xl text-[#1E2732] z-50 animate-fade-up space-y-2">
                    <div className="px-3 py-1.5 border-b border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-[#5C6773] uppercase tracking-wider">Active Session</p>
                        <p className="font-bold text-xs text-[#1E2732]">{currentUser.fullName}</p>
                        <p className="text-[10px] text-[#1F8A5F] capitalize font-extrabold">
                          {currentUser.role === 'employee' ? 'Admin Operations Officer' : 'Customer Account'}
                        </p>
                      </div>
                      <button onClick={handleLogout} title="Sign Out" className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                        <LogOut className="w-4 h-4 text-rose-500" />
                      </button>
                    </div>

                    {currentUser.role === 'member' && (
                      <div className="pt-1">
                        <Link
                          to="/profile"
                          onClick={() => setShowRoleDropdown(false)}
                          className="block px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 text-[#1E2732]"
                        >
                          Profile Settings
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-[#1E2732] hover:bg-slate-50 transition-all shadow-sm"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 md:top-20 bg-white border-b border-slate-200 p-6 shadow-2xl space-y-4 animate-fade-up z-50">
            <nav className="flex flex-col space-y-3 font-bold text-sm text-[#1E2732]">
              {!isAuthenticated ? (
                <button onClick={() => { setMobileMenuOpen(false); store.openLoginModal(); }} className="p-3 rounded-xl bg-[#1B4B66] text-white text-left font-bold">
                  Portal Sign In
                </button>
              ) : currentUser.role === 'employee' ? (
                <>
                  <Link to="/employee" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-[#1B4B66]/10 text-[#1B4B66] font-bold">
                    Admin Operations Portal
                  </Link>
                  <button onClick={handleLogout} className="p-3 rounded-xl bg-rose-50 text-rose-700 text-left font-bold">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl hover:bg-[#F7F5EF]">My Wallet</Link>
                  <Link to="/ledger" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl hover:bg-[#F7F5EF]">Savings Ledger</Link>
                  <Link to="/hampers" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl hover:bg-[#F7F5EF]">Gift Hampers</Link>
                  <button onClick={handleLogout} className="p-3 rounded-xl bg-rose-50 text-rose-700 text-left font-bold">
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
