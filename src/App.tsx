import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';
import { TopHeader } from './components/TopHeader';
import { BottomNavDock } from './components/BottomNavDock';
import { RoleGuard } from './components/RoleGuard';
import { LoginModal } from './components/LoginModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { TrustCenterPage } from './pages/TrustCenterPage';
import { DashboardPage } from './pages/DashboardPage';
import { KYCPage } from './pages/KYCPage';
import { PlanSelectionPage } from './pages/PlanSelectionPage';
import { PaymentSetupPage } from './pages/PaymentSetupPage';
import { MakePaymentPage } from './pages/MakePaymentPage';
import { LedgerPage } from './pages/LedgerPage';
import { HamperSelectionPage } from './pages/HamperSelectionPage';
import { SavingsCirclesPage } from './pages/SavingsCirclesPage';
import { MemberProfileSettingsPage } from './pages/member/MemberProfileSettingsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { SupportPortalPage } from './pages/support/SupportPortalPage';
import { FinanceAdminPortalPage } from './pages/finance/FinanceAdminPortalPage';

// Simple 404 Not Found page
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-[#F7F5EF] flex flex-col items-center justify-center gap-4 text-[#1E2732] p-8">
    <div className="text-6xl font-['Sora'] font-black text-[#1B4B66]">404</div>
    <h1 className="text-xl font-['Sora'] font-extrabold">Page Not Found</h1>
    <p className="text-sm text-[#5C6773] font-medium text-center max-w-xs">
      The URL you entered doesn't exist. You may have mistyped it.
    </p>
    <a href="/" className="mt-2 px-6 py-2.5 bg-[#1B4B66] text-white rounded-full text-sm font-bold hover:bg-[#123448] transition-all">
      Go to Home
    </a>
  </div>
);

export const App: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const isGlobalLoginOpen = store.getShowLoginModal();
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#F7F5EF] text-[#1E2732] font-['Inter'] w-full max-w-full overflow-x-hidden">
        <TopHeader />

        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          <Routes>
            {/* ──────────────────────────────────────────
                1. PUBLIC PAGES — No auth needed
            ────────────────────────────────────────── */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/trust" element={<TrustCenterPage />} />
            <Route path="/kyc" element={<KYCPage />} />
            <Route path="/plans" element={<PlanSelectionPage />} />

            {/* ──────────────────────────────────────────
                2. STAFF & ADMIN CONSOLE LOGIN
                RoleGuard auto-redirects authenticated users
                to their correct dashboard. If unauthenticated,
                it renders the sign-in screen at /login.
            ────────────────────────────────────────── */}
            <Route
              path="/login"
              element={
                <RoleGuard allowedRoles={['employee', 'support_agent', 'finance_admin', 'super_admin']}>
                  {/* RoleGuard redirects authenticated staff to their dashboard.
                      This fallback child is never rendered when authenticated. */}
                  <Navigate to="/" replace />
                </RoleGuard>
              }
            />
            {/* Aliases for /login */}
            <Route path="/console" element={<Navigate to="/login" replace />} />
            <Route path="/staff" element={<Navigate to="/login" replace />} />
            <Route path="/staff-login" element={<Navigate to="/login" replace />} />
            <Route path="/portal" element={<Navigate to="/login" replace />} />

            {/* ──────────────────────────────────────────
                3. EMPLOYEE MRM DASHBOARD
                Guards: employee, super_admin only
            ────────────────────────────────────────── */}
            <Route
              path="/employee"
              element={
                <RoleGuard allowedRoles={['employee', 'super_admin']}>
                  <EmployeeDashboard />
                </RoleGuard>
              }
            />
            <Route path="/mrm" element={<Navigate to="/employee" replace />} />
            <Route path="/mrm/*" element={<Navigate to="/employee" replace />} />

            {/* ──────────────────────────────────────────
                4. SUPPORT DESK PORTAL
                Guards: support_agent, super_admin only
            ────────────────────────────────────────── */}
            <Route
              path="/support"
              element={
                <RoleGuard allowedRoles={['support_agent', 'super_admin']}>
                  <SupportPortalPage />
                </RoleGuard>
              }
            />

            {/* ──────────────────────────────────────────
                5. FINANCE ESCROW PORTAL
                Guards: finance_admin, super_admin only
            ────────────────────────────────────────── */}
            <Route
              path="/finance"
              element={
                <RoleGuard allowedRoles={['finance_admin', 'super_admin']}>
                  <FinanceAdminPortalPage />
                </RoleGuard>
              }
            />

            {/* ──────────────────────────────────────────
                6. SUPER ADMIN EXECUTIVE PANEL
                Guards: super_admin only
            ────────────────────────────────────────── */}
            <Route
              path="/admin"
              element={
                <RoleGuard allowedRoles={['super_admin']}>
                  <AdminPanelPage />
                </RoleGuard>
              }
            />

            {/* 7. MEMBER PAYMENT & SAVINGS WALLET ROUTES */}
            <Route
              path="/dashboard"
              element={
                <RoleGuard allowedRoles={['member', 'super_admin']}>
                  <DashboardPage />
                </RoleGuard>
              }
            />
            <Route
              path="/payment-setup"
              element={
                <RoleGuard allowedRoles={['member', 'super_admin']}>
                  <PaymentSetupPage />
                </RoleGuard>
              }
            />
            <Route
              path="/pay"
              element={
                <RoleGuard allowedRoles={['member', 'super_admin']}>
                  <MakePaymentPage />
                </RoleGuard>
              }
            />
            <Route
              path="/ledger"
              element={
                <RoleGuard allowedRoles={['member', 'super_admin']}>
                  <LedgerPage />
                </RoleGuard>
              }
            />
            <Route
              path="/hampers"
              element={
                <RoleGuard allowedRoles={['member', 'super_admin']}>
                  <HamperSelectionPage />
                </RoleGuard>
              }
            />
            <Route
              path="/circles"
              element={
                <RoleGuard allowedRoles={['member', 'super_admin']}>
                  <SavingsCirclesPage />
                </RoleGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <RoleGuard allowedRoles={['member', 'super_admin']}>
                  <MemberProfileSettingsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/settings"
              element={
                <RoleGuard allowedRoles={['member', 'super_admin']}>
                  <MemberProfileSettingsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/notifications"
              element={
                <RoleGuard allowedRoles={['member', 'super_admin']}>
                  <MemberProfileSettingsPage />
                </RoleGuard>
              }
            />

            {/* ──────────────────────────────────────────
                8. CATCH-ALL 404 — for mistyped URLs like /dashboad
            ────────────────────────────────────────── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <BottomNavDock />
        <LoginModal isOpen={isGlobalLoginOpen} onClose={() => store.closeLoginModal()} />
      </div>
    </Router>
  );
};

export default App;
