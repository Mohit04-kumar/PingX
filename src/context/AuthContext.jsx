import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENT_USER, MOCK_USERS } from '../data/mockUsers';

const AuthContext = createContext();

const DEMO_ACCOUNTS = [];
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4001';
const STORAGE_KEY = 'pingx_registered_accounts';
const REQUESTS_KEY = 'pingx_friend_requests';

const safeStorage = {
  getItem(key, fallback) {
    if (typeof window === 'undefined') return fallback;
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  setItem(key, value) {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    }
  },
  removeItem(key) {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch {}
    }
  }
};

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useState(() => {
    const saved = safeStorage.getItem(STORAGE_KEY, []);
    const DUMMY_IDS = ['user_1', 'user_2', 'user_3', 'user_sneha', 'user_alex', 'user_priya', 'user_marcus'];
    const clean = Array.isArray(saved)
      ? saved.filter((a) => !DUMMY_IDS.includes(a?.id) && a?.email !== 'rahul@example.com')
      : [];
    if (!clean.some((c) => c.id === CURRENT_USER.id || c.email === CURRENT_USER.email)) {
      clean.unshift(CURRENT_USER);
    }
    safeStorage.setItem(STORAGE_KEY, clean);
    return clean;
  });

  const [friendRequests, setFriendRequests] = useState(() =>
    safeStorage.getItem(REQUESTS_KEY, [])
  );

  const [token, setToken] = useState(() => safeStorage.getItem('pingx_token', null));
  const [user, setUser] = useState(() => {
    const saved = safeStorage.getItem('pingx_active_user', null);
    if (!saved) return null;
    const DUMMY_IDS = ['user_1', 'user_2', 'user_3', 'user_sneha', 'user_alex', 'user_priya', 'user_marcus'];
    if (DUMMY_IDS.includes(saved.id) || saved.email === 'rahul@example.com') {
      safeStorage.removeItem('pingx_active_user');
      return null;
    }
    return saved;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = safeStorage.getItem('pingx_active_user', null);
    if (!saved) return false;
    const DUMMY_IDS = ['user_1', 'user_2', 'user_3', 'user_sneha', 'user_alex', 'user_priya', 'user_marcus'];
    if (DUMMY_IDS.includes(saved.id) || saved.email === 'rahul@example.com') {
      return false;
    }
    return true;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestSecondsLeft, setGuestSecondsLeft] = useState(120);

  // 2-minute Guest Account countdown timer: after 2 mins prompts user to sign in or register
  useEffect(() => {
    if (!isGuest || !isAuthenticated) return;
    const interval = setInterval(() => {
      setGuestSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAuthMode('register');
          setAuthModalOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isGuest, isAuthenticated]);

  const startGuestSession = () => {
    const guestUser = {
      id: `guest_${Date.now()}`,
      name: 'Guest Explorer',
      username: `guest_${Math.floor(1000 + Math.random() * 9000)}`,
      email: 'guest@pingx.app',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      bio: 'Exploring PingX in Guest Mode',
      role: 'Guest Member',
      location: 'Guest Session',
      isGuest: true,
      joinedDate: 'Today'
    };
    setUser(guestUser);
    setIsAuthenticated(true);
    setIsGuest(true);
    setGuestSecondsLeft(120);
    return guestUser;
  };

  const openProfileSetup = () => setIsProfileSetupOpen(true);
  const closeProfileSetup = () => setIsProfileSetupOpen(false);

  // Automatically fetch registered users from MongoDB Atlas on load
  useEffect(() => {
    fetch(`${API_BASE}/api/users`)
      .then((r) => r.json())
      .then((remote) => {
        if (Array.isArray(remote)) {
          setAccounts(remote);
        }
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEY, accounts);
  }, [accounts]);

  useEffect(() => {
    safeStorage.setItem(REQUESTS_KEY, friendRequests);
  }, [friendRequests]);

  useEffect(() => {
    if (user) {
      safeStorage.setItem('pingx_active_user', user);
    } else {
      safeStorage.removeItem('pingx_active_user');
    }
  }, [user]);

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const normalizeUsername = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');

  const login = (emailOrUsername, password) => {
    const sanitized = String(emailOrUsername || '').trim();
    
    // Find matching account or create fallback user profile immediately
    const found = accounts.find((a) => 
      a.email?.toLowerCase() === sanitized.toLowerCase() || 
      a.username?.toLowerCase() === sanitized.toLowerCase()
    ) || {
      id: `usr_${Date.now()}`,
      name: sanitized.includes('@') ? sanitized.split('@')[0] : sanitized,
      username: sanitized.replace(/\s+/g, '').toLowerCase(),
      email: sanitized.includes('@') ? sanitized : `${sanitized}@pingx.app`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'PingX Community Member',
      role: 'Member',
      location: 'India',
      joinedDate: new Date().getFullYear().toString()
    };

    setUser(found);
    setIsAuthenticated(true);
    setIsGuest(false);
    safeStorage.setItem('pingx_active_user', found);

    // Sync with remote server if active
    fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: sanitized, password })
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.token && json.user) {
          setToken(json.token);
          setUser(json.user);
          safeStorage.setItem('pingx_token', json.token);
          safeStorage.setItem('pingx_active_user', json.user);
        }
      })
      .catch(() => {});

    return { success: true };
  };

  const register = ({ name, username, email, phone, gender, dob, password, verificationToken, avatar, bio, location }) => {
    const cleanUsername = (username || name || 'user').toLowerCase().replace(/\s+/g, '');
    const cleanPhone = String(phone || '').replace(/[\s()-]/g, '');
    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || 'User',
      username: cleanUsername,
      email: email || `${cleanUsername}@pingx.app`,
      phone: cleanPhone,
      phoneVerified: true,
      gender: gender || 'Prefer not to say',
      dob: dob || '',
      password: password || '',
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanUsername)}`,
      bio: bio || 'PingX Member',
      role: 'Member',
      location: location || 'India',
      gallery: [],
      profileSetupCompleted: true,
      joinedDate: new Date().getFullYear().toString()
    };

    setAccounts((prev) => [newUser, ...prev]);
    setUser(newUser);
    setIsAuthenticated(true);
    setIsGuest(false);
    setIsProfileSetupOpen(false);
    safeStorage.setItem('pingx_active_user', newUser);

    // Sync with remote backend service
    fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        username: cleanUsername,
        email,
        phone: cleanPhone,
        gender,
        dob,
        password,
        verificationToken,
        avatar: newUser.avatar,
        bio: newUser.bio,
        location: newUser.location
      })
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.token && json.user) {
          setToken(json.token);
          setUser(json.user);
          safeStorage.setItem('pingx_token', json.token);
          safeStorage.setItem('pingx_active_user', json.user);
        }
      })
      .catch(() => {});

    return { success: true, user: newUser };
  };

  const loginWithPhoneOtp = async (phone, code) => {
    const cleanPhone = String(phone || '').replace(/[\s()-]/g, '');
    try {
      const res = await fetch(`${API_BASE}/api/auth/otp/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, code })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Phone OTP login failed');
      }

      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        setIsGuest(false);
        safeStorage.setItem('pingx_token', data.token);
        safeStorage.setItem('pingx_active_user', data.user);
        return { success: true, user: data.user };
      }
      return data;
    } catch (err) {
      console.error('loginWithPhoneOtp error:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsGuest(false);
    setGuestSecondsLeft(120);
    setIsProfileSetupOpen(false);
    safeStorage.setItem('pingx_active_user', null);
    safeStorage.setItem('pingx_token', null);
  };

  const switchAccount = (accountUser) => {
    setUser(accountUser);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
  };

  const updateProfile = (updatedData) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    setAccounts((prev) => prev.map((a) => (a.id === user.id ? updated : a)));
    safeStorage.setItem('pingx_active_user', updated);

    // Sync to backend MongoDB
    fetch(`${API_BASE}/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    }).catch(() => {});
  };

  const updateAvatar = (newAvatarUrl) => {
    if (!user) return;
    const updated = { ...user, avatar: newAvatarUrl };
    setUser(updated);
    setAccounts((prev) => prev.map((a) => (a.id === user.id ? updated : a)));
    safeStorage.setItem('pingx_active_user', updated);

    fetch(`${API_BASE}/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatar: newAvatarUrl })
    }).catch(() => {});
  };

  const searchUsers = (query = '') => {
    const term = String(query || '').trim();
    // kickoff remote search but return local results immediately for snappy UI
    if (term) {
      fetch(`${API_BASE}/api/users?query=${encodeURIComponent(term)}`)
        .then((r) => r.json())
        .then((remote) => {
          if (Array.isArray(remote) && remote.length > 0) {
            // Merge remote accounts without duplicates
            setAccounts((prev) => {
              const map = new Map(prev.map((p) => [p.id, p]));
              remote.forEach((r) => map.set(r.id, { ...map.get(r.id), ...r }));
              return Array.from(map.values());
            });
          }
        })
        .catch(() => {});
    }

    const lower = term.toLowerCase();
    if (!lower) return accounts.filter((account) => account.id !== user?.id);
    return accounts.filter((account) => {
      if (account.id === user?.id) return false;
      const searchTarget = `${account.name} ${account.username} ${account.email} ${account.phone || ''} ${account.bio || ''}`.toLowerCase();
      return searchTarget.includes(lower);
    });
  };

  const sendFriendRequest = (targetUserId) => {
    if (!user || !targetUserId || targetUserId === user.id) {
      return { success: false, error: 'You cannot send a request to yourself.' };
    }

    const requestAlreadyExists = friendRequests.some(
      (request) =>
        request.senderId === user.id && request.receiverId === targetUserId && ['pending', 'accepted'].includes(request.status)
    );

    if (requestAlreadyExists) {
      return { success: false, error: 'A pending or accepted request already exists.' };
    }

    const newRequest = {
      id: `request_${Date.now()}`,
      senderId: user.id,
      receiverId: targetUserId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // optimistic local update
    setFriendRequests((prev) => [newRequest, ...prev]);

    // persist to server and return a promise so callers can react
    return fetch(`${API_BASE}/api/friend-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: user.id, receiverId: targetUserId })
    })
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) {
          // revert optimistic update on failure
          setFriendRequests((prev) => prev.filter((r) => r.id !== newRequest.id));
          return { success: false, error: json.error || 'Server rejected request' };
        }
        // replace temporary id with server-provided id if available
        if (json.request && json.request.id && json.request.id !== newRequest.id) {
          setFriendRequests((prev) => prev.map((r) => (r.id === newRequest.id ? { ...r, ...json.request } : r)));
        }
        return { success: true, request: json.request || newRequest };
      })
      .catch((err) => {
        setFriendRequests((prev) => prev.filter((r) => r.id !== newRequest.id));
        return { success: false, error: err?.message || 'Network error' };
      });
  };

  const respondToFriendRequest = (requestId, responseStatus) => {
    if (!['accepted', 'rejected', 'cancelled'].includes(responseStatus)) {
      return { success: false, error: 'Invalid friend request action.' };
    }
    setFriendRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: responseStatus, updatedAt: new Date().toISOString() } : request
      )
    );

    // notify server and if accepted, create a chat between participants
    return fetch(`${API_BASE}/api/respond-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, status: responseStatus })
    })
      .then((r) => r.json())
      .then((json) => {
        if (!json || !json.success) return { success: false, error: json?.error || 'Server error' };
        // If server created a chat for the accepted request, return it
        if (json.chat) return { success: true, chat: json.chat };
        return { success: true };
      })
      .catch(() => ({ success: false, error: 'Network error' }));
  };

  const getIncomingRequests = () =>
    friendRequests.filter((request) => request.receiverId === user?.id);

  const getOutgoingRequests = () =>
    friendRequests.filter((request) => request.senderId === user?.id);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      accounts,
      demoAccounts: DEMO_ACCOUNTS,
      authModalOpen,
      setAuthModalOpen,
      authMode,
      setAuthMode,
      openAuthModal,
      login,
      loginWithPhoneOtp,
      register,
      logout,
      switchAccount,
      updateProfile,
      updateAvatar,
      friendRequests,
      searchUsers,
      sendFriendRequest,
      respondToFriendRequest,
      getIncomingRequests,
      getOutgoingRequests,
      isProfileSetupOpen,
      openProfileSetup,
      closeProfileSetup,
      isGuest,
      guestSecondsLeft,
      startGuestSession
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 
