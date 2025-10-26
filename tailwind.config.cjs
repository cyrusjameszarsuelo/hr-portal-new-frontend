const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      height: ['portrait', 'landscape'], // ✅ belongs here
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('portrait', '@media (orientation: portrait)')  // ✅ correct place
      addVariant('landscape', '@media (orientation: landscape)')
    },
  ],
}