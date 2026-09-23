import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PingsProvider, usePings } from './context/PingsContext';
import { ChatProvider } from './context/ChatContext';
import { ShopProvider } from './context/ShopContext';
import { ToastProvider } from './context/ToastContext';
import { AIContextContainer } from './context/AIContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { StoreMarquee } from './components/landing/StoreMarquee';
import { CategoryShowcase } from './components/landing/CategoryShowcase';
import { DealOfTheDay } from './components/landing/DealOfTheDay';
import { MessagingPreview } from './components/landing/MessagingPreview';
import { AIPreview } from './components/landing/AIPreview';
import { ShopPreview } from './components/landing/ShopPreview';
import { LandingCTA } from './components/landing/LandingCTA';

import { SignInPage } from './components/auth/SignInPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { CursorFollow } from './components/smoothui/cursor-follow/CursorFollow';

import { MainLayout } from './components/layout/MainLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { ChatView } from './components/chat/ChatView';
import { ShopView } from './components/shop/ShopView';
import { ConnectView } from './components/connect/ConnectView';
import { GalleryView } from './components/gallery/GalleryView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { AboutView } from './components/about/AboutView';
import { PingsView } from './components/pings/PingsView';
import { AIView } from './components/ai/AIView';
import { ExploreView } from './components/explore/ExploreView';

import { FloatingAIBubble } from './components/ai/FloatingAIBubble';
import { AIPopupPanel } from './components/ai/AIPopupPanel';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/shop/CartDrawer';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'login' | 'register' | 'app'
  const [activeTab, setActiveTab] = useState('home');

  const handleNavigateToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode = 'login') => {
    if (user) {
      setCurrentView('app');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView(mode === 'register' ? 'register' : 'login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterApp = (targetTab = 'home') => {
    if (typeof targetTab === 'string') {
      setActiveTab(targetTab);
    }
    if (user) {
      setCurrentView('app');
    } else {
      handleOpenAuth('login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Enforce security guard: Do not open dashboard directly without signing in
  React.useEffect(() => {
    if (currentView === 'app' && !user) {
      setCurrentView('login');
    }
  }, [currentView, user]);

  return (
    <AIContextContainer activeTab={activeTab} activeChat={null} activeProduct={null}>
      {/* ── View 1: Dedicated Sign In Page ── */}
      {currentView === 'login' && (
        <SignInPage
          onNavigateToLanding={handleNavigateToLanding}
          onNavigateToRegister={() => setCurrentView('register')}
          onAuthSuccess={() => {
            setCurrentView('app');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* ── View 2: Dedicated Register Page ── */}
      {currentView === 'register' && (
        <RegisterPage
          onNavigateToLanding={handleNavigateToLanding}
          onNavigateToLogin={() => setCurrentView('login')}
          onAuthSuccess={() => {
            setCurrentView('app');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* ── View 3: Executive User Dashboard & Workspace ── */}
      {currentView === 'app' && (
        <MainLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigateToLanding={handleNavigateToLanding}
        >
          {activeTab === 'home' && <DashboardView setActiveTab={setActiveTab} />}
          {activeTab === 'explore' && <ExploreView />}
          {activeTab === 'chats' && <ChatView />}
          {activeTab === 'shop' && <ShopView />}
          {activeTab === 'connect' && <ConnectView />}
          {activeTab === 'gallery' && <GalleryView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'about' && <AboutView />}
          {activeTab === 'pings' && <PingsView />}
          {activeTab === 'ai' && <AIView />}
        </MainLayout>
      )}

      {/* ── View 4: Differentiated Landing Page (Light Mode Only) ── */}
      {currentView === 'landing' && (
        <CursorFollow className="min-h-screen text-slate-900 font-sans relative bg-white">
          <Navbar
            onEnterApp={() => handleEnterApp('home')}
            onOpenAuth={handleOpenAuth}
            onNavigateToLanding={handleNavigateToLanding}
            isLoggedIn={!!user}
          />
          <HeroSection
            onEnterApp={() => handleEnterApp('home')}
            onOpenAuth={handleOpenAuth}
          />
          <StoreMarquee />
          <CategoryShowcase onEnterApp={() => handleEnterApp('shop')} />
          <DealOfTheDay onEnterApp={() => handleEnterApp('shop')} />
          <MessagingPreview onEnterApp={() => handleEnterApp('chats')} />
          <AIPreview onEnterApp={() => handleEnterApp('ai')} />
          <ShopPreview onEnterApp={() => handleEnterApp('shop')} />
          <LandingCTA onOpenAuth={handleOpenAuth} />
          <Footer onEnterApp={() => handleEnterApp('home')} />
        </CursorFollow>
      )}

      {/* Smart Assistant Launcher & Popup with Outside-Click Auto-Close */}
      <FloatingAIBubble />
      <AIPopupPanel />
      <ToastContainer />
      <CartDrawer />
    </AIContextContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <PingsProvider>
            <ShopBridgeProvider />
          </PingsProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function ShopBridgeProvider() {
  const { addPing } = usePings();
  return (
    <ShopProvider onAddPing={addPing}>
      <ChatBridgeProvider />
    </ShopProvider>
  );
}

function ChatBridgeProvider() {
  const { addPing } = usePings();
  return (
    <ChatProvider onAddPing={addPing}>
      <AppContent />
    </ChatProvider>
  );
}
