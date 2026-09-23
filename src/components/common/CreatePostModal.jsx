import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Smile, 
  MapPin, 
  Tag, 
  Sparkles, 
  Check, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isProductTag, setIsProductTag] = useState(false);
  const [productTitle, setProductTitle] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productMerchant, setProductMerchant] = useState('Amazon.in');
  const [productUrl, setProductUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit. Please upload a smaller photo or video.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imagePreview) {
      alert('Please upload a photo or video for your post.');
      return;
    }

    setIsSubmitting(true);

    const newPost = {
      id: `post_${Date.now()}`,
      author: {
        name: user?.name || 'Raman Raj',
        username: user?.username || 'ramanraj',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        badge: user?.role || 'Lead Tech Reviewer',
        isVerified: true
      },
      timeAgo: 'Just now',
      title: productTitle || 'New Post',
      caption: caption || 'Check out my latest post on PingX!',
      image: imagePreview,
      likesCount: 1,
      commentsCount: 0,
      isLiked: false,
      isSaved: false,
      isProductTag: isProductTag && !!productPrice,
      currentPrice: productPrice ? Number(productPrice) : null,
      lowestMerchant: productMerchant,
      lowestUrl: productUrl || 'https://www.amazon.in',
      location: location || 'Bangalore, India'
    };

    setTimeout(() => {
      if (onPostCreated) onPostCreated(newPost);
      addToast('Post Published!', 'Your post is now live on the Instagram feed & Profile.', 'success', 3000);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[92vh] flex flex-col border border-slate-200 shadow-2xl animate-scaleUp text-slate-900"
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
            Create new post
          </h3>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!imagePreview || isSubmitting}
            className="text-xs font-bold text-[#7256c3] hover:text-[#5f42b3] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Sharing...' : 'Share'}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*,video/*" 
            className="hidden" 
          />

          {/* Upload Area / Image Preview */}
          {!imagePreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-violet-200 hover:border-[#7256c3] rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#f8f7ff] group"
            >
              <div className="w-16 h-16 rounded-full bg-violet-100 text-[#7256c3] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Drag photos and videos here
              </h4>
              <p className="text-[11px] text-slate-500 mb-4">
                Supports JPG, PNG, WEBP, and MP4 up to 10MB
              </p>
              <button
                type="button"
                className="px-5 py-2 rounded-xl bg-[#7256c3] text-white text-xs font-bold shadow-xs hover:bg-[#6044b3] transition-colors"
              >
                Select from computer
              </button>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-72 flex items-center justify-center group">
              <img src={imagePreview} alt="Upload preview" className="w-full h-72 object-cover" />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-bold backdrop-blur-md cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Change
              </button>
            </div>
          )}

          {/* Caption Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">Write a caption</label>
              <span className="text-[10px] text-slate-400">{caption.length} / 2,200</span>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="Write a caption, tags (#deal, #tech, #sound), or honest review..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3] focus:bg-white transition-colors"
            />
          </div>

          {/* Location input */}
          <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location (e.g. Bangalore, India)"
              className="w-full bg-transparent outline-none text-xs text-slate-900 font-medium"
            />
          </div>

          {/* Smart Commerce / Product Deal Tag Toggle */}
          <div className="p-4 rounded-2xl border border-violet-100 bg-violet-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#7256c3]" />
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">Tag a Product / Deal</h5>
                  <p className="text-[10px] text-slate-500">Show price badge and direct purchase link on your post</p>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={isProductTag}
                onChange={(e) => setIsProductTag(e.target.checked)}
                className="w-4 h-4 accent-[#7256c3] cursor-pointer"
              />
            </div>

            {isProductTag && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-violet-100 animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    placeholder="e.g. Sony WH-1000XM5"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="24990"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Merchant Store</label>
                  <select
                    value={productMerchant}
                    onChange={(e) => setProductMerchant(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3]"
                  >
                    <option value="Amazon.in">Amazon.in</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Croma">Croma</option>
                    <option value="Myntra">Myntra</option>
                    <option value="Reliance Digital">Reliance Digital</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Store URL Link</label>
                  <input
                    type="url"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium outline-none focus:border-[#7256c3]"
                  />
                </div>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
