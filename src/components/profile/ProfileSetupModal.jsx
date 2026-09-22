import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Check, 
  X, 
  MapPin, 
  Briefcase, 
  Calendar 
} from 'lucide-react';

export function ProfileSetupModal({ isOpen, onClose }) {
  const { user, updateProfile, updateAvatar, closeProfileSetup } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [dob, setDob] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
      setRole(user.role || 'Member');
      setLocation(user.location || '');
      setDob(user.dob || '');
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result;
          setAvatarPreview(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updated = {
      name: name.trim() || user?.name || 'PingX Member',
      username: username.trim().toLowerCase().replace(/\s+/g, '') || user?.username,
      bio: bio.trim(),
      role: role.trim() || 'Member',
      location: location.trim(),
      dob: dob.trim(),
      avatar: avatarPreview || '',
      profileSetupCompleted: true
    };

    updateProfile(updated);
    if (avatarPreview !== undefined) {
      updateAvatar(avatarPreview || '');
    }

    setIsSubmitting(false);
    if (closeProfileSetup) closeProfileSetup();
    if (onClose) onClose();
  };

  const handleSkip = () => {
    updateProfile({ profileSetupCompleted: true });
    if (closeProfileSetup) closeProfileSetup();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl relative space-y-6 max-h-[92vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        {/* Skip / Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          title="Skip setup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Welcome Header */}
        <div className="text-center space-y-2 pt-1">
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            Welcome to PingX
          </div>
          <h2 className="text-2xl font-extrabold font-heading" style={{ color: 'var(--text-primary)' }}>
            Set Up Your Profile
          </h2>
          <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Customize your identity so friends and collaborators can recognize you.
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/webp,image/jpg"
          className="hidden"
        />

        {/* Avatar Upload / Initial Preview */}
        <div className="flex flex-col items-center justify-center gap-3 pt-2">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar
              src={avatarPreview}
              name={name || user?.name || 'User'}
              size="2xl"
              className="border-2 shadow-md group-hover:opacity-90 transition-opacity"
              style={{ borderColor: 'var(--accent)' }}
            />
            <div 
              className="absolute -bottom-1 -right-1 p-2 rounded-xl text-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: 'var(--accent)' }}
              title="Upload photo"
            >
              <Camera className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer hover:opacity-85 transition-opacity"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
            >
              <Upload className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              {avatarPreview ? 'Change Photo' : 'Upload Photo'}
            </button>

            {avatarPreview && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-red-500/20 text-red-500 flex items-center gap-1 cursor-pointer hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            )}
          </div>
          {!avatarPreview && (
            <span className="text-[11px] italic" style={{ color: 'var(--text-muted)' }}>
              (No photo selected — clean initials badge will be used)
            </span>
          )}
        </div>

        {/* Profile Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                Display Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full rounded-xl px-3.5 py-2.5 border outline-none font-medium transition-all"
                style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                Username (@handle) *
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. alexmorgan"
                className="w-full rounded-xl px-3.5 py-2.5 border outline-none font-medium font-mono transition-all"
                style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold mb-1 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <Briefcase className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> Role / Profession
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer, Designer, Student"
                className="w-full rounded-xl px-3.5 py-2.5 border outline-none font-medium transition-all"
                style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> Location / City
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New Delhi, India"
                className="w-full rounded-xl px-3.5 py-2.5 border outline-none font-medium transition-all"
                style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-xl px-3.5 py-2.5 border outline-none font-medium transition-all"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
              About / Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community about your interests, work, or hobbies..."
              className="w-full rounded-xl p-3 border outline-none font-medium leading-relaxed resize-none transition-all"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-semibold hover:underline cursor-pointer order-2 sm:order-1"
              style={{ color: 'var(--text-muted)' }}
            >
              Skip for now
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto btn-primary btn-shimmer px-7 py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md order-1 sm:order-2"
            >
              <Check className="w-4 h-4" /> Save &amp; Finish Setup
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
