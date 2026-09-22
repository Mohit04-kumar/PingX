import React from 'react';
import { Cpu, Bell, Zap, Layers, Command } from 'lucide-react';

export function BentoGrid() {
  return (
    <section className="py-24 relative z-10 overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
            <Cpu className="w-3.5 h-3.5" /> Platform Architecture
          </div>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading" style={{ color: 'var(--text-primary)' }}>
            Engineered for Speed, Intelligence & Precision
          </h3>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Discover the powerful features powering next-generation collaboration and smart shopping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="glass-panel rounded-3xl p-8 space-y-5 md:col-span-2 hover-lift shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border" style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full font-bold border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                1-Click AI Actions
              </span>
            </div>
            <h4 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>Smart Replies & Dynamic Context Actions</h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              PingX automatically analyzes incoming chat messages and generates 1-click intelligent responses or context action chips like "+ Add Ping Reminder" or "📅 Reschedule Meeting".
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel rounded-3xl p-8 space-y-5 hover-lift shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border" style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                <Command className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full font-bold border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Ctrl + K
              </span>
            </div>
            <h4 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>Universal Search Studio</h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Press Ctrl+K anywhere in PingX to search across chats, messages, multi-merchant products, Pings, and AI prompt templates instantly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel rounded-3xl p-8 space-y-5 hover-lift shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border" style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                <Bell className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full font-bold border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Price Alerts
              </span>
            </div>
            <h4 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>Price Watch & Focus Mode</h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Track live price drop notifications across Amazon & Flipkart while maintaining complete focus with customized notification suppressions.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-panel rounded-3xl p-8 space-y-5 md:col-span-2 hover-lift shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border" style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full font-bold border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Automated Synthesis
              </span>
            </div>
            <h4 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>Smart Group Chat Summarizer</h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Hit "Summarize" inside any group thread to instantly extract key decisions, assigned tasks, scheduled meetings, and consensus points in clear bullet points.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
