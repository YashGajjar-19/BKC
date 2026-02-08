// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Body: Clean, readable, tech-forward
        sans: [ '"Plus Jakarta Sans"', 'sans-serif' ],

        // Headings: The "Chaos" personality
        display: [ '"Bricolage Grotesque"', 'sans-serif' ],
      },
    },
  },
  plugins: [],
}
