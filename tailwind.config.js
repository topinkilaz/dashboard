/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dmserif': ['DM Serif', 'serif'],
        'com': ['Comfortaa', 'cursive'],
        'montserrat':['Montserrat', 'sans-serif'],
      }
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "870px",
      // => @media (min-width: 768px) { ... }

      lg: "1090px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }

      "3xl": "1720px",
      // => @media (min-width: 1536px) { ... }

      "4xl": "1856px",
      // => @media (min-width: 1536px) { ... }
  }, 
  },
  
 
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
    

  
  ],
}

