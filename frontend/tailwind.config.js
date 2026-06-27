/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rock: {
          950: '#0b0a09',
          900: '#1a1714',
          800: '#282320',
          700: '#3a332e',
          600: '#52463f',
          500: '#6e5f56',
          400: '#8f7d72',
          300: '#b0a098',
          200: '#d0c8c2',
          100: '#ede9e5',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
