export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mayla-dark': '#0d0a14',
        'mayla-lavender': '#e8c8ff',
        'mayla-rose': '#f9b8d4',
      },
      fontFamily: {
        'clash': ['Clash Display', 'sans-serif'],
        'dm': ['DM Sans', 'sans-serif'],
        'cormorant': ['Cormorant Garamond', 'serif'],
      }
    },
  },
  plugins: [],
}