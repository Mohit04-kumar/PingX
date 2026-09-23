import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { StoryViewerModal } from '../common/StoryViewerModal';
import { Avatar } from '../common/Avatar';
import { 
  ShoppingBag, 
  TrendingDown, 
  MessageSquare, 
  Bookmark, 
  Heart, 
  Send, 
  Share2, 
  Search, 
  SlidersHorizontal, 
  ExternalLink, 
  Volume2, 
  VolumeX,
  Play, 
  Pause, 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  Sparkles, 
  Star, 
  Plus, 
  Bot,
  Filter,
  CheckCircle2,
  Tag,
  ArrowRight,
  MoreHorizontal,
  Flame,
  Smile,
  Music2,
  MessageCircle
} from 'lucide-react';

// Authentic Social & Smart Commerce Feed matching Landing Page Promises & Instagram UI
const INITIAL_FEED = [
  {
    id: 'post-folk-vadodara',
    author: {
      name: 'Folk Vadodara',
      username: 'folk.vadodara',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      badge: 'Community Creator',
      isVerified: true
    },
    timeAgo: '6h',
    audioTrack: 'Original audio • Hare Krishna Kirtan',
    title: 'Youth Festival Celebrations & Cultural Wisdom',
    caption: 'Pure energy and bliss at the annual youth festival! Serving freshly prepared prasadam to over 1,500 students today. Dal Tadka, Puri & Shrikhand feast! ✨🙏 #FolkVadodara #YouthFestival #SpiritualVibes',
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&auto=format&fit=crop&q=80',
    likesCount: 2840,
    commentsCount: 142,
    isReel: true,
    comments: [
      { user: 'abhinesh_polnati', text: 'Hare Krishna ❤️ So inspiring!' },
      { user: 'vedanttrivedi.0', text: 'Dal Tadka looks amazing! 🙌' }
    ]
  },
  {
    id: 'post-sony-xm5',
    author: {
      name: 'Raman Raj',
      username: 'ramanraj',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      badge: 'Deal Hunter & Reviewer',
      isVerified: true
    },
    timeAgo: '2h',
    audioTrack: 'Raman Raj • Lossless Voice Breakdown (48kHz)',
    title: 'Sony WH-1000XM5 Wireless Active Noise Canceling Headphones',
    caption: 'Just unboxed the Sony WH-1000XM5! Tested the active noise cancellation against city traffic in Bangalore - absolutely dead silent. Verified lowest price spotted across Amazon.in and Croma today! 🎧⚡ #SonyWH1000XM5 #LosslessAudio #PingXDeals',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    currentPrice: 24990,
    originalPrice: 34990,
    discount: 'Save ₹10,000',
    lowestMerchant: 'Amazon.in',
    lowestUrl: 'https://www.amazon.in/s?k=Sony+WH-1000XM5',
    merchants: [
      { name: 'Amazon.in', price: 24990, isLowest: true, url: 'https://www.amazon.in/s?k=Sony+WH-1000XM5' },
      { name: 'Croma', price: 26990, isLowest: false, url: 'https://www.croma.com/search/?text=Sony+WH-1000XM5' },
      { name: 'Flipkart', price: 27490, isLowest: false, url: 'https://www.flipkart.com/search?q=Sony+WH-1000XM5' }
    ],
    isAudioNote: true,
    audioDuration: '0:34',
    audioMessage: 'Hey! Amazon just dropped Sony XM5 by ₹2,000 below Croma retail. Take a listen to my 30-second breakdown before buying!',
    likesCount: 1420,
    commentsCount: 84,
    comments: [
      { user: 'prathmesh', text: 'Is the ANC better than AirPods Max? Thinking of buying!' },
      { user: 'soumya', text: 'Checked Amazon link, price is genuine! Ordered.' }
    ]
  },
  {
    id: 'post-macbook-m3',
    author: {
      name: 'Raman Raj',
      username: 'ramanraj',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      badge: 'Deal Hunter & Reviewer',
      isVerified: true
    },
    timeAgo: '1d',
    audioTrack: 'Original audio • Minimal Desk Beats',
    title: 'Apple MacBook Air 15-inch M3 Chip (Midnight)',
    caption: '18 hours battery life, 500 nits Liquid Retina display, and silent fanless aluminum chassis. Best deal spotted on Croma with instant HDFC bank discount! 💻✨ #MacBookAirM3 #AppleIndia #DeskSetup',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    currentPrice: 124900,
    originalPrice: 134900,
    discount: 'Save ₹10,000',
    lowestMerchant: 'Croma',
    lowestUrl: 'https://www.croma.com/search/?text=MacBook+Air+M3',
    merchants: [
      { name: 'Croma', price: 124900, isLowest: true, url: 'https://www.croma.com/search/?text=MacBook+Air+M3' },
      { name: 'Amazon.in', price: 129900, isLowest: false, url: 'https://www.amazon.in/s?k=MacBook+Air+M3' },
      { name: 'Reliance Digital', price: 132900, isLowest: false, url: 'https://www.reliancedigital.in' }
    ],
    likesCount: 2410,
    commentsCount: 156,
    comments: [
      { user: 'mohit6c16', text: 'Midnight color looks stunning! Does it attract fingerprints?' }
    ]
  },
  {
    id: 'post-nike-airmax',
    author: {
      name: 'Raman Raj',
      username: 'ramanraj',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      badge: 'Deal Hunter & Reviewer',
      isVerified: true
    },
    timeAgo: '2d',
    audioTrack: 'Original audio • Street Sneakers',
    title: 'Nike Air Max Impact 4 Basketball & Lifestyle Sneakers',
    caption: 'Max Air cushioning in the heel with aggressive herringbone traction. Direct from official Myntra retailer with free 30-day exchange! 👟🔥 #NikeAirMax #SneakerHead #PingXStyle',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    currentPrice: 6495,
    originalPrice: 8995,
    discount: '28% OFF',
    lowestMerchant: 'Myntra',
    lowestUrl: 'https://www.myntra.com/nike-air-max',
    merchants: [
      { name: 'Myntra', price: 6495, isLowest: true, url: 'https://www.myntra.com/nike-air-max' },
      { name: 'Flipkart', price: 7299, isLowest: false, url: 'https://www.flipkart.com' }
    ],
    likesCount: 890,
    commentsCount: 42,
    comments: []
  }
];

