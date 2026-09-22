import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { CommandPalette } from './CommandPalette';
import { FloatingAIBubble } from '../ai/FloatingAIBubble';
import { AIPopupPanel } from '../ai/AIPopupPanel';
import { ToastContainer } from '../common/ToastContainer';

export function MainLayout({ activeTab, setActiveTab, onNavigateToLanding, children }) {
  // Mobile drawer toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Desktop sidebar expand/collapse state: false by default for shorter icon-only mode
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const handleCommandNavigate = (tab, itemId) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] text-slate-900 flex flex-col font-sans relative">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        onNavigateToLanding={onNavigateToLanding}
      />

      {/* Main Content Area: dynamically adjusts left padding based on sidebar expansion */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarExpanded ? 'lg:pl-64' : 'lg:pl-20'}`}>
        
        {/* Top Header */}
        <TopHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isSidebarExpanded={isSidebarExpanded}
          onToggleSidebarExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
          onNavigateToLanding={onNavigateToLanding}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

      </div>

      {/* Universal Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleCommandNavigate}
      />

    </div>
  );
}
