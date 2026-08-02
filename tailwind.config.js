/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0d2624',
          900: '#163735',
          800: '#1d403e',
          700: '#214846',
          600: '#2a5754',
        },
        blush: {
          400: '#F9B4D0',
          500: '#F38BBC',
        },
        butter: '#FFF2A6',
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        stats: ['"Space Grotesk"', 'system-ui', 'monospace'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(243, 139, 188, 0.45)',
        'glow-green': '0 0 40px -8px rgba(52, 199, 123, 0.35)',
        card: '0 24px 60px -24px rgba(0, 0, 0, 0.55)',
        'card-hover': '0 40px 80px -24px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
