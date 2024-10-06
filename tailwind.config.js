
/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  //darkMode: "class",

  theme: {
    extend: {
      maxHeight: {
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
      },
      colors: {
        'scrollbar-thumb': 'rgb(107, 114, 128)',
        primary: {
          light: '#3B82F6', // màu chính cho light mode
          dark: '#60A5FA',  // màu chính cho dark mode
        },
        secondary: {
          light: '#10B981', // màu phụ cho light mode
          dark: '#34D399',  // màu phụ cho dark mode
        },
        background: {
          light: '#F3F4F6', // màu nền cho light mode
          dark: '#1F2937',  // màu nền cho dark mode
        },
        text: {
          light: '#1F2937', // màu chữ cho light mode
          dark: '#F9FAFB',  // màu chữ cho dark mode
        },
      },
    },
    container: {
      center: true,
      padding: "1.5rem",
    },
    spacing: {
      "1": "8px",
      "2": "12px",
      "3": "16px",
      "4": "24px",
      "5": "32px",
      "6": "48px",
      "7": "64px",
      "8": "80px",
      "9": "96px",
      "10": "112px",
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      tiny: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
      '8xl': '6rem',
      '9xl': '7rem',
      '10xl': '8rem',
      '11xl': '9rem',
    },
    screens: {
      vs: '320px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1600px',
    },
    fontFamily: {
      display: ['Gilroy', 'sans-serif'],
      body: ['Graphik', 'sans-serif'],
    },
    variants: {
      scrollbar: ['rounded']
    },

  },
  plugins: [],
}

