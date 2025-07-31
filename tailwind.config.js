/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Handcrafted Haven Brand Colors
        primary: '#d97706',
        'primary-50': '#fefbec',
        'primary-100': '#fef3c7',
        'primary-200': '#fde68a',
        'primary-300': '#fcd34d',
        'primary-400': '#fbbf24',
        'primary-500': '#f59e0b',
        'primary-600': '#d97706',
        'primary-700': '#b45309',
        'primary-800': '#92400e',
        'primary-900': '#78350f',
        'primary-dark': '#b45309',
        
        secondary: '#92400e',
        'secondary-50': '#fefbec',
        'secondary-100': '#fef3c7',
        'secondary-200': '#fde68a',
        'secondary-300': '#fcd34d',
        'secondary-400': '#fbbf24',
        'secondary-500': '#f59e0b',
        'secondary-600': '#d97706',
        'secondary-700': '#b45309',
        'secondary-800': '#92400e',
        'secondary-900': '#78350f',
        
        accent: '#f59e0b',
        'accent-50': '#fefbec',
        'accent-100': '#fef3c7',
        'accent-200': '#fde68a',
        'accent-300': '#fcd34d',
        'accent-400': '#fbbf24',
        'accent-500': '#f59e0b',
        'accent-600': '#d97706',
        'accent-700': '#b45309',
        'accent-800': '#92400e',
        'accent-900': '#78350f',
      },
      fontFamily: {
        brand: ['Pacifico', 'cursive'],
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
}
