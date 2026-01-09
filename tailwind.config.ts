import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f7ff',
          100: '#e6edff',
          200: '#c2d4ff',
          300: '#9ab9ff',
          400: '#6b93ff',
          500: '#3a6bff',
          600: '#2450f4',
          700: '#1c3ed1',
          800: '#1c37a8',
          900: '#1d3284'
        }
      }
    }
  },
  plugins: []
};

export default config;
