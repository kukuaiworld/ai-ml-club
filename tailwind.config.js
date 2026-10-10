/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#8b5cf6',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#4c1d95',
        },
        dark: {
          bg: '#12061f',
          surface: '#1d0a30',
          card: '#250e3d',
          'card-hover': '#311350',
          border: 'rgba(216, 180, 254, 0.14)',
          'border-hover': 'rgba(192, 132, 252, 0.45)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(12, 3, 24, 0.65)',
        'elevated': '0 10px 30px -4px rgba(10, 2, 20, 0.8)',
        'subtle-purple': '0 0 28px -4px rgba(168, 85, 247, 0.38)',
        'subtle-blue': '0 0 22px -4px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [],
}
