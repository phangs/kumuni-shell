// src/kernel/utils/theme.ts

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    text: string;
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
    onSurface: string;
    onError: string;
  };
  spacing: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    body1: TextStyle;
    body2: TextStyle;
    button: TextStyle;
  };
}

interface TextStyle {
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  lineHeight?: number;
}

// Default theme
export const defaultTheme: Theme = {
  colors: {
    primary: '#6200ee',
    secondary: '#03dac6',
    background: '#ffffff',
    surface: '#ffffff',
    error: '#b00020',
    text: '#000000',
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    onError: '#ffffff',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  typography: {
    h1: { fontSize: 96, fontWeight: 'normal' },
    h2: { fontSize: 60, fontWeight: 'normal' },
    h3: { fontSize: 48, fontWeight: 'normal' },
    body1: { fontSize: 16, fontWeight: 'normal' },
    body2: { fontSize: 14, fontWeight: 'normal' },
    button: { fontSize: 14, fontWeight: 'bold' },
  },
};

// Function to create a theme from the master config
export const createThemeFromConfig = (configTheme: any): Theme => {
  return {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      primary: configTheme.primaryColor || defaultTheme.colors.primary,
      secondary: configTheme.secondaryColor || defaultTheme.colors.secondary,
    },
  };
};