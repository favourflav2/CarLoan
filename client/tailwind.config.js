/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // backgroundImage: {
      //   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      //   'gradient-conic':
      //     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      // },
      colors: {
        // Dark Theme
        chartBlue: '#1fb6ff',
        navBar: '#1b1c23',
        homeBg: '#13121B',
        homeText: '#FFF',
        smallNavBarBg: '#1F1934',

        // Light Theme
        lightHomeBg: '#F3F5F9',
        lightNavBar: '#d1d5db',
        lightHomeText: '#181826',
        lightSmallNavBarBg: '#353574',
        lightSmallNavBarText: '#D1D1D1',

        // Chart Colors
        chartGreen: '#4ade80',
        darkBgChart: '#1F1934',
        priceChartBg: '#191934',
        lightChartsBg: '#FFF',

        // Navbar themes
        selectedPageColor: '#8a8b8aab',
        boxBg: '#191926',
        lightBoxBg: '#a2a2e12e',
        lightBoxText: '#9090fc66',
        lightBoxBgDropDown: '#a2a2e160',
        darkSelectedColor: '#1b55e9',
        lightSelectedColor: '#6161de7f',

        // Postive and Negative Ticks
        postiveTick: '#00F5E4',
        negativeTick: '#FF0061',
        lightNegativeTick:'',
        lightPositiveTick:'#00B4A7',

        // Legned Colors For Chart
        lineChartBitcoinColor: '#7474F2',
        barChartBitcoinColor: '#A75EE0',
        lineChartCompareColor: '#A75EE0',
        barChartCompareColor: '#7474F2',

        // Mobile Fix Div Themes
        fixedDivDarkBg: '#191926AB',
      },

      // Box Shadows
      boxShadow: {
        darkPurpelGlow: '0px 1px 3px 2px #3163e0',
        lightPurpleGlow: '0px 1px 3px 2px #A2A2E160',
        fixedDivBoxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

// #3535d2
// #6161D6