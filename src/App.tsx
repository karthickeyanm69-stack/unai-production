import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';
import { TopHeader } from './components/TopHeader';
import { BottomNavDock } from './components/BottomNavDock';
import { RoleGuard, StaffSignInForm } from './components/RoleGuard';
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

// Home redirect router based on active authentication and role
const HomeRedirect: React.FC = () => {
  const isAuthenticated = store.getIsAuthenticated();
  if (!isAuthenticated) {
    return <StaffSignInForm />;
  }
  const user = store.getCurrentUser();
  if (user.role === 'employee') {
    return <Navigate to="/employee" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

// Simple 404 Not Found page
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-[#F7F5EF] flex flex-col items-center justify-center gap-4 text-[#1E2732] p-8">
    <div className="text-6xl font-['Sora'] font-black text-[#1B4B66]">404</div>
    <div className="text-[#5C6773] text-sm font-bold">Page Not Found</div>
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
                1. PUBLIC WEBSITE & PORTAL LOGIN
            ────────────────────────────────────────── */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<StaffSignInForm />} />
            <Route path="/staff-login" element={<StaffSignInForm />} />
            <Route path="/admin-login" element={<StaffSignInForm />} />
            <Route path="/employee-login" element={<StaffSignInForm />} />
            <Route path="/how-it-works" element={<Navigate to="/" replace />} />
            <Route path="/trust" element={<Navigate to="/" replace />} />
            <Route path="/kyc" element={<Navigate to="/" replace />} />
            <Route path="/plans" element={<Navigate to="/" replace />} />
            <Route path="/console" element={<Navigate to="/staff-login" replace />} />
            <Route path="/staff" element={<Navigate to="/staff-login" replace />} />
            <Route path="/portal" element={<Navigate to="/staff-login" replace />} />

            {/* ──────────────────────────────────────────
                2. ADMIN & EMPLOYEE PORTAL
            ────────────────────────────────────────── */}
            <Route
              path="/employee"
              element={
                <RoleGuard allowedRoles={['employee']}>
                  <EmployeeDashboard />
                </RoleGuard>
              }
            />
            <Route path="/admin" element={<Navigate to="/employee" replace />} />
            <Route path="/admin/*" element={<Navigate to="/employee" replace />} />
            <Route path="/mrm" element={<Navigate to="/employee" replace />} />
            <Route path="/mrm/*" element={<Navigate to="/employee" replace />} />
            <Route path="/support" element={<Navigate to="/employee" replace />} />
            <Route path="/finance" element={<Navigate to="/employee" replace />} />

            {/* ──────────────────────────────────────────
                3. CUSTOMER / USER PORTAL ROUTES
            ────────────────────────────────────────── */}
            <Route
              path="/dashboard"
              element={
                <RoleGuard allowedRoles={['member']}>
                  <DashboardPage />
                </RoleGuard>
              }
            />
            <Route path="/payment-setup" element={<Navigate to="/pay" replace />} />
            <Route
              path="/pay"
              element={
                <RoleGuard allowedRoles={['member']}>
                  <MakePaymentPage />
                </RoleGuard>
              }
            />
            <Route
              path="/ledger"
              element={
                <RoleGuard allowedRoles={['member']}>
                  <LedgerPage />
                </RoleGuard>
              }
            />
            <Route
              path="/hampers"
              element={
                <RoleGuard allowedRoles={['member']}>
                  <HamperSelectionPage />
                </RoleGuard>
              }
            />
            <Route
              path="/circles"
              element={
                <RoleGuard allowedRoles={['member']}>
                  <SavingsCirclesPage />
                </RoleGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <RoleGuard allowedRoles={['member']}>
                  <MemberProfileSettingsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/settings"
              element={
                <RoleGuard allowedRoles={['member']}>
                  <MemberProfileSettingsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/notifications"
              element={
                <RoleGuard allowedRoles={['member', 'employee']}>
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
