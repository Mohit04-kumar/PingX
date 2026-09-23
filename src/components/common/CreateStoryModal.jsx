import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Image as ImageIcon, Camera, Sparkles, Send, Tag, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function CreateStoryModal({ isOpen, onClose, onStoryCreated }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [mediaPreview, setMediaPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [linkHeading, setLinkHeading] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('File size exceeds 15MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaPreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mediaPreview) {
      alert('Please upload a photo or video for your story.');
      return;
    }

    setIsSubmitting(true);

    const newStory = {
      id: `story_${Date.now()}`,
      author: {
        name: user?.name || 'User',
        username: user?.username || 'user',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        isVerified: true
      },
      timeAgo: 'Just now',
      storyImage: mediaPreview,
      dealText: linkHeading ? `${linkHeading}: ${linkUrl}` : caption || 'Latest update from my story ✨',
      linkHeading: linkHeading || '',
      linkUrl: linkUrl || '',
      caption: caption || '',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      // Save in localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('pingx_user_stories') || '[]');
        const updated = [newStory, ...existing];
        localStorage.setItem('pingx_user_stories', JSON.stringify(updated));
      } catch (err) {}

      if (onStoryCreated) onStoryCreated(newStory);
      addToast('Story Published!', 'Your story is now live for 24 hours.', 'success', 3000);
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl overflow-hidden max-w-lg w-full max-h-[92vh] flex flex-col border border-slate-200 shadow-2xl animate-scaleUp text-slate-900"
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
          <h3 className="text-sm font-extrabold font-heading text-slate-900 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[#7256c3]" /> Add to Your Story
          </h3>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!mediaPreview || isSubmitting}
            className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#7256c3] text-white hover:bg-[#6044b3] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs"
          >
            {isSubmitting ? 'Posting...' : 'Share Story'}
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*,video/*" 
            className="hidden" 
          />

          {/* Media Upload / Preview */}
          {!mediaPreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-violet-200 hover:border-[#7256c3] rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#f8f7ff] group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-violet-100 flex items-center justify-center text-[#7256c3] mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-extrabold text-sm text-slate-800 font-heading">
                Upload Photo or Video
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Drag and drop or browse from device (PNG, JPG, MP4)
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-[9/16] max-h-[360px] flex items-center justify-center mx-auto">
              <img 
                src={mediaPreview} 
                alt="Story Preview" 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setMediaPreview(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer shadow-md"
                title="Remove & Pick Another"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Caption Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Story Text / Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add text or thoughts to your story..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#7256c3] focus:bg-white"
            />
          </div>

          {/* Optional Link Heading & URL */}
          <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#7256c3]" />
              <span>Optional Story Link / Deal Heading</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={linkHeading}
                onChange={(e) => setLinkHeading(e.target.value)}
                placeholder="Link Heading (e.g. My Website)"
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-[#7256c3]"
              />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-[#7256c3]"
              />
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateStoryModal;
