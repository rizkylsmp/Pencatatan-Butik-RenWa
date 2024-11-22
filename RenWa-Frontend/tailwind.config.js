/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lexend: ["'Lexend'", "sans-serif"],
        readex: ["'Readex Pro'"],
        palanquin: ["Palanquin"],
        nunito: ["Nunito Sans"],
        opensans: ["Open Sans"],
        lato: ["Lato"],
        montserrat: ["Montserrat"],
        raleway: ["Raleway"],
        poppins: ["Poppins"],
      },
      backgroundColor: {
        "color-1": "#010101",
        "color-2": "#5f43b2",
        "color-3": "#fefdfd",
        "color-4": "#b1aebb",
        "color-5": "#3a3153",
        "color-6": "#dddddd",
      },
      textColor: {
        "color-1": "#010101",
        "color-2": "#5f43b2",
        "color-3": "#fefdfd",
        "color-4": "#b1aebb",
        "color-5": "#3a3153",
      },
      borderColor: {
        "color-1": "#010101",
        "color-2": "#5f43b2",
        "color-3": "#fefdfd",
        "color-4": "#b1aebb",
        "color-5": "#3a3153",
      },
      ringColor: {
        "color-1": "#010101",
        "color-2": "#5f43b2",
        "color-3": "#fefdfd",
        "color-4": "#b1aebb",
        "color-5": "#3a3153",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#b1aebb",
        },
      },
    ],
    darkTheme: "light",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
};
