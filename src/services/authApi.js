// Secure Auth & OTP API Client interfacing with Node.js Express backend
const API_BASE = import.meta.env.VITE_API_BASE || '';

export const authApi = {
  // 1. Send 6-Digit OTP to Email via backend Nodemailer / Gmail SMTP
  async sendOtp(identity, purpose = 'registration') {
    try {
      const clean = String(identity || '').trim();
      const payload = clean.includes('@')
        ? { email: clean.toLowerCase(), purpose }
        : { phone: clean, purpose };

      const res = await fetch(`${API_BASE}/api/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code.');
      }
      return data;
    } catch (err) {
      console.error('sendOtp API error:', err);
      throw err;
    }
  },

  // 2. Verify OTP with backend service
  async verifyOtp(identity, code) {
    try {
      const clean = String(identity || '').trim();
      const payload = clean.includes('@')
        ? { email: clean.toLowerCase(), code }
        : { phone: clean, code };

      const res = await fetch(`${API_BASE}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed. Please check the code.');
      }
      return data;
    } catch (err) {
      console.error('verifyOtp API error:', err);
      throw err;
    }
  },

  // 3. Register user with detailed profile & verified email
  async register(userData) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }
      return data;
    } catch (err) {
      console.error('register API error:', err);
      throw err;
    }
  },

  // 4. Login with identity (email / username / phone) and password
  async login(identity, password) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }
      return data;
    } catch (err) {
      console.error('login API error:', err);
      throw err;
    }
  },

  // 5. Direct login with Email OTP
  async loginWithOtp(identity, code) {
    try {
      const clean = String(identity || '').trim();
      const payload = clean.includes('@')
        ? { email: clean.toLowerCase(), code }
        : { phone: clean, code };

      const res = await fetch(`${API_BASE}/api/auth/otp/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'OTP login failed.');
      }
      return data;
    } catch (err) {
      console.error('loginWithOtp API error:', err);
      throw err;
    }
  },

  // 6. Direct login or account sync with Firebase Phone Auth
  async loginWithFirebase(firebasePayload) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/firebase/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firebasePayload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Firebase phone authentication failed.');
      }
      return data;
    } catch (err) {
      console.error('loginWithFirebase API error:', err);
      throw err;
    }
  }
};

export default authApi;
