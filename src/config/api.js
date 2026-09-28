/**
 * Dynamic API and Socket URL configuration.
 * Works seamlessly whether accessing from:
 * 1. Localhost on dev machine (http://localhost:5173)
 * 2. Mobile device / 2nd laptop on Wi-Fi (http://192.168.x.x:5173)
 * 3. Deployed cloud instance via VITE_API_BASE
 */

export function getApiBase() {
  const envApi = import.meta.env.VITE_API_BASE;
  if (envApi && typeof envApi === 'string' && envApi.trim() !== '' && !envApi.includes('localhost')) {
    return envApi.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const { hostname, protocol, port } = window.location;
    // When served via Vite dev server, use relative URL '' so requests route through Vite's proxy
    if (port && port !== '4001') {
      return '';
    }
    return `${protocol}//${hostname}:4001`;
  }

  return 'http://localhost:4001';
}

export function getSocketUrl() {
  const envSocket = import.meta.env.VITE_SOCKET_URL;
  if (envSocket && typeof envSocket === 'string' && envSocket.trim() !== '' && !envSocket.includes('localhost')) {
    return envSocket.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const { hostname, protocol, port } = window.location;
    // Vite proxies /socket.io directly when connecting to current origin
    if (port && port !== '4001') {
      return `${protocol}//${hostname}:${port}`;
    }
    return `${protocol}//${hostname}:4001`;
  }

  return 'http://localhost:4001';
}

export const API_BASE = getApiBase();
export const SOCKET_URL = getSocketUrl();
