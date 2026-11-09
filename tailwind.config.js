/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coral: "#ff705e",
        ink: "#111111"
      }
    }
  },
  plugins: []
};
