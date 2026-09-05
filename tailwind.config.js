/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mat: {
          primary: '#0B132B',
          primaryDark: '#050A17',
          secondary: '#2E7D32',
          secondaryDark: '#1B5E20',
          surface: '#FFFFFF',
          bg: '#F5F5F5',
          critical: '#D32F2F',
          high: '#F57C00',
          medium: '#FBC02D',
          low: '#1976D2',
        },
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
          900: '#0B132B',
          950: '#050A17',
        },
        civic: {
          primary: '#0B132B',
          secondary: '#1E3A8A',
          accent: '#2E7D32',
          gold: '#FBC02D',
          amber: '#F57C00',
          crimson: '#D32F2F',
        }
      },
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'elevation-2': '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
        'elevation-3': '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
        'elevation-4': '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
        'elevation-6': '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)',
        'elevation-8': '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
      },
      borderRadius: {
        'mat': '4px',
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
