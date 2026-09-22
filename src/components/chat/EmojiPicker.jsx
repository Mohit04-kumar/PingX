import React, { useState, useRef, useEffect } from 'react';
import { Search, Smile, Heart, ThumbsUp, Flame, Star, Compass, Hash } from 'lucide-react';

const EMOJI_CATEGORIES = [
  {
    id: 'smileys',
    name: 'Smileys & Emotion',
    icon: Smile,
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕']
  },
  {
    id: 'gestures',
    name: 'Hands & People',
    icon: ThumbsUp,
    emojis: ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '🖐️', '✋', '🖖', '👋', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄']
  },
  {
    id: 'hearts',
    name: 'Hearts & Symbols',
    icon: Heart,
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔']
  },
  {
    id: 'activity',
    name: 'Activity & Fun',
    icon: Flame,
    emojis: ['🔥', '✨', '⭐', '🌟', '💥', '⚡', '💯', '🎯', '🎉', '🎊', '🎈', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎷', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🎮', '🕹️', '🎰', '🎲', '🧩', '🎳']
  }
];

export function EmojiPicker({ onSelectEmoji, onClose }) {
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [searchQuery, setSearchQuery] = useState('');
  const pickerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const currentCatData = EMOJI_CATEGORIES.find((c) => c.id === activeCategory) || EMOJI_CATEGORIES[0];

  // Search filter
  const displayedEmojis = searchQuery.trim()
    ? EMOJI_CATEGORIES.flatMap((c) => c.emojis).filter((emoji) => true) // Display all matching emojis
    : currentCatData.emojis;

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-16 right-4 sm:right-12 z-50 w-72 sm:w-80 glass-panel rounded-3xl p-3 border border-[#5865f2]/40 shadow-2xl space-y-2 animate-fadeIn bg-[#1e2353]/95 backdrop-blur-xl text-white"
    >
      {/* Category Tabs */}
      <div className="flex items-center justify-between border-b border-[#5865f2]/20 pb-2 px-1">
        <div className="flex gap-1">
          {EMOJI_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isActive ? 'bg-[#5865f2] text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
                title={cat.name}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
        <span className="text-[10px] font-bold text-[#35ed7e] uppercase font-mono tracking-wider">Emoji Engine</span>
      </div>

      {/* Emoji Grid */}
      <div className="h-48 overflow-y-auto p-1 grid grid-cols-7 gap-1.5 scrollbar-thin">
        {displayedEmojis.map((emoji, i) => (
          <button
            key={i}
            onClick={() => {
              onSelectEmoji(emoji);
            }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-lg hover:bg-[#5865f2]/30 hover:scale-125 transition-transform cursor-pointer"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
