/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(250, 204, 21, 0.15), 0 24px 60px rgba(15, 23, 42, 0.45)',
      },
      colors: {
        hyperspace: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#b3d7ff',
          300: '#7fbfff',
          400: '#4aa4ff',
          500: '#2586ff',
          600: '#1568e6',
          700: '#1352b5',
          800: '#143f86',
          900: '#142e5e',
        },
      },
    },
  },
  plugins: [],
};
