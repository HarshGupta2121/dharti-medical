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
          light: '#34D399', // Emerald-400
          DEFAULT: '#059669', // Emerald-600 - Matching the deep green in the image
          dark: '#065F46', // Emerald-800
        },
        secondary: {
          light: '#ECFDF5', // Emerald-50
          DEFAULT: '#D1FAE5', // Emerald-100
        },
        accent: {
          DEFAULT: '#0EA5E9', // Sky-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
