import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Plus, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const EMOJI_OPTIONS = ['🔥', '🎧', '💻', '👟', '⚡', '✈️', '📸', '🎵', '🌟', '💎', '🚀', '☕'];

export function CreateHighlightModal({ isOpen, onClose, onHighlightCreated }) {
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');
  const [customCover, setCustomCover] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCustomCover(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title for your highlight.');
      return;
    }

    const newHighlight = {
      id: `hl_${Date.now()}`,
      title: title.trim(),
      icon: customCover || selectedEmoji,
      isImageCover: !!customCover,
      count: 1,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('pingx_user_highlights') || '[]');
      const updated = [...existing, newHighlight];
      localStorage.setItem('pingx_user_highlights', JSON.stringify(updated));
    } catch (err) {}

    if (onHighlightCreated) onHighlightCreated(newHighlight);
    addToast('Highlight Added!', `"${title.trim()}" is now featured on your profile.`, 'success', 3000);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl overflow-hidden max-w-sm w-full border border-slate-200 shadow-2xl animate-scaleUp text-slate-900"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-sm font-extrabold font-heading text-slate-900">
            New Story Highlight
          </h3>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!title.trim()}
            className="text-xs font-bold text-[#7256c3] hover:text-[#5d42a6] disabled:opacity-40 cursor-pointer"
          >
            Done
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
          
          {/* Highlight Title */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Highlight Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Travel, Deals, Work, Fits"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-[#7256c3] focus:bg-white"
              maxLength={20}
              autoFocus
              required
            />
          </div>

          {/* Cover Preview & Options */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Choose Cover Icon or Image
            </label>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-14 h-14 rounded-full border-2 border-[#7256c3] bg-white flex items-center justify-center text-2xl shadow-xs overflow-hidden shrink-0">
                {customCover ? (
                  <img src={customCover} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <span>{selectedEmoji}</span>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleCoverSelect} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-1.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 font-bold text-[11px] text-slate-700 cursor-pointer transition-colors"
                >
                  Upload Custom Cover Image
                </button>
                {customCover && (
                  <button
                    type="button"
                    onClick={() => setCustomCover(null)}
                    className="text-[10px] text-red-500 font-semibold hover:underline block"
                  >
                    Reset to Emoji
                  </button>
                )}
              </div>
            </div>

            {/* Quick Emoji Grid */}
            <div className="grid grid-cols-6 gap-2 pt-1">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setSelectedEmoji(emoji);
                    setCustomCover(null);
                  }}
                  className={`h-9 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer ${
                    !customCover && selectedEmoji === emoji
                      ? 'border-[#7256c3] bg-violet-50 scale-105 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-2.5 rounded-xl bg-[#7256c3] hover:bg-[#6044b3] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer mt-2 disabled:opacity-40"
          >
            Create Highlight
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateHighlightModal;
