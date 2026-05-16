/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mango: '#F59E0B',
        'mango-deep': '#D97706',
        'mango-light': '#FEF3C7',
        green: '#065F46',
        cream: '#FDF8F0',
        dark: '#1C1208',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(28,18,8,0.10)',
      },
    },
  },
  plugins: [],
}
