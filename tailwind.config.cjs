const twTypography = require("@tailwindcss/typography");

/** @type {import("tailwindcss").Config} */
module.exports = {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
    extend: {
      colors: {
        night: '#020617',
      },
    },
  },
	plugins: [twTypography],
};
