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
          50: '#f0f4ff',
          100: '#e0e9fe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a7f7',
          500: '#0c87eb',
          600: '#0069cc',
          700: '#0054a6',
          800: '#054788',
          900: '#0a3b70',
          950: '#07254a',
        },
        slateDark: '#0b0f19',
        cardDark: '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(12, 135, 235, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(147, 51, 234, 0.4)',
      }
    },
  },
  plugins: [],
}
