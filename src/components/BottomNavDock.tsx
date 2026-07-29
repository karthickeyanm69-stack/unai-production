import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, Send, Gift, Users } from 'lucide-react';

export const BottomNavDock: React.FC = () => {
  const location = useLocation();

  // Hide floating dock on Admin and Employee portals if desired, but keep visible on user dashboard routes
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/employee')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white border-2 border-[#1B4B66]/30 rounded-full p-2 sm:p-2.5 flex items-center gap-2 sm:gap-3 shadow-2xl backdrop-blur-xl pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <Link
        to="/dashboard"
        className={`p-3 sm:p-3.5 rounded-full transition-all ${
          location.pathname === '/dashboard'
            ? 'bg-[#D4A62A] text-[#1E2732] shadow-glow-gold scale-105 sm:scale-110 font-bold'
            : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
        }`}
        title="Dashboard"
      >
        <Home className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
      </Link>
      <Link
        to="/payment-setup"
        className={`p-3 sm:p-3.5 rounded-full transition-all ${
          location.pathname === '/payment-setup'
            ? 'bg-[#D4A62A] text-[#1E2732] shadow-glow-gold scale-105 sm:scale-110 font-bold'
            : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
        }`}
        title="Digital Stack Cards"
      >
        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
      </Link>
      <Link
        to="/pay"
        className={`p-3 sm:p-3.5 rounded-full transition-all ${
          location.pathname === '/pay'
            ? 'bg-[#1F8A5F] text-white shadow-lg scale-105 sm:scale-110 font-bold'
            : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
        }`}
        title="Make Payment"
      >
        <Send className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
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
        to="/hampers"
        className={`p-3 sm:p-3.5 rounded-full transition-all ${
          location.pathname === '/hampers'
            ? 'bg-[#D4A62A] text-[#1E2732] shadow-glow-gold scale-105 sm:scale-110 font-bold'
            : 'text-[#1B4B66] hover:bg-[#1B4B66]/10 font-bold'
        }`}
        title="Gift Hampers"
      >
        <Gift className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
      </Link>
    </div>
  );
};
