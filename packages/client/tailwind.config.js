/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
        secondary: '#10b981',
        background: '#000000',
        
        surface: {
          DEFAULT: '#1e293b',
          light: '#334155',
        },
        text: {
          DEFAULT: '#ffffff',
          muted: '#94a3b8',
        },
        border: '#1e293b',
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#22c55e',
        // Risk level themes
        'risk-low': {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#059669',
          card: '#000000',
          badge: '#10b981',
          button: '#10b981',
        },
        'risk-medium': {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          dark: '#d97706',
          card: '#000000',
          badge: '#f59e0b',
          button: '#f59e0b',
        },
        // Grey shades for various elements
        grey: {
          badge: '#e5e7eb',
          'badge-text': '#374151',
          inactive: '#374151',
          'info-card': '#334155',
          'info-border': '#e5e7eb',
        },
      },
    },
  },
  plugins: [],
}

