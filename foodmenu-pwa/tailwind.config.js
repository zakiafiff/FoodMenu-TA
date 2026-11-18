const c = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: c('surface'),
        'surface-lowest': c('surface-lowest'),
        'surface-low': c('surface-low'),
        'surface-container': c('surface-container'),
        'surface-high': c('surface-high'),
        'surface-highest': c('surface-highest'),
        'on-surface': c('on-surface'),
        'on-surface-variant': c('on-surface-variant'),
        outline: c('outline'),
        'outline-variant': c('outline-variant'),
        primary: c('primary'),
        'primary-container': '#f97316',
        'on-primary-container': '#2b1000',
        secondary: c('secondary'),
        'secondary-container': c('secondary-container'),
        tertiary: c('tertiary'),
        danger: c('danger'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '1rem', lg: '2rem', xl: '3rem' },
    },
  },
  plugins: [],
};
