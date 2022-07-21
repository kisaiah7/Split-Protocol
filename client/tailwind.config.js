/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    backgroundImage: {
      "navbar-gradient":
        "linear-gradient(180deg, rgba(42, 37, 55, 0.7) 0%, #2A2537 0%, rgba(53, 47, 70, 0.99) 100%)",
      "body-gradient":
        "linear-gradient(180deg, #2A2537 0%, #2A2537 0%, #2A2537 0.01%, #413A55 100%)",
      "btn-gradient":
        "linear-gradient(90deg, #4700FF 0%, #9166FF 100%, #9166FF 100%)",
      "cancel-gradient": "linear-gradient(90deg, #2A2537 0%, #584E73 100%)",
      "accommodation-gradient":
        "linear-gradient(90deg, #F2B20D 0%, #F76E6E 100%)",
      "transportation-gradient":
        "linear-gradient(90deg, #F2E90D 0%, #0DF292 100%)",
      "foodanddrinks-gradient":
        "linear-gradient(90deg, #6E7BF7 0%, #0DD7F2 100%)",
      "misc-gradient": "linear-gradient(90deg, #656565 0%, #A3A3A3 100%)",
      "paid-btn-gradient": "linear-gradient(90deg, #13B942 0%, #11D5D5 100%)",
      "unpaid-btn-gradient": "linear-gradient(90deg, #FF9900 0%, #FFDD66 100%)",
    },
    fontFamily: {
      sans: ["Noto Sans", "system-ui"],
    },
    backgroundColor: {
      secondary: "#1E1B28",
      tertiary: "#2A2537",
      "form-field": "#353046",
    },
    colors: {
      primary: "#FFFFFF",
      secondary: "#E6E6E6",
      muted: "#C8C2D6",
      tertiary: "#2A2537",
    },
    fontSize: {
      "2xs": ".5rem",
      xs: ".75rem",
      sm: ".875rem",
      tiny: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },
  },
  plugins: [],
};
