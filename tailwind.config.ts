import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF5FC',
          100: '#D6E6F7',
          200: '#AECDEF',
          500: '#1B64B5',
          600: '#15559C',
          700: '#104580',
          900: '#0A2A4F',
        },
        accent: {
          500: '#E0301E',
          600: '#C22716',
        },
        ink: {
          DEFAULT: '#0F1B2D',
          muted: '#4F5B6B',
          subtle: '#8A96A5',
        },
        line: '#E3E8EF',
        canvas: '#F5F7FA',
        success: { 50: '#ECFDF3', 600: '#12B76A', 700: '#067647' },
        warning: { 50: '#FFFAEB', 600: '#F79009', 700: '#B54708' },
        danger: { 50: '#FEF3F2', 600: '#F04438', 700: '#B42318' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
