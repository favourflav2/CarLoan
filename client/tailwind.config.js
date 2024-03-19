/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // backgroundImage: {
      //   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      //   'gradient-conic':
      //     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      // },
      colors: {
        // Dark Theme
        chartBlue: "#1fb6ff",
        navBar: "#1b1c23",
        homeBg: "	#100c08",
        lightDashboardText: "#929292",
        lightText: "black",

        // Light Theme
        darkText: "#d1d5db",
        darkDashboardText: "#a2a2a2",
        lightHomeBg: '#F3F5F9',

        // Chart Colors
        chartGreen: "#00A36C",
        chartYellow: "#FFAA33",
      },

      // Box Shadows
      boxShadow: {
        darkPurpelGlow: "0px 1px 3px 2px #3163e0",
        lightPurpleGlow: "0px 1px 3px 2px #A2A2E160",
        fixedDivBoxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

// #3535d2
// #6161D6