const INSTAGRAM_STORIES = [
  { 
    id: 's_self',
    name: 'Your story', 
    username: 'ramanraj', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', 
    isSelf: true,
    storyImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80'
  },
  { 
    id: 's_iskcon',
    name: 'iskconban...', 
    username: 'iskconbangalore', 
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80', 
    hasUnseen: true,
    dealText: 'Evening Darshan & Kirtan Live from Rajajinagar temple 🙏',
    storyImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80'
  },
  { 
    id: 's_harekrishna',
    name: 'harekrishn...', 
    username: 'harekrishnamandir', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', 
    hasUnseen: true,
    dealText: 'Daily Wisdom: Find peace within through collective singing ✨',
    storyImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
  },
  { 
    id: 's_deals',
    name: 'tech_deals', 
    username: 'tech_deals', 
    avatar: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=80', 
    hasUnseen: true,
    dealText: 'Sony XM5 ₹24,990 flash sale on Amazon today! Lowest of 2026',
    storyImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  }
];

const SUGGESTED_USERS = [
  { id: 'u_iskcon', name: 'ISKCON Bangalore', handle: 'Followed by its.prathsverse +', isVerified: true, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' },
  { id: 'u_mandir', name: 'Hare Krishna Mand...', handle: 'Suggested for you', isVerified: false, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
  { id: 'u_prathmesh', name: 'Prathmesh', handle: 'Followed by abhinesh_polnati', isVerified: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
  { id: 'u_soumya', name: 'Soumya', handle: 'Followed by abhinesh_polnati', isVerified: false, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80' },
  { id: 'u_mohit', name: 'mohit6c16', handle: 'Suggested for you', isVerified: false, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80' }
];

export function DashboardView({ setActiveTab }) {
  const { user } = useAuth();
  const { addToCart, watchlist = [], toggleWatchlist, setIsCartOpen, cart = [] } = useShop();
  const { addToast } = useToast();

  const [feed, setFeed] = useState(INITIAL_FEED);
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [followingMap, setFollowingMap] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  
  // Audio playback state for voice notes
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Story modal state
  const [selectedStory, setSelectedStory] = useState(null);

  // Product Inspection Detail Modal
  const [inspectedPost, setInspectedPost] = useState(null);

  const toggleLike = (postId) => {
    setLikedPosts((prev) => {
      const isCurrentlyLiked = !!prev[postId];
      return { ...prev, [postId]: !isCurrentlyLiked };
    });
  };

  const toggleSave = (postId) => {
    setSavedPosts((prev) => {
      const isCurrentlySaved = !!prev[postId];
      return { ...prev, [postId]: !isCurrentlySaved };
    });
    addToast('Post Saved', 'Saved to your personal collection & wishlist.', 'info', 2000);
  };

  const toggleFollowUser = (userId) => {
    setFollowingMap((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setFeed((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [
              ...(post.comments || []),
              { user: user?.username || 'ramanraj', text }
            ]
          };
        }
        return post;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    addToast('Comment Posted', text, 'success', 2000);
  };

  return (
    <div className="max-w-5xl mx-auto flex gap-10 text-slate-900 pb-20 animate-fadeIn">
      
      {/* ── Left / Center Column: Instagram Stories & Main Feed ── */}
      <div className="w-full max-w-xl mx-auto space-y-6">
        
        {/* Top Stories Bar (Matching Image 1) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6e2f8] shadow-xs overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-4 sm:gap-6 min-w-max">
            {INSTAGRAM_STORIES.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() => setSelectedStory(story)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div 
                  className={`p-[2.5px] rounded-full transition-transform group-hover:scale-105 ${
                    story.isSelf 
                      ? 'border-2 border-slate-300' 
                      : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-[#7256c3]'
                  }`}
                >
                  <div className="bg-white p-0.5 rounded-full">
                    <Avatar
                      src={story.avatar}
                      name={story.name}
                      size="md"
                      className="w-14 h-14 object-cover rounded-full"
                    />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-700 truncate max-w-[4.5rem]">
                  {story.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Instagram Posts Feed (Matching Image 1) ── */}
        <div className="space-y-6">
          {feed.map((post) => {
            const isLiked = !!likedPosts[post.id];
            const isSaved = !!savedPosts[post.id];
            const totalLikes = post.likesCount + (isLiked ? 1 : 0);

            return (
              <article 
                key={post.id}
                className="bg-white rounded-3xl border border-[#e6e2f8] shadow-xs overflow-hidden transition-shadow hover:shadow-sm"
              >
                {/* Post Header */}
                <div className="p-3.5 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={post.author.avatar} 
                      name={post.author.name} 
                      size="sm" 
                      className="border border-slate-200"
                    />
                    <div className="leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 font-heading">
                          {post.author.username}
                        </span>
                        {post.author.isVerified && (
                          <span className="w-3.5 h-3.5 rounded-full bg-[#7256c3] text-white text-[9px] flex items-center justify-center font-bold">
                            ✓
                          </span>
                        )}
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-slate-400 text-xs">{post.timeAgo}</span>
                      </div>
                      {post.audioTrack && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate max-w-xs pt-0.5">
                          <Music2 className="w-3 h-3 text-[#7256c3]" />
                          <span className="truncate">{post.audioTrack}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => addToast(post.title, 'Post options menu', 'info', 1500)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Media (Image / Video Thumbnail) */}
                <div 
                  onDoubleClick={() => toggleLike(post.id)}
                  className="relative bg-slate-100 aspect-square sm:aspect-4/3 max-h-[500px] w-full overflow-hidden cursor-pointer select-none"
                >
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover" 
                  />

                  {/* Sound Toggle Icon in corner */}
                  {post.isReel && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAudioMuted(!isAudioMuted);
                      }}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 text-white backdrop-blur-md cursor-pointer hover:bg-black/80 transition-colors"
                      title={isAudioMuted ? "Unmute" : "Mute"}
                    >
                      {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  )}

                  {/* Audio Waveform Player overlay if voice note is attached */}
                  {post.isAudioNote && (
                    <div className="absolute top-3 left-3 right-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 truncate">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingAudioId(playingAudioId === post.id ? null : post.id);
                          }}
                          className="w-8 h-8 rounded-full bg-[#7256c3] text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer hover:scale-105 transition-transform"
                        >
                          {playingAudioId === post.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <div className="truncate">
                          <p className="font-bold text-slate-900 truncate">48kHz Lossless Voice Note</p>
                          <span className="text-[10px] text-slate-500">Raman Raj • {post.audioDuration}</span>
                        </div>
                      </div>

                      {/* Interactive Waveform Animation */}
                      <div className="flex items-center gap-1 h-5 shrink-0">
                        {[40, 75, 90, 60, 100, 45, 80, 50, 95, 30].map((h, i) => (
                          <span
                            key={i}
                            className={`w-1 rounded-full transition-all ${
                              playingAudioId === post.id ? 'bg-[#7256c3] animate-pulse' : 'bg-slate-300'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Post Action Buttons */}
                <div className="p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-800">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className="cursor-pointer hover:opacity-75 transition-opacity"
                        title={isLiked ? "Unlike" : "Like"}
                      >
                        <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-800'}`} />
                      </button>

                      <button 
                        onClick={() => {
                          const input = document.getElementById(`comment_input_${post.id}`);
                          input?.focus();
                        }}
                        className="cursor-pointer hover:opacity-75 transition-opacity"
                        title="Comment"
                      >
                        <MessageCircle className="w-6 h-6 text-slate-800" />
                      </button>

                      <button 
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          addToast('Link Copied', 'Post link copied to clipboard.', 'info', 2000);
                        }}
                        className="cursor-pointer hover:opacity-75 transition-opacity"
                        title="Share"
                      >
                        <Send className="w-6 h-6 text-slate-800" />
                      </button>
                    </div>

                    <button 
                      onClick={() => toggleSave(post.id)}
                      className="cursor-pointer hover:opacity-75 transition-opacity"
                      title={isSaved ? "Saved" : "Save"}
                    >
                      <Bookmark className={`w-6 h-6 transition-colors ${isSaved ? 'fill-slate-900 text-slate-900' : 'text-slate-800'}`} />
                    </button>
                  </div>

                  {/* Likes Count */}
                  <div className="text-xs font-bold text-slate-900">
                    {totalLikes.toLocaleString()} likes
                  </div>

                  {/* Caption */}
                  <div className="text-xs text-slate-800 leading-relaxed">
                    <span className="font-bold text-slate-900 mr-2">{post.author.username}</span>
                    <span className="whitespace-pre-line">{post.caption}</span>
                  </div>

                  {/* Smart Commerce Deal Tag Pill if attached to post */}
                  {post.currentPrice && (
                    <div className="p-3 rounded-2xl bg-violet-50/70 border border-violet-200 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <ShoppingBag className="w-4 h-4 text-[#7256c3] shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-slate-900 truncate block">
                            {post.title}
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="font-extrabold text-[#7256c3] font-mono">₹{post.currentPrice.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400 line-through font-mono">₹{post.originalPrice.toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-emerald-700">Lowest on {post.lowestMerchant}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(
                              { id: post.id, title: post.title, price: post.currentPrice, image: post.image },
                              { marketplace: post.lowestMerchant, price: post.currentPrice, url: post.lowestUrl }
                            );
                            addToast('Added to Cart', `${post.title} added to cart!`, 'success', 2000);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-violet-100 text-[#7256c3] border border-violet-200 font-bold text-[11px] cursor-pointer transition-colors"
                        >
                          + Cart
                        </button>
                        <a
                          href={post.lowestUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-[#7256c3] hover:bg-[#6044b3] text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                        >
                          Buy <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Comments Preview */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-1 pt-1 text-xs">
                      {post.comments.slice(-2).map((c, i) => (
                        <div key={i} className="text-slate-700">
                          <span className="font-bold text-slate-900 mr-2">{c.user}</span>
                          <span>{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add a Comment Input Box */}
                  <form 
                    onSubmit={(e) => handleAddComment(post.id, e)}
                    className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs"
                  >
                    <input
                      id={`comment_input_${post.id}`}
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      placeholder="Add a comment..."
                      className="w-full bg-transparent text-xs text-slate-900 outline-none pr-2 placeholder-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={!commentInputs[post.id]?.trim()}
                      className="font-bold text-[#7256c3] hover:text-[#5d42a6] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs shrink-0"
                    >
                      Post
                    </button>
                  </form>

                </div>
              </article>
            );
          })}
        </div>

      </div>

      {/* ── Right Desktop Column: User Profile & Suggested Follows (Matching Image 1) ── */}
      <aside className="hidden lg:block w-80 space-y-6 pt-4 text-xs shrink-0">
        
        {/* Current User Row */}
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setActiveTab('profile')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Avatar
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'}
              name={user?.name || 'Raman Raj'}
              size="md"
              className="border border-slate-200 group-hover:scale-105 transition-transform"
            />
            <div>
              <p className="font-bold text-slate-900 text-xs">{user?.username || 'ramanraj'}</p>
              <p className="text-slate-500 text-[11px]">{user?.name || 'Raman Raj'}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className="text-[11px] font-bold text-[#7256c3] hover:text-[#5d42a6] cursor-pointer"
          >
            Switch
          </button>
        </div>

        {/* Suggested For You Header */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500">Suggested for you</span>
            <button 
              onClick={() => setActiveTab('explore')}
              className="font-bold text-slate-900 hover:text-[#7256c3] cursor-pointer text-[11px]"
            >
              See all
            </button>
          </div>

          {/* Suggested Accounts List */}
          <div className="space-y-3">
            {SUGGESTED_USERS.map((sUser) => {
              const isFollowing = !!followingMap[sUser.id];
              return (
                <div key={sUser.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 truncate">
                    <Avatar src={sUser.avatar} name={sUser.name} size="sm" />
                    <div className="truncate leading-tight">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-900 text-xs truncate">
                          {sUser.name}
                        </span>
                        {sUser.isVerified && (
                          <span className="w-3 h-3 rounded-full bg-[#7256c3] text-white text-[8px] flex items-center justify-center font-bold shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block">
                        {sUser.handle}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollowUser(sUser.id)}
                    className={`text-[11px] font-bold cursor-pointer transition-colors shrink-0 ${
                      isFollowing
                        ? 'text-slate-400 hover:text-slate-600'
                        : 'text-[#7256c3] hover:text-[#5d42a6]'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instagram Footer Meta Links */}
        <div className="pt-6 border-t border-slate-200/60 text-[11px] text-slate-400 space-y-3 leading-relaxed">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Locations', 'Language', 'Meta Verified'].map((link) => (
              <a key={link} href="#footer" className="hover:underline">{link}</a>
            ))}
          </div>
          <p className="uppercase text-[10px] font-mono tracking-wider text-slate-400">
            © 2026 PINGX FROM META
          </p>
        </div>

        {/* Floating Messages Bubble at bottom right (Matching Image 1) */}
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setActiveTab('chats')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#e6e2f8] shadow-xl hover:shadow-2xl text-slate-900 text-xs font-bold transition-all hover:scale-105 cursor-pointer"
          >
            <div className="relative">
              <Send className="w-4 h-4 text-[#7256c3]" />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center">
                1
              </span>
            </div>
            <span>Messages</span>
            <Avatar 
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'}
              name={user?.name || 'Raman Raj'}
              size="xs"
              className="w-5 h-5 ml-1"
            />
          </button>
        </div>

      </aside>

      {/* Story Viewer Modal */}
      <StoryViewerModal
        isOpen={!!selectedStory}
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />

    </div>
  );
}
