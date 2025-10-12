import { type Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-space-grotesk)', ...defaultTheme.fontFamily.sans],
      serif: ['var(--font-space-grotesk)', ...defaultTheme.fontFamily.serif],
    },
  },
  plugins: [],
} satisfies Config;
