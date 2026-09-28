/**
 * Dynamic API and Socket URL configuration.
 * Works seamlessly whether accessing from:
 * 1. Deployed cloud instance on Vercel (https://ping-x-murex.vercel.app)
 * 2. Localhost on dev machine (http://localhost:5173)
 * 3. Mobile device / 2nd laptop on Wi-Fi (http://192.168.x.x:5173)
 */

export function getApiBase() {
  const envApi = import.meta.env.VITE_API_BASE;
  if (envApi && typeof envApi === 'string' && envApi.trim() !== '' && !envApi.includes('localhost')) {
    return envApi.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    // On Vercel or cloud deployment (or standard port 80/443), ALWAYS use relative URL ''
    // so requests route directly to /api serverless functions
    if (hostname.includes('vercel.app') || !port || port === '80' || port === '443') {
      return '';
    }
    // When served via Vite dev server, use relative URL '' so requests route through Vite proxy
    if (port !== '4001') {
      return '';
    }
    return `http://${hostname}:4001`;
  }

  return '';
}

export function getSocketUrl() {
  const envSocket = import.meta.env.VITE_SOCKET_URL;
  if (envSocket && typeof envSocket === 'string' && envSocket.trim() !== '' && !envSocket.includes('localhost')) {
    return envSocket.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const { hostname, protocol, port } = window.location;
    if (hostname.includes('vercel.app') || !port || port === '80' || port === '443') {
      return `${protocol}//${hostname}`;
    }
    if (port !== '4001') {
      return `${protocol}//${hostname}:${port}`;
    }
    return `${protocol}//${hostname}:4001`;
  }

  return 'http://localhost:4001';
}

export const API_BASE = getApiBase();
export const SOCKET_URL = getSocketUrl();
