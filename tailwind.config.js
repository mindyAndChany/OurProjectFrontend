/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./src/**/*.{js,jsx,ts,tsx}",],
   safelist: [
    "bg-variable-collection-color-1",
    "bg-variable-collection-color-2",
    "bg-variable-collection-color-3",
    "bg-variable-collection-color-4",
    "bg-variable-collection-color-5",
    "text-variable-collection-color-1",
    "text-variable-collection-color-2",
    "text-variable-collection-color-3",
    "text-variable-collection-color-4",
    "text-variable-collection-color-5",
    "border-variable-collection-color-4",
  ],
  theme: {
    extend: { 
      colors: {
        "variable-collection-11": "var(--variable-collection-11)",
        "variable-collection-color-1": "var(--variable-collection-color-1)",
        "variable-collection-color-2": "var(--variable-collection-color-2)",
        "variable-collection-color-3": "var(--variable-collection-color-3)",
        "variable-collection-color-4": "var(--variable-collection-color-4)",
        "variable-collection-color-5": "var(--variable-collection-color-5)",
      },
      // Responsive Container Sizes
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          md: '2rem',
          lg: '3rem',
          xl: '4rem',
          '2xl': '5rem',
        },
      },
      // Responsive Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      // Responsive Font Sizes
      fontSize: {
        'xs-mobile': ['0.7rem', { lineHeight: '1rem' }],
        'sm-mobile': ['0.8rem', { lineHeight: '1.2rem' }],
        'base-mobile': ['0.9rem', { lineHeight: '1.4rem' }],
        'lg-mobile': ['1rem', { lineHeight: '1.5rem' }],
      },
      // Responsive Screens (הוספת breakpoints מותאמים אישית)
      screens: {
        'xs': '480px',
        '3xl': '1920px',
      },
      // Animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

