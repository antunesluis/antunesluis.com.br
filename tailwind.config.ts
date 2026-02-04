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
      sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      mono: ['var(--font-jetbrains-mono)', ...defaultTheme.fontFamily.mono],
      serif: [
        'var(--font-bricolage-grotesque)',
        ...defaultTheme.fontFamily.serif,
      ],
    },
  },
  plugins: [],
} satisfies Config;
