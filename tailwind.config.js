/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    backgroundImage: {
      'navbar-gradient': 'linear-gradient(180deg, rgba(42, 37, 55, 0.7) 0%, #2A2537 0%, #2A2537 0.01%, rgba(65, 58, 85, 0.7) 100%)',
      'body-gradient': 'linear-gradient(180deg, #2A2537 0%, #2A2537 0%, #2A2537 0.01%, #413A55 100%)',
      'btn-gradient': 'linear-gradient(90deg, #4700FF 0%, #9166FF 100%, #9166FF 100%)',
      'house-gradient': 'linear-gradient(90deg, #F2B20D 0%, #F76E6E 100%)'
    },
    fontFamily: {
      'sans': ['Noto Sans', 'system-ui'],
    },
    backgroundColor: {
      'secondary': '#1E1B28',
      'tertiary': '#2A2537'
    },
    colors: {
      'primary': '#FFFFFF',
      'secondary': '#E6E6E6',
      'muted': '#C8C2D6',
      'tertiary': '#2A2537'
    },
    fontSize: {
      '2xs': '.5rem',
      'xs': '.75rem',
      'sm': '.875rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    }
  },
  plugins: [],
}
