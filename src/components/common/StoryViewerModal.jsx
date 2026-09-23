import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send } from 'lucide-react';
import { Avatar } from './Avatar';

export function StoryViewerModal({ isOpen, story, onClose, onNext, onPrev }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen || !story) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onNext) onNext();
          else onClose();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, story]);

  if (!isOpen || !story) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm h-[82vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between text-white"
      >
        {/* Progress Bar at top */}
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
          <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Story Header */}
        <div className="absolute top-6 left-3 right-3 z-20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Avatar src={story.avatar} name={story.name} size="sm" className="border border-white/50" />
            <div>
              <span className="font-bold text-white shadow-xs">{story.name}</span>
              <span className="text-[10px] text-white/70 block">2h ago</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full bg-black/40 hover:bg-black/70 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Main Image */}
        <div className="flex-1 w-full h-full relative">
          <img 
            src={story.storyImage || story.avatar || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'} 
            alt="Story" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

          {/* Story caption tag if exists */}
          {story.dealText && (
            <div className="absolute bottom-20 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-xs">
              <span className="font-bold text-emerald-400 block font-mono">⚡ Verified Drop</span>
              <p className="text-white text-xs">{story.dealText}</p>
            </div>
          )}
        </div>

        {/* Story Footer: Reply / Reaction */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-2">
          <input 
            type="text"
            placeholder={`Reply to ${story.name}...`}
            className="flex-1 px-4 py-2.5 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/60 text-xs outline-none border border-white/30"
          />
          <button className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors">
            <Heart className="w-5 h-5 hover:fill-rose-500 hover:text-rose-500" />
          </button>
          <button className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
