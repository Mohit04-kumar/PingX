import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { CommandPalette } from './CommandPalette';
import { CreatePostModal } from '../common/CreatePostModal';

export function MainLayout({ activeTab, setActiveTab, onNavigateToLanding, onPostCreated, children }) {
  // Mobile drawer toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Desktop sidebar expand/collapse state: false by default for shorter icon-only mode
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleCommandNavigate = (tab, itemId) => {
    setActiveTab(tab);
  };

  const isChatTab = activeTab === 'chats';

  return (
    <div className={`bg-[#f8f7ff] text-slate-900 flex flex-col font-sans relative ${
      isChatTab ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-screen'
    }`}>
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        onNavigateToLanding={onNavigateToLanding}
        onOpenCreate={() => setIsCreatePostOpen(true)}
        onOpenSearch={() => setCommandPaletteOpen(true)}
      />

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-35 lg:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarExpanded ? 'lg:pl-60' : 'lg:pl-20'
      } ${isChatTab ? 'h-full min-h-0 overflow-hidden' : ''}`}>
        
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
        <main className={`flex-1 w-full max-w-7xl mx-auto ${
          isChatTab
            ? 'p-2 sm:p-3 md:p-4 h-[calc(100%-4rem)] min-h-0 overflow-hidden flex flex-col'
            : 'p-3 sm:p-5 md:p-6'
        }`}>
          {children}
        </main>

      </div>

      {/* Universal Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleCommandNavigate}
      />

      {/* Instagram Create Post Modal (+ Create in Sidebar) */}
      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={(newPost) => {
          if (onPostCreated) onPostCreated(newPost);
        }}
      />

    </div>
  );
}
