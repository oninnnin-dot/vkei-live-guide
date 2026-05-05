/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#09070f',
        panel: '#15111f',
        line: '#2b213a',
        violet: '#9b5cff',
        magenta: '#ff4faf',
        mist: '#f6f1ff',
        muted: '#b7aacd',
        amber: '#ffc857',
        cyan: '#5eead4',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(155, 92, 255, 0.22), 0 18px 60px rgba(0, 0, 0, 0.32)',
      },
    },
  },
  plugins: [],
};
