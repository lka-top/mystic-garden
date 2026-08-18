import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './utils/**/*.{js,ts}',
    './composables/**/*.{js,ts}',
    './error.vue'
  ],
  theme: {
    extend: {
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        accent: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        surface: {
          base: '#f6f9fc',
          container: '#ffffff',
          'container-high': '#f1f5f9',
          dark: '#0b1120',
          'dark-container': '#131c31',
          'dark-high': '#1a2542'
        }
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 30px -4px rgba(0, 0, 0, 0.09)',
        'glow': '0 0 25px -5px var(--tw-shadow-color)'
      }
    }
  },
  plugins: [
    typography
  ]
} satisfies Config
