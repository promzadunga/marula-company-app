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
        // Marula Oil page — design system from cousin's brief
        marula: {
          'green-deep': '#1B3A2E',
          'green-medium': '#2D5442',
          'gold': '#C89B3F',
          'gold-light': '#D4A94A',
          'gold-dark': '#A67C2E',
          'cream': '#F5EFE0',
          'cream-light': '#FBF7ED',
          'nut-brown': '#6B4423',
          'text-dark': '#2A2A2A',
          'text-muted': '#6B6B6B',
        },
        // Engineering page — dark charcoal/slate palette
        eng: {
          'navy-deep': '#1A1A1A',
          'navy': '#2E2E2E',
          'steel': '#4A4A4A',
          'sky': '#5D8BB8',
          'cream': '#F8F6F0',
          'cream-light': '#FBFAF6',
          'gray-warm': '#E8E4DC',
          'gray-mid': '#7F8C8D',
        },
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
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
