import React from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { Navbar } from './components/Navbar.js';
import { RoleSwitcher } from './components/RoleSwitcher.js';
import { Footer } from './components/Footer.js';
import { ToastContainer } from './components/Toast.js';

import { LandingPage } from './pages/LandingPage.js';
import { MarketplacePage } from './pages/MarketplacePage.js';
import { GigDetailsPage } from './pages/GigDetailsPage.js';
import { PostGigPage } from './pages/PostGigPage.js';
import { BookGigPage } from './pages/BookGigPage.js';
import { CreatorDashboardPage } from './pages/CreatorDashboardPage.js';
import { MyBookingsPage } from './pages/MyBookingsPage.js';
import { EmptyState } from './components/EmptyState.js';

const RouterView: React.FC = () => {
  const { currentPath, navigate } = useApp();
  const path = currentPath.split('?')[0].replace(/\/+$/, '') || '/';

  // Root Landing
  if (path === '/' || path === '') {
    return <LandingPage />;
  }

  // Marketplace
  if (path === '/marketplace') {
    return <MarketplacePage />;
  }

  // Post Gig
  if (path === '/post-gig') {
    return <PostGigPage />;
  }

  // Creator Dashboard
  if (path === '/creator-dashboard') {
    return <CreatorDashboardPage />;
  }

  // My Bookings
  if (path === '/my-bookings') {
    return <MyBookingsPage />;
  }

  // Booking Page: /book/:gigId
  const bookMatch = path.match(/^\/book\/([^/]+)$/);
  if (bookMatch) {
    return <BookGigPage gigId={bookMatch[1]} />;
  }

  // Gig Details: /gigs/:id
  const gigMatch = path.match(/^\/gigs\/([^/]+)$/);
  if (gigMatch) {
    return <GigDetailsPage gigId={gigMatch[1]} />;
  }

  // Fallback 404
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <EmptyState
        title="Page Not Found"
        description="The page you requested does not exist in CreatorHub."
        actionText="Back to Marketplace"
        onAction={() => navigate('/marketplace')}
        secondaryActionText="Go Home"
        onSecondaryAction={() => navigate('/')}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Role & Persona Switcher Banner (Anti-Auth requirement) */}
        <RoleSwitcher />

        {/* Global Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          <RouterView />
        </main>

        {/* Global Floating Toast Alerts */}
        <ToastContainer />

        {/* Global Footer */}
        <Footer />
      </div>
    </AppProvider>
  );
}
