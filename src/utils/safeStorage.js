/**
 * PingX Safe Storage Engine
 * Prevents QuotaExceededError, storage crashes, and corrupted data from breaking the app.
 */

// Max allowed length for a single stored string (~500KB) to prevent localStorage choking
const MAX_ITEM_LENGTH = 500 * 1024;

export const safeStorage = {
  getItem(key, fallback = null) {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null || raw === undefined || raw === 'undefined' || raw === 'null') {
        return fallback;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn(`[safeStorage] Error reading key "${key}":`, e.message);
      return fallback;
    }
  },

  setItem(key, value) {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    try {
      let serialized = typeof value === 'string' ? value : JSON.stringify(value);

      // Guard against oversized items (e.g. multi-megabyte base64 images)
      if (serialized.length > MAX_ITEM_LENGTH) {
        console.warn(`[safeStorage] Key "${key}" exceeds size limit (${Math.round(serialized.length / 1024)}KB). Trimming.`);
        // If it's an array of accounts/users, sanitize avatars
        if (Array.isArray(value)) {
          const sanitized = value.map((item) => {
            if (item && typeof item === 'object') {
              const copy = { ...item };
              if (copy.avatar && copy.avatar.length > 50000) {
                copy.avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80';
              }
              return copy;
            }
            return item;
          });
          serialized = JSON.stringify(sanitized);
        }
      }

      window.localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.warn(`[safeStorage] Quota or write error on "${key}":`, err.message);

      // Attempt recovery: prune non-critical cache keys to free up quota
      try {
        const nonCriticalKeys = [
          'pingx_user_posts',
          'pingx_user_stories',
          'pingx_user_highlights',
          'pingx_registered_accounts',
          'pingx_watchlist'
        ];
        for (const k of nonCriticalKeys) {
          if (k !== key) {
            window.localStorage.removeItem(k);
          }
        }
        // Retry once after pruning
        const retrySerialized = typeof value === 'string' ? value : JSON.stringify(value);
        window.localStorage.setItem(key, retrySerialized);
        return true;
      } catch (retryErr) {
        console.error(`[safeStorage] Critical: Unable to write key "${key}" even after pruning:`, retryErr.message);
        return false;
      }
    }
  },

  removeItem(key) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[safeStorage] Error removing key "${key}":`, e.message);
    }
  },

  clear() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.clear();
    } catch (e) {
      console.warn('[safeStorage] Error clearing storage:', e.message);
    }
  },

  /**
   * Cleans up oversized base64 avatars from user records to prevent network and storage bloat.
   */
  sanitizeUser(user) {
    if (!user || typeof user !== 'object') return user;
    const clean = { ...user };
    if (clean.avatar && typeof clean.avatar === 'string' && clean.avatar.length > 50000) {
      clean.avatar = clean.gender === 'Female'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
    }
    return clean;
  }
};

export default safeStorage;
