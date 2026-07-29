import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, ChevronDown, CheckCircle, ArrowUpRight, Menu, X, Users, LayoutDashboard } from 'lucide-react';
import { store } from '../store';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const currentUser = store.getCurrentUser();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSwitchUser = (userId: string) => {
    store.setCurrentUser(userId);
    setShowRoleDropdown(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 h-16 md:h-20 bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#1B4B66]/20 flex items-center shadow-md">
      <div className="layout-container w-full px-4 md:px-10 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-[#1B4B66] text-[#D4A62A] flex items-center justify-center font-extrabold shadow-md group-hover:scale-105 transition-transform duration-300">
            <Shield className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
          </div>
          <span className="font-['Sora'] font-extrabold text-base md:text-xl tracking-tight text-[#1E2732]">
            Samruddi<span className="text-[#1B4B66]">Save</span>
          </span>
        </Link>

        {/* Center: Desktop Floating Pill Menu */}
        <nav className="hidden lg:flex items-center gap-6 px-6 py-2.5 rounded-full bg-white border border-[#1B4B66]/20 text-xs font-bold text-[#5C6773] shadow-md">
          <Link
            to="/"
            className={`transition-colors hover:text-[#1E2732] ${
              location.pathname === '/' ? 'text-[#1B4B66] font-extrabold' : ''
            }`}
          >
            Home
          </Link>
          <Link
            to="/how-it-works"
            className={`transition-colors hover:text-[#1E2732] ${
              location.pathname === '/how-it-works' ? 'text-[#1B4B66] font-extrabold' : ''
            }`}
          >
            How It Works
          </Link>
          <Link
            to="/hampers"
            className={`transition-colors hover:text-[#1E2732] ${
              location.pathname === '/hampers' ? 'text-[#1B4B66] font-extrabold' : ''
            }`}
          >
            Gift Hampers
          </Link>
          <Link
            to="/employee"
            className={`flex items-center gap-1.5 transition-colors hover:text-[#1E2732] ${
              location.pathname.startsWith('/employee') || location.pathname.startsWith('/mrm') ? 'text-[#1B4B66] font-extrabold' : ''
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#1B4B66]" />
            <span>Employee MRM</span>
          </Link>
          <Link
            to="/admin"
            className={`flex items-center gap-1.5 transition-colors hover:text-[#1E2732] ${
              location.pathname === '/admin' ? 'text-[#1B4B66] font-extrabold' : ''
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#1B4B66]" />
            <span>Admin Portal</span>
          </Link>
          <Link
            to="/trust"
            className={`flex items-center gap-1.5 transition-colors hover:text-[#1E2732] ${
              location.pathname === '/trust' ? 'text-[#1F8A5F] font-extrabold' : ''
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#1F8A5F]" />
            <span>Trust & Legal</span>
          </Link>
        </nav>

        {/* Right Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 p-1 sm:p-1.5 pl-2.5 pr-2 rounded-full bg-white border border-[#1B4B66]/20 hover:border-[#1B4B66]/40 transition-all text-xs font-bold text-[#1E2732] shadow-sm"
            >
              <img src={currentUser.avatar} alt={currentUser.fullName} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover" />
              <span className="hidden sm:inline capitalize text-[11px] md:text-xs">{currentUser.role}</span>
              <ChevronDown className="w-3 h-3 text-[#5C6773]" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-3 w-64 sm:w-72 bg-white border border-[#1B4B66]/20 rounded-3xl p-3.5 shadow-2xl text-[#1E2732] z-50 animate-fade-up space-y-2">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-[#5C6773] uppercase tracking-wider">Demo Role Switcher</p>
                </div>
                <div className="space-y-1">
                  {store.getProfiles().map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSwitchUser(p.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs text-left transition-all ${
                        p.id === currentUser.id
                          ? 'bg-[#1B4B66]/10 text-[#1B4B66] font-bold border border-[#1B4B66]/30'
                          : 'hover:bg-slate-50 text-[#1E2732]'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-xs">{p.fullName}</p>
                        <p className="text-[10px] text-[#5C6773] capitalize">{p.role}</p>
                      </div>
                      {p.id === currentUser.id && <CheckCircle className="w-4 h-4 text-[#1B4B66]" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 text-xs font-bold">
                  <Link
                    to="/employee"
                    onClick={() => setShowRoleDropdown(false)}
                    className="p-2.5 rounded-[12px] bg-[#1B4B66]/10 hover:bg-[#1B4B66]/20 text-[#1B4B66] flex items-center justify-between"
                  >
                    <span>Open Employee MRM</span>
                    <Users className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setShowRoleDropdown(false)}
                    className="p-2.5 rounded-[12px] bg-[#1B4B66] hover:bg-[#123448] text-white flex items-center justify-between"
                  >
                    <span>Open Admin Portal</span>
                    <LayoutDashboard className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/kyc"
            className="hidden sm:flex items-center gap-1.5 px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-[#1B4B66] text-white font-['Sora'] font-extrabold text-xs shadow-md hover:bg-[#123448] transition-all hover:scale-105"
          >
            <span>Start Saving</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-[#1E2732] hover:bg-slate-50 transition-all shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#1E2732]" /> : <Menu className="w-5 h-5 text-[#1E2732]" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 p-6 shadow-2xl space-y-4 animate-fade-up z-50">
          <nav className="flex flex-col space-y-3 font-bold text-sm text-[#1E2732]">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-[#F7F5EF] transition-colors flex items-center justify-between"
            >
              <span>Home</span>
              <ArrowUpRight className="w-4 h-4 text-[#5C6773]" />
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-[#F7F5EF] transition-colors flex items-center justify-between"
            >
              <span>How It Works</span>
              <ArrowUpRight className="w-4 h-4 text-[#5C6773]" />
            </Link>
            <Link
              to="/employee"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-[#F7F5EF] transition-colors flex items-center justify-between text-[#1B4B66]"
            >
              <span>Employee MRM Portal</span>
              <Users className="w-4 h-4" />
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-[#F7F5EF] transition-colors flex items-center justify-between text-[#1B4B66]"
            >
              <span>Super Admin Portal</span>
              <LayoutDashboard className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
