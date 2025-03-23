
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      
    ],
  
    theme: {
      clipPath: {
        octagon:
          'polygon(50% 0px, 95% 5%, 100% 50%, 95% 95%, 50% 100%, 5% 95%, 0px 50%, 5% 5%)',
      },
      screens: {
        fourK: '2560px',
        laptopL: '1440px',
        laptopM:'1200px',
        laptop: '1024px',
        laptopS: '896px',
        tablet: '768px',
        tabletS: '524px',
        tabletM: '624px',
        mobileL: '425px',
        mobileM: '375px',
        mobileS: '320px',
        navBreakM: '547px',
      },
      extend: {
        borderRadius: {
          standard: '20px',
        },
        keyframes: {
          wiggle: {
            '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' },
          },
        },
        colors: {
          customGray: '#9598AE',
          Black: '#343C45',
          dBlack: '#161717',
          White: '#E8E8E8',
          BlackSec: '#9598AE',
          BlackTer: '#E8E9F3',
          WhiteSec: '#efefef',
          Red: '#F24423',
          Blue: '#5784F7',
          DarkBlue: '#02042b',
          bgBlack: '#202020',
          bgBlackSec: '#171818',
          bgWhiteSec: '#EEEFF5',
          Green: '#00CE92',
          WhiteTer: '#F1F2F7',
        },
        keyframes: {
          bounceRight: {
            '0%, 100%': {
              transform: 'translateX(-25%)',
              'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
            },
            '50%': {
              transform: 'translateX(0)',
              'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
            },
          },
          popUp: {
            from: {
              transform: 'scale(0)',
            },
            to: {
              transform: 'scale(1)',
            },
          },
        },
        animation: {
          wiggle: 'wiggle 0.2s ease-in-out 3',
          wiggleInfinite: 'wiggle 0.2s ease-in-out infinite',
          bounceRight: 'bounceRight 1s ease-in-out infinite',
          popUp: 'popUp 0.4s',
        },
        fontFamily: {
          openS: ['Open Sans', 'sans-serif'],
          josefinSans: ['Josefin Sans', 'sans-serif'],
          mPlus: ["'M PLUS 1'", 'sans-serif'],
          noto: ['Nunito Sans', 'sans-serif'],
        },
        boxShadow: {
          deep: '0px 4px 20px 15px rgba(0, 0, 0, 0.1)',
        },
        backgroundImage: {
          wave: 'linear-gradient(90deg, rgba(87, 133, 248, 0.09) 0%, #5EC4FF 100%)',
        },
      },
    },
    plugins: [require('tailwind-clip-path')],
  }
  