const twTypography = require("@tailwindcss/typography");

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#020617",
      },
      keyframes: {
        "slide-fade": {
          "0%": { opacity: 0, transform: "translateY(-20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        glitter: {
          "0%, 100%": { opacity: 0, transform: "scale(0.5)" },
          "50%": { opacity: 1, transform: "scale(1.2)" },
        },
        sparkle: {
          "0%, 100%": { opacity: 0 },
          "50%": { opacity: 1 },
        },
      },
      animation: {
        "slide-fade": "slide-fade 1s ease-out forwards",
        shine: "shine 3s linear infinite",
        glitter: "glitter 1.5s ease-in-out infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [twTypography],
};
