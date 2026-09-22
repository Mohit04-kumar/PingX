import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Trash2, 
  X, 
  Play,
  Heart
} from 'lucide-react';

import { Avatar } from '../common/Avatar';

export function GalleryView() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(() => {
    try {
      localStorage.removeItem('pingx_gallery_posts'); // Clear legacy mock data
      if (!user?.id) return [];
      const saved = localStorage.getItem(`pingx_gallery_posts_${user.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeFilter, setActiveFilter] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);

  // Upload Form State
  const [fileType, setFileType] = useState('image'); // 'image' or 'video'
  const [fileDataUrl, setFileDataUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Moments');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`pingx_gallery_posts_${user.id}`, JSON.stringify(posts));
    }
  }, [posts, user?.id]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      setFileType(isVideo ? 'video' : 'image');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileDataUrl(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!fileDataUrl) {
      alert("Please select a photo or video to upload.");
      return;
    }

    const newPost = {
      id: `post_${Date.now()}`,
      type: fileType,
      mediaUrl: fileDataUrl,
      caption: caption || 'New post on PingX Gallery',
      category: category || 'Moments',
      likes: 0,
      likedByUser: false,
      timestamp: 'Just now',
    };

    setPosts([newPost, ...posts]);
    setIsUploadModalOpen(false);
    setFileDataUrl('');
    setCaption('');
  };

  const handleToggleLike = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.likedByUser ? p.likes - 1 : p.likes + 1,
          likedByUser: !p.likedByUser,
        };
      }
      return p;
    }));
  };

  const handleDeletePost = (postId) => {
    if (confirm("Delete this post from your gallery?")) {
      setPosts(posts.filter(p => p.id !== postId));
      if (previewMedia?.id === postId) setPreviewMedia(null);
    }
  };

  const filteredPosts = activeFilter === 'All' 
    ? posts 
    : activeFilter === 'Photos'
    ? posts.filter(p => p.type === 'image')
    : activeFilter === 'Videos'
    ? posts.filter(p => p.type === 'video')
    : posts.filter(p => p.category === activeFilter);

  const photosCount = posts.filter(p => p.type === 'image').length;
  const videosCount = posts.filter(p => p.type === 'video').length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      
      {/* Profile Banner & Gallery Stats */}
      <div 
        className="rounded-3xl p-6 sm:p-8 border shadow-sm relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar
              src={user?.avatar}
              name={user?.name || 'User'}
              size="xl"
              className="border-2 shadow-sm"
              style={{ borderColor: 'var(--accent)' }}
            />
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-extrabold font-heading" style={{ color: 'var(--text-primary)' }}>
                {user?.name || 'Your'}'s Gallery
              </h2>
              <p className="text-xs font-mono font-bold" style={{ color: 'var(--accent)' }}>
                @{user?.username || 'user'}
              </p>
              <p className="text-xs max-w-md" style={{ color: 'var(--text-secondary)' }}>
                {user?.bio || 'Showcasing moments, photos, and project video clips.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-primary btn-shimmer px-7 py-3.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md self-center sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Upload Media
          </button>
        </div>

        {/* Gallery Stats Counters */}
        <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t text-center" style={{ borderColor: 'var(--border)' }}>
          <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
            <span className="text-[10px] uppercase font-mono block" style={{ color: 'var(--text-muted)' }}>Photos</span>
            <span className="text-lg font-extrabold font-heading" style={{ color: 'var(--text-primary)' }}>{photosCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
            <span className="text-[10px] uppercase font-mono block" style={{ color: 'var(--text-muted)' }}>Videos</span>
            <span className="text-lg font-extrabold font-heading" style={{ color: 'var(--text-primary)' }}>{videosCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
            <span className="text-[10px] uppercase font-mono block" style={{ color: 'var(--text-muted)' }}>Total Likes</span>
            <span className="text-lg font-extrabold font-heading" style={{ color: 'var(--accent)' }}>
              {posts.reduce((acc, p) => acc + (p.likes || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl border backdrop-blur-md" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          {['All', 'Photos', 'Videos', 'Moments', 'Work', 'Travel'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === tab 
                  ? 'btn-primary shadow-sm' 
                  : 'hover:opacity-80'
              }`}
              style={activeFilter === tab ? {} : { color: 'var(--text-secondary)' }}
            >
              {tab}
            </button>
          ))}
        </div>

        <p className="text-xs font-mono font-bold" style={{ color: 'var(--text-muted)' }}>
          Showing {filteredPosts.length} of {posts.length} uploads
        </p>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full text-center py-16 rounded-3xl border space-y-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
              <ImageIcon className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                {posts.length === 0 ? 'Your Gallery is Empty' : 'No media in this category'}
              </h4>
              <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
                {posts.length === 0 
                  ? 'No photos or videos uploaded yet. Share your memorable moments and tech previews!' 
                  : 'Try selecting another category or click "+ Upload Media" to add content.'}
              </p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-primary btn-shimmer px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /> Upload Media
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-3xl border overflow-hidden shadow-xs hover-lift flex flex-col justify-between group transition-all"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              {/* Media Preview Thumbnail */}
              <div 
                className="relative aspect-4/3 cursor-pointer overflow-hidden bg-slate-900"
                onClick={() => setPreviewMedia(post)}
              >
                {post.type === 'video' ? (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <video src={post.mediaUrl} className="w-full h-full object-cover opacity-85" />
                    <div className="absolute w-12 h-12 rounded-full bg-black/60 border border-white/30 flex items-center justify-center text-white shadow-xl">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md">
                  {post.category}
                </span>

                <button
                  onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete post"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Caption & Interaction */}
              <div className="p-4 space-y-3">
                <p className="text-xs font-medium line-clamp-2 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {post.caption}
                </p>

                <div className="flex items-center justify-between pt-2 border-t text-xs" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className="flex items-center gap-1.5 font-bold cursor-pointer transition-transform active:scale-125"
                    style={{ color: post.likedByUser ? '#ef4444' : 'var(--text-secondary)' }}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByUser ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {post.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Media Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl relative space-y-5"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              Create Gallery Post
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*,video/*" 
                className="hidden" 
              />

              {/* Upload Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:border-lime-500 transition-colors space-y-2"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}
              >
                {fileDataUrl ? (
                  fileType === 'video' ? (
                    <video src={fileDataUrl} controls className="max-h-48 mx-auto rounded-xl" />
                  ) : (
                    <img src={fileDataUrl} alt="preview" className="max-h-48 mx-auto rounded-xl object-cover" />
                  )
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-8 h-8 mx-auto text-lime-600" />
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>Click to upload Photo or Video</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>PNG, JPG, MP4, WebM (Max 25MB)</p>
                  </div>
                )}
              </div>

              {/* Caption Input */}
              <div>
                <label className="block font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption for your post..."
                  rows={3}
                  className="w-full p-3 rounded-xl border outline-none font-medium"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border outline-none font-medium"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  <option value="Moments">Moments</option>
                  <option value="Work">Work</option>
                  <option value="Tech">Tech</option>
                  <option value="Travel">Travel</option>
                  <option value="Animation">Animation</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3.5 rounded-xl font-bold cursor-pointer shadow-md mt-2"
              >
                Publish Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn" onClick={() => setPreviewMedia(null)}>
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {previewMedia.type === 'video' ? (
              <video src={previewMedia.mediaUrl} controls autoPlay className="w-full max-h-[75vh] object-contain bg-black" />
            ) : (
              <img src={previewMedia.mediaUrl} alt={previewMedia.caption} className="w-full max-h-[75vh] object-contain bg-black" />
            )}

            <div className="p-5 text-white bg-slate-900 space-y-2">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-lime-500/20 text-lime-400">
                {previewMedia.category}
              </span>
              <p className="text-sm font-medium">{previewMedia.caption}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
