/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        soc: {
          bg: '#090d16',
          card: '#121824',
          cardHover: '#1a2232',
          border: '#1e293b',
          accent: '#2563eb',
          steel: '#3b82f6',
          cyan: '#0284c7',
          blue: '#2563eb',
          indigo: '#3b82f6',
          purple: '#7c3aed',
          emerald: '#10b981',
          amber: '#d97706',
          orange: '#ea580c',
          rose: '#e11d48',
          red: '#ef4444',
          textMuted: '#64748b',
          textSecondary: '#94a3b8',
          textMain: '#f8fafc'
        }
      }
    },
  },
  plugins: [],
}
