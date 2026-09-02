/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: '#FDF5F8',
          card: '#FFFFFF',
          pink: '#F472B6',
          rose: '#FB7185',
          softPink: '#FCE7EC',
          lightPink: '#FFF0F5',
          border: '#F9DDE7',
          purple: '#C084FC',
          purpleLight: '#F3E8FF',
          green: '#10B981',
          greenLight: '#D1FAE5',
          accent: '#FF6584',
          dark: '#374151',
          muted: '#6B7280',
          soft: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Prompt', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(244, 114, 182, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-hover': '0 12px 28px -3px rgba(244, 114, 182, 0.25), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 14px rgba(236, 72, 153, 0.08)',
      }
    },
  },
  plugins: [],
}
