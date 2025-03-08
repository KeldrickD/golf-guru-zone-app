// Design System for Golf Guru Zone
// A comprehensive system of colors, typography, spacing and animations

// Color System
export const colors = {
  // Primary Colors
  primary: {
    main: '#0A5F38', // Deep green
    light: '#3A8E68',
    dark: '#053920',
    contrastText: '#FFFFFF',
  },
  
  // Secondary/Accent Colors
  secondary: {
    main: '#F7B500', // Vibrant gold/yellow
    light: '#FFCE47',
    dark: '#CE9600',
    contrastText: '#000000',
  },
  
  // Interface Colors
  interface: {
    slate: '#2C3E50', // Dark slate for text
    cream: '#F9F7F2', // Light cream for backgrounds
    skyBlue: '#4A90E2', // Highlight blue
  },
  
  // Functional Colors
  functional: {
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#5AC8FA',
  },
  
  // Gradients
  gradients: {
    primaryGradient: 'linear-gradient(135deg, #0A5F38 0%, #4A90E2 100%)',
    accentGradient: 'linear-gradient(135deg, #F7B500 0%, #FFD700 100%)',
    premiumGradient: 'linear-gradient(135deg, #0A5F38 0%, #0E7C4A 50%, #0A5F38 100%)',
  },
  
  // Text Colors
  text: {
    primary: '#2C3E50',
    secondary: '#5E738A',
    disabled: '#A0AEC0',
    inverse: '#FFFFFF',
  },
  
  // Background Colors
  background: {
    default: '#F9F7F2',
    paper: '#FFFFFF',
    dark: '#1A202C',
  },
  
  // Border Colors
  border: {
    light: '#E2E8F0',
    medium: '#CBD5E0',
    dark: '#718096',
  },
};

// Typography
export const typography = {
  fontFamily: {
    main: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    accent: "'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    md: '1rem',        // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.625,
  },
};

// Spacing
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  outline: '0 0 0 3px rgba(10, 95, 56, 0.5)',
  none: 'none',
};

// Transitions
export const transitions = {
  default: 'all 0.3s ease',
  fast: 'all 0.15s ease',
  slow: 'all 0.5s ease',
  bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',  // 2px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',  // Full rounded (circles)
};

// Z-index
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Animation keyframes
export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,
};

// Animation definitions
export const animations = {
  fadeIn: `animation: fadeIn 0.3s ease-in-out;`,
  slideUp: `animation: slideUp 0.4s ease-out;`,
  pulse: `animation: pulse 1.5s infinite ease-in-out;`,
  spin: `animation: spin 1s linear infinite;`,
  bounce: `animation: bounce 0.5s ease-in-out;`,
};

// Media queries
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints['2xl']}px)`,
  dark: '@media (prefers-color-scheme: dark)',
  light: '@media (prefers-color-scheme: light)',
  hover: '@media (hover: hover)',
  motion: '@media (prefers-reduced-motion: no-preference)',
  motionReduce: '@media (prefers-reduced-motion: reduce)',
};

export default {
  colors,
  typography,
  spacing,
  shadows,
  transitions,
  borderRadius,
  zIndex,
  keyframes,
  animations,
  breakpoints,
  mediaQueries,
}; 