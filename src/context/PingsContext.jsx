import React, { createContext, useContext, useState } from 'react';
import { MOCK_PINGS } from '../data/mockPings';

const PingsContext = createContext();

export function PingsProvider({ children }) {
  const [pings, setPings] = useState(MOCK_PINGS);
  const [focusMode, setFocusMode] = useState(false);

  const unreadCount = pings.filter((p) => !p.read).length;

  const markAsRead = (id) => {
    setPings((prev) =>
      prev.map((p) => (p.id === id ? { ...p, read: true } : p))
    );
  };

  const markAllAsRead = () => {
    setPings((prev) => prev.map((p) => ({ ...p, read: true })));
  };

  const clearPing = (id) => {
    setPings((prev) => prev.filter((p) => p.id !== id));
  };

  const addPing = (newPing) => {
    if (focusMode && newPing.type === 'social') return; // Focus Mode filters social noise
    setPings((prev) => [newPing, ...prev]);
  };

  const toggleFocusMode = () => {
    setFocusMode((prev) => !prev);
  };

  return (
    <PingsContext.Provider value={{
      pings,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearPing,
      addPing,
      focusMode,
      toggleFocusMode
    }}>
      {children}
    </PingsContext.Provider>
  );
}

export function usePings() {
  return useContext(PingsContext);
}
