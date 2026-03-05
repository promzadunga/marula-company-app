/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors from marulacompany.co.za
        primary: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f2d9bf',
          300: '#e9c094',
          400: '#dea368',
          500: '#c08c4d', // Main gold/bronze
          600: '#a97640',
          700: '#8c5f36',
          800: '#724d31',
          900: '#5f412b',
          950: '#352115',
        },
        // Dark brown for text
        brown: {
          50: '#f6f4f3',
          100: '#e8e3e1',
          200: '#d3cac6',
          300: '#b8aaa3',
          400: '#9a877e',
          500: '#7f6d63',
          600: '#6a5a52',
          700: '#574a44',
          800: '#4a403b',
          900: '#281e19', // Main dark brown
          950: '#1a100c',
        },
        // Accent green
        accent: {
          50: '#f0fdf2',
          100: '#dcfce2',
          200: '#bbf7c6',
          300: '#86ef9c',
          400: '#61ce70', // Main green
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
