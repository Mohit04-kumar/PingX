import React, { useState } from 'react';
import { User } from 'lucide-react';

export function Avatar({
  src,
  name = '',
  size = 'md',
  className = '',
  style = {},
  showOnline = false,
  online = true,
  onClick,
  alt = ''
}) {
  const [imgError, setImgError] = useState(false);

  // Size definitions
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  // Generate clean initials from name
  const getInitials = (str) => {
    if (!str || typeof str !== 'string') return '';
    const parts = str.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);
  const hasValidSrc = Boolean(src && typeof src === 'string' && src.trim() && !imgError);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl select-none overflow-hidden transition-transform ${currentSizeClass} ${className}`}
      style={{
        backgroundColor: hasValidSrc ? 'transparent' : 'var(--accent)',
        color: '#ffffff',
        ...style
      }}
      title={alt || name || 'User Avatar'}
    >
      {hasValidSrc ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : initials ? (
        <span className="font-extrabold font-heading tracking-wide uppercase">
          {initials}
        </span>
      ) : (
        <User className="w-1/2 h-1/2 text-white/90" />
      )}

      {showOnline && (
        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ring-1 ring-black/10"
          style={{ backgroundColor: online ? '#22c55e' : '#9ca3af' }}
        />
      )}
    </div>
  );
}
