import React, { useState } from 'react';
import { usePings } from '../../context/PingsContext';
import { CreatePingModal } from './CreatePingModal';
import { Bell, Shield, CheckCheck, Trash2, ExternalLink, Plus } from 'lucide-react';

export function PingsView({ setActiveTab }) {
  const { pings, markAsRead, markAllAsRead, clearPing, addPing, focusMode, toggleFocusMode } = usePings();
  const [filter, setFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredPings = pings.filter((p) => {
    if (filter === 'all') return true;
    return p.type === filter;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-heading">Pings & Notifications</h2>
            <p className="text-xs text-gray-400">Automated reminders, price drop alerts, and custom pings</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="pingx-glow-button btn-shimmer px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" /> Create Custom Ping
          </button>


          <button
            onClick={toggleFocusMode}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              focusMode
                ? 'bg-purple-600/40 text-purple-200 border border-purple-500/50'
                : 'glass-card text-gray-300 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {focusMode ? 'Focus On' : 'Focus'}
          </button>
          
          <button
            onClick={markAllAsRead}
            className="glass-card px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-black/30 p-1 rounded-2xl text-xs font-semibold border border-white/10 max-w-md">
        <button onClick={() => setFilter('all')} className={`flex-1 py-1.5 rounded-xl ${filter === 'all' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400'}`}>
          All
        </button>
        <button onClick={() => setFilter('price_alert')} className={`flex-1 py-1.5 rounded-xl ${filter === 'price_alert' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400'}`}>
          Price Alerts
        </button>
        <button onClick={() => setFilter('reminder')} className={`flex-1 py-1.5 rounded-xl ${filter === 'reminder' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400'}`}>
          Reminders
        </button>
        <button onClick={() => setFilter('ai_suggestion')} className={`flex-1 py-1.5 rounded-xl ${filter === 'ai_suggestion' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400'}`}>
          AI Insights
        </button>
      </div>

      {/* Pings List */}
      <div className="space-y-3">
        {filteredPings.length === 0 ? (
          <div className="glass-panel p-12 text-center text-gray-400 text-xs rounded-3xl">
            You're all caught up! ✨ No active Pings in this view.
          </div>
        ) : (
          filteredPings.map((ping) => (
            <div
              key={ping.id}
              onClick={() => markAsRead(ping.id)}
              className={`glass-panel rounded-2xl p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                !ping.read ? 'border-purple-500/40 bg-purple-950/20' : 'border-white/10 opacity-80'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    {ping.badge}
                  </span>
                  <span className="text-[10px] text-gray-500">{ping.timestamp}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{ping.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{ping.content}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {ping.action && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(ping.id);
                      if (ping.action.type === 'open_chat') setActiveTab('chats');
                      if (ping.action.type === 'open_product') setActiveTab('shop');
                    }}
                    className="pingx-glow-button px-3.5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                  >
                    {ping.action.label}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); clearPing(ping.id); }}
                  className="p-2 text-gray-500 hover:text-red-400 glass-card rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CreatePingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={addPing}
      />

    </div>
  );
}
