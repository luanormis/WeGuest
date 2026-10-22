import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { PublicWeddingSite } from './components/PublicWeddingSite';
import { CoupleDashboard } from './components/CoupleDashboard';
import { SuperAdminPortal } from './components/SuperAdminPortal';
import { CheckoutDemoView } from './components/CheckoutDemoView';
import { LegalCenter } from './components/LegalCenter';
import { SupabaseSqlCard } from './components/SupabaseSqlCard';
import { GetnetCheckoutModal } from './components/GetnetCheckoutModal';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { ToastContainer } from './components/ToastContainer';
import { DemoAccessGate } from './components/DemoAccessGate';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-1">
        {activeView === 'public_site' && <PublicWeddingSite />}
        {activeView === 'couple_dashboard' && <CoupleDashboard />}
        {activeView === 'super_admin' && <SuperAdminPortal />}
        {activeView === 'checkout_demo' && <CheckoutDemoView />}
        {activeView === 'legal_center' && <LegalCenter />}
        {activeView === 'supabase_schema' && <SupabaseSqlCard />}
      </main>

      <GetnetCheckoutModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <DemoAccessGate>
      <AppProvider>
        <MobileFrameWrapper>
          <MainContent />
        </MobileFrameWrapper>
      </AppProvider>
    </DemoAccessGate>
  );
}
