import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
})

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Replace greenTheme with stone for light mode accents
        primary: {
          50: '#fafaf9',    // stone-50
          100: '#f5f5f4',   // stone-100
          200: '#e7e5e4',   // stone-200
          300: '#d6d3d1',   // stone-300
          400: '#a8a29e',   // stone-400
          500: '#78716c',   // stone-500
          600: '#57534e',   // stone-600
          700: '#44403c',   // stone-700
          800: '#292524',   // stone-800
          900: '#1c1917',   // stone-900
        },
        // For dark theme, you can use stone darker shades
        darkTheme: {
          900: '#1c1917', // stone-900
          800: '#292524', // stone-800
          700: '#44403c', // stone-700
          500: '#78716c', // stone-500
        },
      },
    },
  },
  plugins: [],
}
