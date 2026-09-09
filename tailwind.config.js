/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['variant', ['.dark &', '&.dark']],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        japanese: [
          '"Zen Maru Gothic"',
          '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"',
          '"Yu Gothic"',
          'Meiryo',
          '"Noto Sans JP"',
          'sans-serif'
        ],
        calligraphy: [
          '"Shippori Mincho"',
          '"Noto Serif JP"',
          'serif'
        ]
      },
      colors: {
        washi: {
          50: '#faf8f5',
          100: '#f5f2eb',
          200: '#ebe5d8',
          300: '#ddd4c3',
          400: '#c5b8a1',
        },
        sumi: {
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        sakura: {
          50: '#fff5f7',
          100: '#ffe4ea',
          200: '#fecdd8',
          300: '#fda4ba',
          400: '#fb7195',
          500: '#f43f72',
          600: '#e11d59',
          700: '#be1249',
          800: '#9e1241',
          900: '#85143a',
        },
        zen: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          750: '#243044',
          800: '#1e293b',
          850: '#151e2e',
          900: '#0f172a',
          950: '#080d1a',
        }
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        pop: 'pop 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
