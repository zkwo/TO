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
        darkBg: '#08090d',
      },
      fontFamily: {
        onest: ['Onest', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        float1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(80px, 40px) scale(1.15)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1.1)' },
          '50%': { transform: 'translate(-60px, -50px) scale(0.95)' },
        }
      },
      animation: {
        'float-1': 'float1 14s ease-in-out infinite',
        'float-2': 'float2 18s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
