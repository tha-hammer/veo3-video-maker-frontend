/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Metronic color palette
        'kt-primary': '#009EF7',
        'kt-primary-active': '#0095E8',
        'kt-primary-light': '#F1FAFF',
        'kt-success': '#50CD89',
        'kt-info': '#7239EA',
        'kt-warning': '#FFC700',
        'kt-danger': '#F1416C',
        'kt-dark': '#181C32',
        'kt-muted': '#A1A5B7',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 