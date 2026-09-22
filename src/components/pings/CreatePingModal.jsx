import React, { useState } from 'react';
import { X, BellPlus, Calendar, Tag } from 'lucide-react';

export function CreatePingModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('reminder'); // 'reminder', 'price_alert', 'ai_suggestion', 'social'
  const [date, setDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let badge = '⏰ Reminder';
    if (type === 'price_alert') badge = '🔥 Price Drop Alert';
    if (type === 'ai_suggestion') badge = '💡 PingX AI Insight';
    if (type === 'social') badge = '💬 Social Ping';

    onSave({
      id: `custom_ping_${Date.now()}`,
      type,
      badge,
      title: title.trim(),
      content: content.trim() || 'Custom user scheduled ping notification.',
      timestamp: date ? `Scheduled for ${date}` : 'Just now',
      read: false
    });

    setTitle('');
    setContent('');
    setDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl relative space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <BellPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-heading">Create Custom Ping</h3>
            <p className="text-xs text-gray-400">Set a custom reminder or alert notification</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-gray-300 font-medium mb-1">Ping Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Viva Rehearsal Meeting with Team"
              className="w-full glass-input rounded-xl px-4 py-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Category / Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-white outline-none cursor-pointer"
            >
              <option value="reminder">⏰ Scheduled Reminder</option>
              <option value="price_alert">🔥 Price Drop Watcher</option>
              <option value="ai_suggestion">💡 AI Task Alert</option>
              <option value="social">💬 Social Ping</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Schedule Date / Time</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. Tomorrow at 6:00 PM"
              className="w-full glass-input rounded-xl px-4 py-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Details / Description</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Add additional notes or details..."
              className="w-full glass-input rounded-xl p-3 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full pingx-glow-button py-3 rounded-xl text-xs font-bold text-white cursor-pointer shadow-lg mt-2"
          >
            Create & Add to Pings
          </button>

        </form>

      </div>
    </div>
  );
}
