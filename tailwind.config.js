// tailwind.config.js
const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(form|input|modal|navbar).js"
  ],
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: '#6B0F1A',
            foreground: '#ffffff',
          },
          secondary: {
            DEFAULT: '#C9A961',
            foreground: '#1A1A1A',
          },
          success: {
            DEFAULT: '#2C5530',
            foreground: '#ffffff',
          },
          warning: {
            DEFAULT: '#C9A961',
            foreground: '#1A1A1A',
          },
          background: '#FAF8F5',
          foreground: '#2C2C2C',
        },
      },
    },
  })],
};