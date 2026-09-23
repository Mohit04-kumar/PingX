import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PingsProvider, usePings } from './context/PingsContext';
import { ChatProvider } from './context/ChatContext';
import { ShopProvider } from './context/ShopContext';
import { ToastProvider } from './context/ToastContext';
import { AIContextContainer } from './context/AIContext';
import { SmoothScrollProvider } from './context/SmoothScrollContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { StoreMarquee } from './components/landing/StoreMarquee';
import { HowItWorks } from './components/landing/HowItWorks';
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
  
  // Resolve initial view from browser URL pathname
  const getInitialView = () => {
    if (typeof window === 'undefined') return 'landing';
    const path = window.location.pathname.toLowerCase();
    if (path === '/signin' || path === '/login') return 'login';
    if (path === '/register' || path === '/signup') return 'register';
    if (path === '/app' || path === '/dashboard') return user ? 'app' : 'login';
    return 'landing';
  };

  const [currentView, setCurrentView] = useState(getInitialView);
  const [activeTab, setActiveTab] = useState('home');

  // Synchronize browser history and path changes
  const navigateTo = (view, path = '/') => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/signin' || path === '/login') {
        setCurrentView('login');
      } else if (path === '/register' || path === '/signup') {
        setCurrentView('register');
      } else if (path === '/app' || path === '/dashboard') {
        setCurrentView(user ? 'app' : 'login');
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  const handleNavigateToLanding = () => {
    navigateTo('landing', '/');
  };

  const handleOpenAuth = (mode = 'login') => {
    if (mode === 'register') {
      navigateTo('register', '/register');
    } else {
      navigateTo('login', '/signin');
    }
  };

  const handleEnterApp = (targetTab = 'home') => {
    if (typeof targetTab === 'string') {
      setActiveTab(targetTab);
    }
    if (user) {
      navigateTo('app', '/app');
    } else {
      navigateTo('login', '/signin');
    }
  };

  // Enforce security guard: Do not open dashboard directly without signing in
  useEffect(() => {
    if (currentView === 'app' && !user) {
      navigateTo('login', '/signin');
    }
  }, [currentView, user]);

  return (
    <SmoothScrollProvider currentView={currentView}>
      <AIContextContainer activeTab={activeTab} activeChat={null} activeProduct={null}>
      {/* ── View 1: Dedicated Sign In Page ── */}
      {currentView === 'login' && (
        <SignInPage
          onNavigateToLanding={handleNavigateToLanding}
          onNavigateToRegister={() => navigateTo('register', '/register')}
          onAuthSuccess={() => navigateTo('app', '/app')}
        />
      )}

      {/* ── View 2: Dedicated Register Page ── */}
      {currentView === 'register' && (
        <RegisterPage
          onNavigateToLanding={handleNavigateToLanding}
          onNavigateToLogin={() => navigateTo('login', '/signin')}
          onAuthSuccess={() => navigateTo('app', '/app')}
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
          <HowItWorks onEnterApp={(tab) => handleEnterApp(tab || 'shop')} />
          <MessagingPreview onEnterApp={() => handleEnterApp('chats')} />
          <DealOfTheDay onEnterApp={() => handleEnterApp('shop')} />
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
    </SmoothScrollProvider>
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
