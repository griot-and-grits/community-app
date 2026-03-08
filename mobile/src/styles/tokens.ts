/**
 * Design Tokens
 *
 * Based on Griot and Grits brand identity
 * https://griotandgrits.org
 */

export const Colors = {
  // Primary brand colors from griotandgrits.org
  primary: '#ae2c24',        // Primary red
  secondary: '#282420',      // Dark brown/black
  tertiary: '#f1b918',       // Gold/yellow
  accent1: '#f28f1f',        // Orange
  accent2: '#d8a373',        // Tan/beige

  // Gradient colors
  primaryGradientStart: '#ae2c24',
  primaryGradientEnd: '#282420',

  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  cream: '#eceae8',          // Brand background color
  gray100: '#f5f5f5',
  gray200: '#e5e5e5',
  gray300: '#d4d4d4',
  gray400: '#a3a3a3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',

  // Semantic colors
  success: '#22c55e',
  warning: '#f1b918',        // Using brand tertiary for warnings
  error: '#ae2c24',          // Using brand primary for errors
  info: '#f28f1f',           // Using brand accent1 for info

  // UI element colors (light theme)
  background: '#eceae8',     // Brand cream background
  surface: '#ffffff',
  textPrimary: '#282420',    // Brand secondary for text
  textSecondary: '#737373',
  textOnPrimary: '#ffffff',
  border: '#d8a373',         // Brand accent2 for borders
  disabled: '#d4d4d4',

  // Elevation shadows
  elevation: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

export const Typography = {
  // Heading styles
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },

  // Body text styles
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },

  // UI element styles
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },

  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  xxlarge: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
};

export const Layout = {
  minTouchTarget: 44, // iOS HIG minimum
  screenPadding: Spacing.md,
  containerMaxWidth: 1200,
};

export const Animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};
