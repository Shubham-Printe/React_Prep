/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'pot-bump': {
          '0%': { transform: 'scale(1)' },
          '35%': { transform: 'scale(1.07)' },
          '100%': { transform: 'scale(1)' },
        },
        'seat-bet': {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '40%': { transform: 'scale(1.05)', filter: 'brightness(1.15)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
        },
        'seat-fold': {
          '0%': { transform: 'rotate(0deg) scale(1)', opacity: '1', filter: 'grayscale(0)' },
          '100%': { transform: 'rotate(-2deg) scale(0.97)', opacity: '0.75', filter: 'grayscale(0.85)' },
        },
      },
      animation: {
        'pot-bump': 'pot-bump 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'seat-bet': 'seat-bet 0.5s ease-out',
        'seat-fold': 'seat-fold 0.45s ease-out forwards',
      },
    },
  },
  plugins: [],
};
