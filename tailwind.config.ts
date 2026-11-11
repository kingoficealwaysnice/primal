import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primal: {
          bg: '#080B14',
          secondary: '#101626',
          card: '#151D30',
          cardHover: '#1B253D',
          accent: '#725CFF',
          accentLight: '#9482FF',
          cyan: '#00D4FF',
          cyanGlow: '#00D4FF33',
          success: '#27E58C',
          warning: '#FFB547',
          danger: '#FF5263',
          text: '#F5F7FF',
          muted: '#929DB5',
          border: 'rgba(114, 92, 255, 0.18)',
          glow: 'rgba(114, 92, 255, 0.35)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        cinzelDec: ['Cinzel Decorative', 'serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 25px -5px rgba(114, 92, 255, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(0, 212, 255, 0.35)',
        'glow-sm': '0 0 12px -2px rgba(114, 92, 255, 0.25)',
        'hunter-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config

