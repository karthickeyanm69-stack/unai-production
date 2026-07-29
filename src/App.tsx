import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BottomNavDock } from './components/BottomNavDock';

// Pages
import { LandingPage } from './pages/LandingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { TrustCenterPage } from './pages/TrustCenterPage';
import { KYCPage } from './pages/KYCPage';
import { PlanSelectionPage } from './pages/PlanSelectionPage';
import { PaymentSetupPage } from './pages/PaymentSetupPage';
import { MakePaymentPage } from './pages/MakePaymentPage';
import { DashboardPage } from './pages/DashboardPage';
import { LedgerPage } from './pages/LedgerPage';
import { HamperSelectionPage } from './pages/HamperSelectionPage';
import { SavingsCirclesPage } from './pages/SavingsCirclesPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { MRMDashboardPage } from './pages/mrm/MRMDashboardPage';
import { MemberProfilePage } from './pages/mrm/MemberProfilePage';
import { SupportAgentPage } from './pages/SupportAgentPage';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#F7F5EF] text-[#1E2732] font-['Inter']">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/trust" element={<TrustCenterPage />} />
            <Route path="/kyc" element={<KYCPage />} />
            <Route path="/plans" element={<PlanSelectionPage />} />
            <Route path="/payment-setup" element={<PaymentSetupPage />} />
            <Route path="/pay" element={<MakePaymentPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ledger" element={<LedgerPage />} />
            <Route path="/hampers" element={<HamperSelectionPage />} />
            <Route path="/circles" element={<SavingsCirclesPage />} />
            <Route path="/admin" element={<AdminPanelPage />} />
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/mrm" element={<MRMDashboardPage />} />
            <Route path="/mrm/member/:id" element={<MemberProfilePage />} />
            <Route path="/support" element={<SupportAgentPage />} />
          </Routes>
        </main>
        <BottomNavDock />
      </div>
    </Router>
  );
};

export default App;
