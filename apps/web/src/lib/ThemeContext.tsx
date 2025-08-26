// @author: fatima bashir
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    cardBackground: string;
    cardBorder: string;
    text: string;
    textSecondary: string;
    accent: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const colors = theme === 'dark' ? {
    background: '#0f172a',
    cardBackground: 'rgba(30, 41, 59, 0.8)',
    cardBorder: 'rgba(51, 65, 85, 0.5)',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    accent: '#8b5cf6',
    success: 'rgba(167, 243, 208, 0.4)',
    info: 'rgba(186, 230, 253, 0.4)',
    warning: 'rgba(254, 215, 170, 0.4)',
    danger: 'rgba(252, 165, 165, 0.4)'
  } : {
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #f0f9ff 70%, #fafbfc 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.4)',
    cardBorder: 'rgba(147, 197, 253, 0.08)',
    text: '#1e293b',
    textSecondary: '#64748b',
    accent: '#3b82f6',
    success: 'rgba(167, 243, 208, 0.4)',
    info: 'rgba(186, 230, 253, 0.4)',
    warning: 'rgba(254, 215, 170, 0.4)',
    danger: 'rgba(252, 165, 165, 0.4)'
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
