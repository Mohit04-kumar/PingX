import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Zap, ShoppingBag, ArrowRight, Layers } from 'lucide-react';

export function WhyPingX({ onEnterApp }) {
  const cards = [
    {
      icon: MessageSquare,
      title: "Connect",
      subtitle: "Real-Time Communication",
      desc: "Chat with friends in real time with typing status, voice note visualizers, message reactions, and clean group organization.",
      badge: "Messaging Engine"
    },
    {
      icon: Zap,
      title: "Ask",
      subtitle: "Instant Smart Answers",
      desc: "Get intelligent assistance for quick fact lookups, group chat recaps, and smart store recommendations without internet fluff.",
      badge: "Smart Assistant"
    },
    {
      icon: ShoppingBag,
      title: "Discover",
      subtitle: "Multi-Merchant Deals",
      desc: "Search, filter, and compare live product prices across Amazon, Flipkart, Myntra, and Croma in a single consolidated engine.",
      badge: "Price Engine"
    }
  ];

  return (
    <section id="why-pingx" className="py-24 relative z-10 overflow-hidden" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
            <Layers className="w-3.5 h-3.5" /> Core Platform Pillars
          </div>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading" style={{ color: 'var(--text-primary)' }}>
            Why Choose PingX?
          </h3>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Three powerful experiences unified into one ultra-sleek, modern web platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                className="glass-panel rounded-3xl p-8 space-y-6 hover:-translate-y-2 transition-all duration-300 group shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm group-hover:scale-105 transition-transform" style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    {card.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{card.subtitle}</span>
                  <h4 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>{card.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{card.desc}</p>
                </div>

                <button
                  onClick={onEnterApp}
                  className="pt-2 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  style={{ color: 'var(--accent)' }}
                >
                  Explore {card.title} <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
