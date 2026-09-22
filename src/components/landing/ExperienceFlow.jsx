import React from 'react';
import { Workflow } from 'lucide-react';

export function ExperienceFlow() {
  return (
    <section className="py-24 relative z-10 border-t border-slate-200 overflow-hidden" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
            <Workflow className="w-3.5 h-3.5" /> Seamless Workflow Engine
          </div>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading" style={{ color: 'var(--text-primary)' }}>
            Conversation → Intelligence → Instant Action
          </h3>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Eliminate manual copying of meeting schedules, product links, or reminders forever.
          </p>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="glass-panel rounded-3xl p-8 space-y-5 hover-lift shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold font-mono text-lg shadow-sm border" style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                01
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Incoming Context
              </span>
            </div>
            <h4 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>Real-Time Conversation</h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              User receives a message: <br />
              <em className="font-medium" style={{ color: 'var(--accent)' }}>"Let me know if you find Sony ANC headphones under ₹8,000 or set Sunday meeting."</em>
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel rounded-3xl p-8 space-y-5 hover-lift shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold font-mono text-lg shadow-sm border" style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                02
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Neural Context
              </span>
            </div>
            <h4 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>PingX AI Parsing</h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              PingX AI automatically analyzes active conversation context, extracts dates & price thresholds, and surfaces instant 1-click action chips.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel rounded-3xl p-8 space-y-5 hover-lift shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold font-mono text-lg shadow-sm border" style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                03
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Automated Execution
              </span>
            </div>
            <h4 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>Instant Action & Sync</h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              1-click creates an automated Ping Reminder, launches multi-merchant price comparison, or posts a formatted summary to your team.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
