/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Blue tint premium + popping kid-friendly yet professional
        surface: {
          DEFAULT: '#f0f4ff',
          dark: '#0f172a',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#1e293b',
        },
        muted: {
          DEFAULT: '#64748b',
          dark: '#94a3b8',
        },
        accent: {
          lavender: '#e0e7ff',
          peach: '#ffedd5',
          mint: '#ccfbf1',
          sky: '#e0f2fe',
          coral: '#fecdd3',
          lemon: '#fef08a',
        },
        primary: {
          DEFAULT: '#2563eb',
          light: '#3b82f6',
          dark: '#1d4ed8',
        },
        success: { DEFAULT: '#10b981' },
        gentle: { DEFAULT: '#93c5fd' },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0,0,0,0.06)',
        card: '0 2px 12px rgba(0,0,0,0.04)',
        '3d': '0 10px 40px -10px rgba(0,0,0,0.12), 0 4px 12px -4px rgba(0,0,0,0.06)',
        '3d-lg': '0 20px 50px -15px rgba(0,0,0,0.15), 0 8px 20px -8px rgba(0,0,0,0.08)',
        inner: 'inset 0 2px 4px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
