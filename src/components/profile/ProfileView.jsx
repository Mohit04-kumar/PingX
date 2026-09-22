import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useShop } from '../../context/ShopContext';
import { Avatar } from '../common/Avatar';
import { 
  Mail, 
  MapPin, 
  Edit3, 
  Check, 
  Camera, 
  Upload, 
  Phone, 
  Award,
  Cake,
  Trash2
} from 'lucide-react';

export function ProfileView() {
  const { user, updateProfile, updateAvatar } = useAuth();
  const { chats } = useChat();
  const { watchlist } = useShop();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [role, setRole] = useState(user?.role || 'Member');
  const [location, setLocation] = useState(user?.location || '');

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [saveNotice, setSaveNotice] = useState(false);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setDob(user.dob || '');
      setBio(user.bio || '');
      setRole(user.role || 'Member');
      setLocation(user.location || '');
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const totalMessagesSent = chats.reduce((acc, c) => acc + (c.messages?.length || 0), 0);

  const handleSave = () => {
    updateProfile({ name, username, email, phone, dob, bio, role, location });
    setIsEditing(false);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  const handleFileChange = (e) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        // Max 5MB check
        if (file.size > 5 * 1024 * 1024) {
          alert("Please upload an image smaller than 5MB.");
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const dataUrl = event.target.result;
            setAvatarPreview(dataUrl);
            updateAvatar(dataUrl);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png,image/jpeg,image/webp,image/jpg" 
        className="hidden" 
      />

      {/* Profile Header Card */}
      <div 
        className="rounded-3xl p-6 sm:p-8 border relative overflow-hidden space-y-6 shadow-sm"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          
          {/* Avatar with Camera Overlay */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar 
                src={avatarPreview} 
                name={name} 
                size="2xl" 
                className="border-2 shadow-md group-hover:opacity-85 transition-opacity"
                style={{ borderColor: 'var(--accent)' }}
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                <Upload className="w-6 h-6" />
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl text-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: 'var(--accent)' }}
                title="Upload new Avatar photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {avatarPreview && (
              <button
                type="button"
                onClick={() => {
                  setAvatarPreview('');
                  updateAvatar('');
                }}
                className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                title="Remove photo"
              >
                <Trash2 className="w-3 h-3" /> Remove Photo
              </button>
            )}
          </div>

          <div className="text-center sm:text-left space-y-1 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-extrabold font-heading" style={{ color: 'var(--text-primary)' }}>
                {name || 'User'}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 font-mono" style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                <Award className="w-3 h-3" /> Verified Member
              </span>
            </div>
            <p className="text-xs font-mono font-bold" style={{ color: 'var(--accent)' }}>@{username || 'user'}</p>
            <p className="text-xs max-w-md pt-1" style={{ color: 'var(--text-secondary)' }}>{bio || 'No bio added yet'}</p>
          </div>

          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="btn-primary btn-shimmer px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md self-center sm:self-start"
          >
            {isEditing ? <><Check className="w-4 h-4" /> Save Profile</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
          </button>
        </div>

        {saveNotice && (
          <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-700 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4" /> Profile updated and saved successfully!
          </div>
        )}

        {/* User Activity Counters */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t text-center" style={{ borderColor: 'var(--border)' }}>
          <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
            <span className="text-[10px] uppercase font-mono block" style={{ color: 'var(--text-muted)' }}>Messages Sent</span>
            <span className="text-lg font-extrabold font-heading" style={{ color: 'var(--text-primary)' }}>{totalMessagesSent}</span>
          </div>
          <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
            <span className="text-[10px] uppercase font-mono block" style={{ color: 'var(--text-muted)' }}>Connections</span>
            <span className="text-lg font-extrabold font-heading" style={{ color: 'var(--accent)' }}>{chats.length}</span>
          </div>
          <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
            <span className="text-[10px] uppercase font-mono block" style={{ color: 'var(--text-muted)' }}>Watched Deals</span>
            <span className="text-lg font-extrabold font-heading" style={{ color: 'var(--text-primary)' }}>{watchlist.length}</span>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="pt-6 border-t space-y-4 text-xs" style={{ borderColor: 'var(--border)' }}>
            <h4 className="text-sm font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              Edit Account Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Display Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full rounded-xl px-4 py-2.5 border outline-none font-medium"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Username (@handle)</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full rounded-xl px-4 py-2.5 border outline-none font-medium"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full rounded-xl px-4 py-2.5 border outline-none font-medium"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full rounded-xl px-4 py-2.5 border outline-none font-medium"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Date of Birth (DOB)</label>
                <input 
                  type="date" 
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)} 
                  className="w-full rounded-xl px-4 py-2.5 border outline-none font-medium"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Role / Title</label>
                <input 
                  type="text" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  className="w-full rounded-xl px-4 py-2.5 border outline-none font-medium"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  className="w-full rounded-xl px-4 py-2.5 border outline-none font-medium"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>About / Bio</label>
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                rows={3} 
                className="w-full rounded-xl p-3.5 border outline-none font-medium"
                style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={handleSave} 
                className="btn-primary px-7 py-3 rounded-xl font-bold cursor-pointer shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Account Details Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border space-y-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <span className="text-[10px] uppercase font-mono" style={{ color: 'var(--text-muted)' }}>Email</span>
          <p className="text-xs font-bold flex items-center gap-1.5 truncate" style={{ color: 'var(--text-primary)' }}>
            <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent)' }} /> {email || 'Not set'}
          </p>
        </div>

        <div className="p-4 rounded-2xl border space-y-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <span className="text-[10px] uppercase font-mono" style={{ color: 'var(--text-muted)' }}>Phone</span>
          <p className="text-xs font-bold flex items-center gap-1.5 truncate" style={{ color: 'var(--text-primary)' }}>
            <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent)' }} /> {phone || 'Not set'}
          </p>
        </div>

        <div className="p-4 rounded-2xl border space-y-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <span className="text-[10px] uppercase font-mono" style={{ color: 'var(--text-muted)' }}>Date of Birth</span>
          <p className="text-xs font-bold flex items-center gap-1.5 truncate" style={{ color: 'var(--text-primary)' }}>
            <Cake className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent)' }} /> {dob || 'Not set'}
          </p>
        </div>

        <div className="p-4 rounded-2xl border space-y-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <span className="text-[10px] uppercase font-mono" style={{ color: 'var(--text-muted)' }}>Location</span>
          <p className="text-xs font-bold flex items-center gap-1.5 truncate" style={{ color: 'var(--text-primary)' }}>
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent)' }} /> {location || 'Not set'}
          </p>
        </div>
      </div>

    </div>
  );
}
