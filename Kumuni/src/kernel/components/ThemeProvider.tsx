// src/kernel/components/ThemeProvider.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Theme, defaultTheme } from '../utils/theme';

interface ThemeContextType {
  theme: Theme;
  updateTheme: (newTheme: Partial<Theme>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Partial<Theme>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = {}
}) => {
  const [theme, setTheme] = useState<Theme>({
    ...defaultTheme,
    ...initialTheme,
  });

  const updateTheme = (newTheme: Partial<Theme>) => {
    setTheme(prev => ({
      ...prev,
      ...newTheme,
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};