import React, { useState, useMemo } from 'react';
import { Search, Play, Heart, MessageCircle, Eye, SlidersHorizontal, Tag, ExternalLink, X, User } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useProfileModal } from '../../context/ProfileModalContext';

const EXPLORE_POSTS = [
  {
    id: 'exp_1',
    type: 'video',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80',
    title: 'Sony WH-1000XM5 Deep Bass & ANC Test',
    author: 'ramanraj',
    likes: '14.2k',
    comments: '842',
    views: '128k',
    isReel: true,
    aspect: 'tall'
  },
  {
    id: 'exp_2',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80',
    title: 'MacBook Air M3 Desk Workspace Setup',
    author: 'snehak',
    likes: '8.4k',
    comments: '312',
    isReel: false,
    aspect: 'square'
  },
  {
    id: 'exp_3',
    type: 'video',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
    title: 'Nike Air Max Impact 4 Unboxing & Cushion Review',
    author: 'alexchen',
    likes: '6.1k',
    comments: '189',
    views: '45k',
    isReel: true,
    aspect: 'square'
  },
  {
    id: 'exp_4',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=700&q=80',
    title: 'Samsung Galaxy Watch6 Sapphire Display Test',
    author: 'marcusv',
    likes: '4.8k',
    comments: '145',
    isReel: false,
    aspect: 'square'
  },
  {
    id: 'exp_5',
    type: 'video',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80',
    title: 'Minimalist Engineering Desk Cable Management',
    author: 'priya_tech',
    likes: '22.5k',
    comments: '1.2k',
    views: '240k',
    isReel: true,
    aspect: 'tall'
  },
  {
    id: 'exp_6',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
    title: 'Hi-Fi Audio Rig & Lossless DAC Listening Station',
    author: 'ramanraj',
    likes: '9.2k',
    comments: '412',
    isReel: false,
    aspect: 'square'
  },
  {
    id: 'exp_7',
    type: 'video',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
    title: 'Apple Watch Ultra vs Series 9 Battery Drain Test',
    author: 'marcusv',
    likes: '11.8k',
    comments: '560',
    views: '98k',
    isReel: true,
    aspect: 'square'
  },
  {
    id: 'exp_8',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=700&q=80',
    title: 'Retro Gaming Mechanical Keyboard Custom Build',
    author: 'snehak',
    likes: '15.3k',
    comments: '720',
    isReel: false,
    aspect: 'square'
  }
];

export function ExploreView() {
  const { accounts = [], user } = useAuth();
  const { openUserProfile } = useProfileModal();
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  // Combine user-created posts + genuine accounts showcase posts + curated explore items
  const allPosts = useMemo(() => {
    let userPosts = [];
    try {
      const saved = JSON.parse(localStorage.getItem('pingx_user_posts') || '[]');
      if (Array.isArray(saved)) {
        userPosts = saved.map((p) => ({
          id: p.id,
          type: 'image',
          image: p.image,
          title: p.title || p.caption || 'Community Post',
          author: p.author?.username || p.author?.name || user?.username || 'user',
          authorData: p.author || user,
          likes: `${p.likesCount || 1}`,
          comments: `${p.commentsCount || 0}`,
          isReel: false,
          aspect: 'square'
        }));
      }
    } catch {}

    // Posts for real registered accounts
    const accountPosts = accounts
      .filter((a) => a.id !== user?.id && a.avatar)
      .slice(0, 3)
      .map((a, idx) => ({
        id: `account_post_${a.id}`,
        type: idx % 2 === 0 ? 'image' : 'video',
        image: a.avatar,
        title: a.bio || `${a.name}'s verified showcase`,
        author: a.username || a.name,
        authorData: a,
        likes: `${12 + idx * 8}`,
        comments: `${2 + idx * 3}`,
        isReel: idx % 2 !== 0,
        aspect: 'square'
      }));

    return [...userPosts, ...accountPosts, ...EXPLORE_POSTS];
  }, [accounts, user]);

  const filtered = allPosts.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || String(p.author).toLowerCase().includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16 text-slate-900">
      
      {/* Top Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search accounts, reviews, media or topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#e6e2f8] text-xs text-slate-900 outline-none focus:border-[#7256c3] shadow-xs transition-colors font-medium"
          />
        </div>
      </div>

      {/* Dynamic Explore Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        {filtered.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className={`relative rounded-2xl overflow-hidden cursor-pointer group bg-slate-100 shadow-2xs border border-slate-200 ${
              post.aspect === 'tall' ? 'row-span-2 min-h-[380px]' : 'aspect-square'
            }`}
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Reel / Video badge in top right */}
            {post.type === 'video' && (
              <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white">
                <Play className="w-3.5 h-3.5 fill-white" />
              </div>
            )}

            {/* Hover overlay with likes & comments */}
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 text-white font-bold text-xs p-4 text-center">
              <p className="line-clamp-2 text-xs font-semibold">{post.title}</p>
              <span className="text-[11px] text-violet-200">@{post.author}</span>
              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[85vh] flex flex-col sm:flex-row shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="sm:w-1/2 bg-slate-900 flex items-center justify-center">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover min-h-[300px] max-h-[450px]" />
            </div>
            <div className="sm:w-1/2 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Author row with click to open profile */}
                <button
                  type="button"
                  onClick={() => {
                    const postAuthor = selectedPost.authorData || accounts.find(
                      (a) => a.username === selectedPost.author || a.name === selectedPost.author
                    ) || { name: selectedPost.author, username: selectedPost.author, avatar: selectedPost.image };
                    setSelectedPost(null);
                    openUserProfile(postAuthor);
                  }}
                  className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 text-left group cursor-pointer w-full"
                  title="Click to view full user profile"
                >
                  <Avatar 
                    src={selectedPost.authorData?.avatar || selectedPost.image} 
                    name={selectedPost.author} 
                    size="sm"
                    className="border group-hover:border-[#7256c3] transition-colors"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 group-hover:text-[#7256c3] transition-colors block">
                      @{selectedPost.author}
                    </span>
                    <span className="text-[10px] text-slate-400">View Member Profile →</span>
                  </div>
                </button>

                <h4 className="font-bold text-sm text-slate-900 font-heading leading-snug">{selectedPost.title}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold"><Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> {selectedPost.likes}</span>
                  <span className="flex items-center gap-1 font-semibold"><MessageCircle className="w-4 h-4 text-slate-400" /> {selectedPost.comments}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const postAuthor = selectedPost.authorData || accounts.find(
                      (a) => a.username === selectedPost.author || a.name === selectedPost.author
                    ) || { name: selectedPost.author, username: selectedPost.author, avatar: selectedPost.image };
                    setSelectedPost(null);
                    openUserProfile(postAuthor);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#7256c3] hover:bg-[#6044b3] text-white font-bold text-xs cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> View Creator Profile
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
