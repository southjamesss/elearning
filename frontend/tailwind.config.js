/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // <- ให้ Tailwind รู้ว่าจะใช้ในไฟล์ JSX
  theme: {
    extend: {
      colors: {
        primary: "#ff4d6d",
        secondary: "#ff9e00",
        background: "#0f172a",
        text: "#ffffff",
      },
    },
  },
  plugins: [],
};