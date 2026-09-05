/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E8C5C',
          light: '#4CB582',
          dark: '#1B5B3A',
        },
        background: '#F7FCF9', // soft off-white/very light green
        pastel: {
          green: '#D1F2D9',
          purple: '#E3D7FF',
          blue: '#D4EBF8',
          yellow: '#FFF3CD',
          orange: '#FFE0C2',
          red: '#FFD1D1'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        'lg': '12px',
        'md': '8px',
      }
    },
  },
  plugins: [],
}
