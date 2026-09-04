/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f6fc',
          100: '#e1ecf8',
          200: '#c3dbf2',
          300: '#94c0e8',
          400: '#5e9fdb',
          500: '#3980ce',
          600: '#2566b6',
          700: '#1d5194',
          800: '#1a447a',
          900: '#0f2942',
          950: '#0a192c',
        },
        civic: {
          primary: '#0F2942',
          secondary: '#1E3A8A',
          accent: '#10B981',
          gold: '#F59E0B',
          amber: '#D97706',
          crimson: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      }
    },
  },
  plugins: [],
}
