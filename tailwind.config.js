/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        portal: {
          bg: '#F8F9FE',
          surface: '#F5F4FE',
          card: '#FFFFFF',
          border: '#E4E0FF',
          primary: '#6C5CE7',
          primaryHover: '#5849E0',
          cyan: '#00C2FF',
          cyanLight: '#E0F7FE',
          indigoDark: '#3C388B',
          textDark: '#1E1B4B',
          textMuted: '#64748B',
        },
      },
    },
  },
  plugins: [],
};
