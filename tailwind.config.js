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
        primary: {
          DEFAULT: '#1a3a5c',
          light: '#2d5a87'
        },
        accent: {
          DEFAULT: '#4fa3e8',
          hover: '#3d8fd4'
        }
      }
    },
  },
  plugins: [],
}
