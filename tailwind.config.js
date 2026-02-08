// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Body: The clean, tech look (Option 1)
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        // Headings: The artistic, premium look (Option 3)
        display: ['"Syne"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
