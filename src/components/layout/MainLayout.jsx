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
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarExpanded ? 'lg:pl-60' : 'lg:pl-20'}`}>
        
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
        <main className="flex-1 p-3 sm:p-5 md:p-6 max-w-7xl mx-auto w-full">
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
