/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.html"],
  theme: {
    extend: {
      colors: {
        "very-dark-gray": "hsl(0, 0%, 17%)",
        "dark-gray": "hsl(0, 0%, 59%)",
        Attri: "hsl(228, 45%, 44%)",
      },
      fontFamily: {
        rubik: ["Rubik", "sans-serif"],
      },
      fontSize: {
        html: "62.5%",
        desktop: "75%",
        land: "58%",
        port: "53%",
        18: "18px",
      },
      backgroundImage: {
        "pattern-d": "url('./images/pattern-bg-desktop.png')",
        "pattern-m": "url('./images/pattern-bg-mobile.png')",
      },
      screens: {
        "large-desktop": "1800px", // 1800px
        tl: "1160px", // tablet-landscape
        tp: "990px", // tablet-portrait
        bp: "770px", // big-phone
      },
      keyframes: {
        // Menu bar
        go: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(105%)" },
        },
      },
      animation: {
        // Menu bar animations
        go: "go 0.3s cubic-bezier(1, 0, 0, 1) both",
      },
    },
  },
  plugins: [],
};
