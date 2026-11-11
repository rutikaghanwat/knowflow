/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#142640',
          dark: '#0E1C30',
          deep: '#091322',
          light: '#1B3457',
          surface: '#18304F',
          border: '#23416B',
        },
        emerald: {
          DEFAULT: '#218653',
          dark: '#1B6E44',
          light: '#28A766',
          subtle: '#EBF7F0',
          hover: '#1E7B4C',
        },
        forest: {
          DEFAULT: '#183B35',
          dark: '#122C27',
          light: '#22524A',
          hover: '#1F4A42',
        },
        sage: {
          DEFAULT: '#2F6B5D',
          dark: '#26574B',
          light: '#3D8675',
          subtle: '#E3EFEA',
        },
        mint: {
          DEFAULT: '#E8F2ED',
          light: '#F2F8F5',
          hover: '#D9ECE1',
          border: '#D0E3D9',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F7F8F6',
          muted: '#F0F4F2',
          hover: '#F3F6F4',
          canvas: '#F5F7F6',
        },
        content: {
          primary: '#202B28',
          secondary: '#687570',
          muted: '#8E9B96',
          inverse: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5EAE6',
          subtle: '#EDF1EE',
          dark: '#CFD7D2',
        },
        status: {
          success: '#26734D',
          'success-bg': '#EBF7F0',
          'success-border': '#C3E7D3',
          warning: '#B7791F',
          'warning-bg': '#FEF7EB',
          'warning-border': '#F6DEB5',
          error: '#B54747',
          'error-bg': '#FDF2F2',
          'error-border': '#F8C8C8',
          info: '#2F6B5D',
          'info-bg': '#E8F2ED',
          'info-border': '#CBE2D7',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
        'card-lg': '16px',
        'card-xl': '24px',
        'card-sm': '10px',
        'control': '8px',
        'pill': '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(20, 38, 64, 0.04)',
        'resting': '0 2px 8px -2px rgba(20, 38, 64, 0.06), 0 1px 4px -1px rgba(20, 38, 64, 0.04)',
        'raised': '0 12px 24px -4px rgba(20, 38, 64, 0.08), 0 4px 8px -2px rgba(20, 38, 64, 0.04)',
        'card': '0 1px 3px 0 rgba(20, 38, 64, 0.05), 0 1px 2px -1px rgba(20, 38, 64, 0.05)',
        'card-hover': '0 8px 20px -3px rgba(20, 38, 64, 0.08), 0 4px 8px -2px rgba(20, 38, 64, 0.04)',
        'dropdown': '0 10px 15px -3px rgba(20, 38, 64, 0.08), 0 4px 6px -4px rgba(20, 38, 64, 0.04)',
        'modal': '0 20px 30px -5px rgba(20, 38, 64, 0.12), 0 8px 12px -6px rgba(20, 38, 64, 0.06)',
        'pill': '0 4px 14px 0 rgba(33, 134, 83, 0.25)',
      },
      animation: {
        'blob-slow': 'blob 24s infinite alternate ease-in-out',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.08)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
