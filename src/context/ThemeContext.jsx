import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const AVAILABLE_THEMES = [
  { id: 'light', name: 'Light', bg: '#F8FAFC', accent: '#ea580c' }
];

export function ThemeProvider({ children }) {
  const theme = 'light';

  useEffect(() => {
    localStorage.setItem('pingx_theme', 'light');
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-animation', 'theme-background');
    root.classList.add('theme-light', 'light-mode');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: () => {}, availableThemes: AVAILABLE_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
