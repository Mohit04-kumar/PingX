// Secure Auth API Client interfacing with Node.js Express backend
const API_BASE = import.meta.env.VITE_API_BASE || '';

export const authApi = {
  // 1. Register user with detailed profile & password
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

  // 2. Login with identity (email / username / phone) and password
  async login(identityOrCredentials, maybePassword) {
    try {
      const payload = typeof identityOrCredentials === 'object' && identityOrCredentials !== null
        ? identityOrCredentials
        : { identity: identityOrCredentials, password: maybePassword };

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
  }
};

export default authApi;
