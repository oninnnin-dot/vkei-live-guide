/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        panel: '#09070d',
        line: '#3a2b1d',
        violet: '#5b1020',
        magenta: '#74182a',
        mist: '#f5efe7',
        muted: '#b8aa9a',
        amber: '#b99a5b',
        cyan: '#d6b66d',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(185, 154, 91, 0.18), 0 24px 70px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
};
