/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#163172',
        'secondary-blue': '#1E56A0',
        'cold-blue': '#D6E4F0',
        'cool-gray': '#F6F6F6',
      },
    },
  },
  variants: {
    extend: {
      textColor: ['active'],
      fontWeight: ['active', 'focus'],
    },
  },
  plugins: [],
}

