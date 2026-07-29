/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#faf6f1',
          100: '#f0e6da',
          200: '#dfc9ac',
          300: '#cba97e',
          400: '#b3855a',
          500: '#8c6142',
          600: '#6f4a32',
          700: '#563a29',
          800: '#402a1f',
          900: '#2a1c15',
          950: '#1a110c',
        },
      },
    },
  },
  plugins: [],
}
